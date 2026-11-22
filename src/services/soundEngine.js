// WePlay Studio — Generative Web Audio Soundscape & Tactile UI Foley Engine

const STORAGE_KEY = 'weplay_sound';

// C Major 9 / Pentatonic palette (warm, playful, studio-grade)
const HERO_WORD_NOTES = [
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
  880.00, // A5
  987.77, // B5
  1046.50, // C6
  1174.66, // D6
  1318.51  // E6
];

const SPARKLE_NOTES = [
  523.25, 659.25, 783.99, 987.77, 1174.66, 1318.51, 1567.98
];

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.initialized = false;
    this.enabled = this._loadSavedPreference();
    this.mode = 'hero'; // 'hero' | 'work'
    this.duckReasons = new Set();
    this.sparkleTimer = null;
    this.lastHoverAt = 0;
    this.lastWordAt = 0;
    this.wasRunningBeforeHide = false;
    this.listeners = new Set();

    // Audio nodes
    this.masterGain = null;
    this.ambientGain = null;
    this.sfxGain = null;
    this.heroAmbGain = null;
    this.workAmbGain = null;

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => this._handleVisibilityChange());
    }
  }

  _handleVisibilityChange() {
    if (!this.ctx) return;
    if (document.hidden) {
      this.wasRunningBeforeHide = this.ctx.state === 'running';
      if (this.wasRunningBeforeHide) {
        this.ctx.suspend().catch(() => {});
      }
    } else if (this.enabled && this.wasRunningBeforeHide) {
      this.wasRunningBeforeHide = false;
      this.ctx.resume()
        .then(() => {
          this._applyGains(0.4);
          this._emit();
        })
        .catch(() => {});
    }
  }

  _loadSavedPreference() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Default to enabled (arms cleanly on first user interaction)
      return saved === null ? true : saved === 'on';
    } catch {
      return true;
    }
  }

  _savePreference() {
    try {
      localStorage.setItem(STORAGE_KEY, this.enabled ? 'on' : 'off');
    } catch {
      // ignore storage errors
    }
  }

  onChange(cb) {
    this.listeners.add(cb);
    cb(this.getState());
    return () => this.listeners.delete(cb);
  }

  _emit() {
    const state = this.getState();
    this.listeners.forEach((cb) => cb(state));
  }

  getState() {
    const running = Boolean(this.ctx && this.ctx.state === 'running');
    return {
      enabled: this.enabled,
      active: this.enabled && running,
      waitingForGesture: this.enabled && !running,
      mode: this.mode,
      ducked: this.duckReasons.size > 0
    };
  }

  _createNoiseBuffer(ctx, seconds = 2, pink = true) {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    if (!pink) {
      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      return buffer;
    }
    // Paul Kellet's pink noise filter for warm organic air
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  _initGraph() {
    if (this.initialized) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    this.ctx = ctx;

    // Gentle safety compressor
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -16;
    compressor.knee.value = 18;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.01;
    compressor.release.value = 0.2;
    compressor.connect(ctx.destination);

    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = 0.0001;
    this.masterGain.connect(compressor);

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.value = 1.0;
    this.ambientGain.connect(this.masterGain);

    this.sfxGain = ctx.createGain();
    this.sfxGain.gain.value = 0.9;
    this.sfxGain.connect(this.masterGain);

    // -----------------------------------------------------------------------
    // ATMOSPHERE A: HERO FLOATING PARTICLES (warm light pad + airy shimmer)
    // -----------------------------------------------------------------------
    this.heroAmbGain = ctx.createGain();
    this.heroAmbGain.gain.value = this.mode === 'hero' ? 1.0 : 0.0001;
    this.heroAmbGain.connect(this.ambientGain);

    const heroFilter = ctx.createBiquadFilter();
    heroFilter.type = 'lowpass';
    heroFilter.frequency.value = 380;
    heroFilter.Q.value = 0.7;
    heroFilter.connect(this.heroAmbGain);

    // Warm translucent C3 + G3 pad
    const heroPadNotes = [
      { freq: 130.81, gain: 0.032, detune: -3 },
      { freq: 196.00, gain: 0.022, detune: 4 },
      { freq: 293.66, gain: 0.011, detune: -2 } // D4 color
    ];
    heroPadNotes.forEach(({ freq, gain, detune }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.detune.value = detune;
      g.gain.value = gain;
      osc.connect(g);
      g.connect(heroFilter);
      osc.start();
    });

    // Subtle floating particle airy shimmer (bandpass pink noise)
    const shimmerSrc = ctx.createBufferSource();
    shimmerSrc.buffer = this._createNoiseBuffer(ctx, 4, true);
    shimmerSrc.loop = true;

    const shimmerFilter = ctx.createBiquadFilter();
    shimmerFilter.type = 'bandpass';
    shimmerFilter.frequency.value = 1850;
    shimmerFilter.Q.value = 2.0;

    const shimmerLfo = ctx.createOscillator();
    const shimmerLfoGain = ctx.createGain();
    shimmerLfo.frequency.value = 0.11;
    shimmerLfoGain.gain.value = 480;
    shimmerLfo.connect(shimmerLfoGain);
    shimmerLfoGain.connect(shimmerFilter.frequency);
    shimmerLfo.start();

    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0.045;

    shimmerSrc.connect(shimmerFilter);
    shimmerFilter.connect(shimmerGain);
    shimmerGain.connect(this.heroAmbGain);
    shimmerSrc.start();

    // -----------------------------------------------------------------------
    // ATMOSPHERE B: OUR WORK & REST OF WEB (deep cinematic atmospheric drone)
    // -----------------------------------------------------------------------
    this.workAmbGain = ctx.createGain();
    this.workAmbGain.gain.value = this.mode === 'work' ? 1.0 : 0.0001;
    this.workAmbGain.connect(this.ambientGain);

    const workFilter = ctx.createBiquadFilter();
    workFilter.type = 'lowpass';
    workFilter.frequency.value = 340;
    workFilter.Q.value = 1.1;
    workFilter.connect(this.workAmbGain);

    // Slow breathing filter modulation
    const workLfo = ctx.createOscillator();
    const workLfoGain = ctx.createGain();
    workLfo.frequency.value = 0.055; // ~18s full cinematic swell
    workLfoGain.gain.value = 155;
    workLfo.connect(workLfoGain);
    workLfoGain.connect(workFilter.frequency);
    workLfo.start();

    // Deep velvet studio chord: A2, E3, B3, E4
    const workVoices = [
      { freq: 110.00, type: 'sine',     gain: 0.045, detune: -4 },
      { freq: 110.00, type: 'triangle', gain: 0.018, detune: 5 },
      { freq: 164.81, type: 'sine',     gain: 0.030, detune: -3 },
      { freq: 246.94, type: 'sine',     gain: 0.020, detune: 4 },
      { freq: 329.63, type: 'sine',     gain: 0.012, detune: -5 }
    ];
    workVoices.forEach(({ freq, type, gain, detune }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.detune.value = detune;
      g.gain.value = gain;
      osc.connect(g);
      g.connect(workFilter);
      osc.start();
    });

    // Warm dark room-tone air
    const roomSrc = ctx.createBufferSource();
    roomSrc.buffer = this._createNoiseBuffer(ctx, 5, true);
    roomSrc.loop = true;

    const roomFilter = ctx.createBiquadFilter();
    roomFilter.type = 'lowpass';
    roomFilter.frequency.value = 260;

    const roomGain = ctx.createGain();
    roomGain.gain.value = 0.08;

    roomSrc.connect(roomFilter);
    roomFilter.connect(roomGain);
    roomGain.connect(this.workAmbGain);
    roomSrc.start();

    this.initialized = true;
    this._scheduleHeroSparkle();
  }

  _scheduleHeroSparkle() {
    if (this.sparkleTimer) clearTimeout(this.sparkleTimer);
    const delay = 1000 + Math.random() * 1700;
    this.sparkleTimer = setTimeout(() => {
      if (
        this.enabled &&
        this.mode === 'hero' &&
        this.duckReasons.size === 0 &&
        this.ctx &&
        this.ctx.state === 'running' &&
        !document.hidden
      ) {
        this._triggerFloatingParticleChime();
      }
      this._scheduleHeroSparkle();
    }, delay);
  }

  _triggerFloatingParticleChime() {
    if (!this.ctx || !this.heroAmbGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const freq = SPARKLE_NOTES[Math.floor(Math.random() * SPARKLE_NOTES.length)];

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.005, now + 0.9);

    const peak = 0.012 + Math.random() * 0.012;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(peak, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);

    if (typeof ctx.createStereoPanner === 'function') {
      const panner = ctx.createStereoPanner();
      panner.pan.value = (Math.random() * 2 - 1) * 0.72;
      osc.connect(g);
      g.connect(panner);
      panner.connect(this.heroAmbGain);
    } else {
      osc.connect(g);
      g.connect(this.heroAmbGain);
    }

    osc.start(now);
    osc.stop(now + 1.3);
  }

  async unlock() {
    if (!this.enabled) return false;
    this._initGraph();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        return false;
      }
    }

    this._applyGains(0.6);
    this._emit();
    return this.ctx.state === 'running';
  }

  _applyGains(fadeSec = 0.5) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const targetMaster = this.enabled ? 0.95 : 0.0001;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
    this.masterGain.gain.linearRampToValueAtTime(targetMaster, now + fadeSec);

    const targetAmb = this.duckReasons.size > 0 ? 0.0001 : 1.0;
    this.ambientGain.gain.cancelScheduledValues(now);
    this.ambientGain.gain.setValueAtTime(Math.max(0.0001, this.ambientGain.gain.value), now);
    this.ambientGain.gain.linearRampToValueAtTime(targetAmb, now + 0.45);
  }

  async setEnabled(enabled) {
    this.enabled = Boolean(enabled);
    this._savePreference();

    if (this.enabled) {
      await this.unlock();
      this.playClick();
    } else if (this.ctx) {
      this._applyGains(0.25);
    }
    this._emit();
  }

  async toggle() {
    if (this.enabled && (!this.ctx || this.ctx.state !== 'running')) {
      // Sound was enabled in preference but waiting for gesture — unlock it right away
      await this.unlock();
      this.playClick();
      return;
    }
    await this.setEnabled(!this.enabled);
  }

  setMode(newMode) {
    const safeMode = newMode === 'work' ? 'work' : 'hero';
    if (this.mode === safeMode) return;
    this.mode = safeMode;

    if (this.ctx && this.heroAmbGain && this.workAmbGain) {
      const now = this.ctx.currentTime;
      const crossfadeSec = 1.4;

      this.heroAmbGain.gain.cancelScheduledValues(now);
      this.heroAmbGain.gain.setValueAtTime(Math.max(0.0001, this.heroAmbGain.gain.value), now);
      this.heroAmbGain.gain.linearRampToValueAtTime(safeMode === 'hero' ? 1.0 : 0.0001, now + crossfadeSec);

      this.workAmbGain.gain.cancelScheduledValues(now);
      this.workAmbGain.gain.setValueAtTime(Math.max(0.0001, this.workAmbGain.gain.value), now);
      this.workAmbGain.gain.linearRampToValueAtTime(safeMode === 'work' ? 1.0 : 0.0001, now + crossfadeSec);
    }

    this._emit();
  }

  setDucked(reason, isDucked) {
    if (isDucked) {
      this.duckReasons.add(reason);
    } else {
      this.duckReasons.delete(reason);
    }
    this._applyGains(0.45);
    this._emit();
  }

  // -------------------------------------------------------------------------
  // INTERACTION SOUNDS
  // -------------------------------------------------------------------------

  // Soft playful glass-marimba pluck for Hero kinetic words
  playWordHover(wordIndex = 0) {
    if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
    const nowMs = performance.now();
    if (nowMs - this.lastWordAt < 45) return;
    this.lastWordAt = nowMs;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const freq = HERO_WORD_NOTES[wordIndex % HERO_WORD_NOTES.length];

    const osc = ctx.createOscillator();
    const harmonic = ctx.createOscillator();
    const g = ctx.createGain();
    const hGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.012, now + 0.06);

    harmonic.type = 'triangle';
    harmonic.frequency.setValueAtTime(freq * 2, now);
    hGain.gain.value = 0.14;

    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.065, now + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(g);
    harmonic.connect(hGain);
    hGain.connect(g);

    if (typeof ctx.createStereoPanner === 'function') {
      const panner = ctx.createStereoPanner();
      const pan = ((wordIndex % 9) / 8) * 0.9 - 0.45;
      panner.pan.value = pan;
      g.connect(panner);
      panner.connect(this.sfxGain);
    } else {
      g.connect(this.sfxGain);
    }

    osc.start(now);
    harmonic.start(now);
    osc.stop(now + 0.3);
    harmonic.stop(now + 0.3);
  }

  // Soft luminous hover sound when buttons/chips/cards illuminate
  playHover() {
    if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
    const nowMs = performance.now();
    if (nowMs - this.lastHoverAt < 55) return;
    this.lastHoverAt = nowMs;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.065);

    filter.type = 'lowpass';
    filter.frequency.value = 1800;

    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.042, now + 0.009);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(filter);
    filter.connect(g);
    g.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Fuller, more intense tactile click sound
  playClick() {
    if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // 1) Warm punchy low-mid body
    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(240, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(92, now + 0.11);

    bodyGain.gain.setValueAtTime(0.0001, now);
    bodyGain.gain.linearRampToValueAtTime(0.16, now + 0.004);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(this.sfxGain);
    bodyOsc.start(now);
    bodyOsc.stop(now + 0.14);

    // 2) Crisp studio harmonic confirmation ping
    const pingOsc = ctx.createOscillator();
    const pingGain = ctx.createGain();
    pingOsc.type = 'triangle';
    pingOsc.frequency.setValueAtTime(784, now);
    pingOsc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.05);

    pingGain.gain.setValueAtTime(0.0001, now);
    pingGain.gain.linearRampToValueAtTime(0.065, now + 0.005);
    pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    pingOsc.connect(pingGain);
    pingGain.connect(this.sfxGain);
    pingOsc.start(now);
    pingOsc.stop(now + 0.15);

    // 3) Subtle tactile transient snap
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = this._createNoiseBuffer(ctx, 0.04, false);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 2400;
    bp.Q.value = 1.6;

    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.08, now);
    nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

    noiseSrc.connect(bp);
    bp.connect(nGain);
    nGain.connect(this.sfxGain);
    noiseSrc.start(now);
    noiseSrc.stop(now + 0.03);
  }
}

export const soundEngine = new SoundEngine();

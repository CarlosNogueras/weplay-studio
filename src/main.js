import './style.css'
import { fetchPortfolioProjects, extractVimeoId, extractYouTubeId } from './services/social.js'
import { soundEngine } from './services/soundEngine.js'
import { Lightbox } from './components/lightbox.js'
import { applyLanguage, getCurrentLang, t } from './i18n.js'
import {
  isEditMode,
  renderEditorToolbar,
  renderCardEditorControls,
  savePortfolioConfig
} from './components/portfolioEditor.js'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const prefersTouch = window.matchMedia('(hover: none)').matches
const supportsFineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches

// Split Hero headline into interactive kinetic words
function animateHeroTitle() {
  const lines = document.querySelectorAll('#hero-title .hero-line')
  let wordIndex = 0

  lines.forEach((line) => {
    const text = line.textContent.trim().replace(/\s+/g, ' ')
    const words = text.split(' ')
    line.innerHTML = words
      .map((word) => {
        const currentIndex = wordIndex
        const delay = 80 + wordIndex * 65
        const tilt = wordIndex % 2 === 0 ? '-3deg' : '3deg'
        wordIndex += 1
        return `<span class="hero-word" data-word-index="${currentIndex}" style="--word-delay:${delay}ms;--word-tilt:${tilt}">${word}</span>`
      })
      .join(' ')
  })
}

// Initialize language (default EN, persisted in localStorage)
let currentLang = applyLanguage(getCurrentLang())
animateHeroTitle()

// Studio Showreel Player (scroll autoplay muted + hover/click sound + EN/ES sync)
const reelPlayer = document.getElementById('reel-player')
const reelVideo = document.getElementById('reel-video')
const reelPlayBtn = document.getElementById('reel-play-btn')
const reelMuteBtn = document.getElementById('reel-mute-btn')
const reelMuteLabel = document.getElementById('reel-mute-label')
const reelSoundHint = document.getElementById('reel-sound-hint')
const reelProgress = document.getElementById('reel-progress')
const reelProgressFill = document.getElementById('reel-progress-fill')
const reelTime = document.getElementById('reel-time')
const reelFullscreenBtn = document.getElementById('reel-fullscreen-btn')

const REEL_SOURCES = {
  en: '/videos/reel-en.mp4',
  es: '/videos/reel-es.mp4'
}

let reelState = {
  inView: false,
  hovering: false,
  hoverUnmutedAt: 0,
  userSoundPref: null, // null = auto (hover enables sound), 'on' = locked unmuted, 'off' = locked muted
  userPaused: false,
  hoverBlockedByPolicy: false,
  fadeRaf: null
}

function formatReelTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function syncReelUI() {
  if (!reelPlayer || !reelVideo) return
  const isMuted = reelVideo.muted
  const isPlaying = !reelVideo.paused && !reelVideo.ended
  reelPlayer.dataset.muted = String(isMuted)
  reelPlayer.dataset.playing = String(isPlaying)

  if (reelMuteBtn) {
    reelMuteBtn.setAttribute('aria-pressed', String(!isMuted))
  }
  if (reelMuteLabel) {
    reelMuteLabel.textContent = t(isMuted ? 'reel.soundOff' : 'reel.soundOn', currentLang)
  }
  if (reelSoundHint) {
    reelSoundHint.textContent = t(
      reelState.hoverBlockedByPolicy ? 'reel.clickHint' : 'reel.hoverHint',
      currentLang
    )
  }

  // Duck ambient soundscape whenever the showreel plays with audio
  soundEngine.setDucked('reel', isPlaying && !isMuted)
}

function fadeReelVolume(targetVolume, durationMs = 240, onComplete = null) {
  if (!reelVideo) return
  if (reelState.fadeRaf) cancelAnimationFrame(reelState.fadeRaf)
  const startVolume = reelVideo.volume
  const startTime = performance.now()

  const step = (now) => {
    const progress = Math.max(0, Math.min(1, (now - startTime) / durationMs))
    const nextVolume = startVolume + (targetVolume - startVolume) * progress
    reelVideo.volume = Math.max(0, Math.min(1, nextVolume))
    if (progress < 1) {
      reelState.fadeRaf = requestAnimationFrame(step)
    } else {
      reelState.fadeRaf = null
      if (onComplete) onComplete()
    }
  }
  reelState.fadeRaf = requestAnimationFrame(step)
}

function safePlayReel({ preferUnmuted = false, fromHover = false } = {}) {
  if (!reelVideo) return
  if (preferUnmuted) {
    reelVideo.muted = false
    reelVideo.volume = 0
  } else {
    reelVideo.muted = true
  }

  const p = reelVideo.play()
  if (p && typeof p.then === 'function') {
    p.then(() => {
      if (preferUnmuted) {
        reelState.hoverBlockedByPolicy = false
        fadeReelVolume(1, 240)
      }
      syncReelUI()
    }).catch(() => {
      // Browser blocked unmuted playback before user gesture: keep playing muted and show click hint
      if (preferUnmuted) {
        reelVideo.muted = true
        reelVideo.volume = 1
        if (fromHover) reelState.hoverBlockedByPolicy = true
        reelVideo.play().catch(() => {})
      }
      syncReelUI()
    })
  } else {
    if (preferUnmuted) fadeReelVolume(1, 240)
    syncReelUI()
  }
}

function updateReelSourceForLanguage(lang) {
  if (!reelVideo) return
  const targetSrc = REEL_SOURCES[lang] || REEL_SOURCES.en
  const currentPathname = (() => {
    try {
      return new URL(reelVideo.currentSrc || reelVideo.src, window.location.origin).pathname
    } catch {
      return reelVideo.getAttribute('src') || ''
    }
  })()

  if (currentPathname === targetSrc) {
    syncReelUI()
    return
  }

  const savedTime = reelVideo.currentTime || 0
  const wasPlaying = !reelVideo.paused && !reelVideo.ended
  const wasMuted = reelVideo.muted

  reelVideo.src = targetSrc
  reelVideo.load()

  const restoreState = () => {
    if (savedTime > 0 && Number.isFinite(reelVideo.duration)) {
      reelVideo.currentTime = Math.min(savedTime, Math.max(0, reelVideo.duration - 0.1))
    }
    reelVideo.muted = wasMuted
    if (wasPlaying || (reelState.inView && !reelState.userPaused)) {
      safePlayReel({ preferUnmuted: !wasMuted })
    } else {
      syncReelUI()
    }
  }

  if (reelVideo.readyState >= 1) {
    restoreState()
  } else {
    reelVideo.addEventListener('loadedmetadata', restoreState, { once: true })
  }
  syncReelUI()
}

if (reelPlayer && reelVideo) {
  // Set initial language source immediately
  updateReelSourceForLanguage(currentLang)

  // Scroll-triggered muted autoplay
  if (!prefersReducedMotion) {
    const reelObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        reelState.inView = entry.isIntersecting
        if (entry.isIntersecting) {
          if (!reelState.userPaused) {
            const shouldUnmute = reelState.userSoundPref === 'on' || (reelState.hovering && reelState.userSoundPref !== 'off')
            safePlayReel({ preferUnmuted: shouldUnmute })
          }
        } else {
          if (!reelVideo.paused) {
            reelVideo.pause()
          }
          if (reelState.userSoundPref !== 'on') {
            reelVideo.muted = true
          }
          syncReelUI()
        }
      })
    }, { threshold: 0.35 })

    reelObserver.observe(reelPlayer)
  }

  // Hover activates sound smoothly on fine-pointer devices; leaving fades back to muted unless user locked sound ON
  if (supportsFineHover) {
    reelPlayer.addEventListener('mouseenter', () => {
      reelState.hovering = true
      if (reelState.userSoundPref === 'off') return
      if (reelVideo.paused && !reelState.userPaused) {
        reelState.hoverUnmutedAt = performance.now()
        safePlayReel({ preferUnmuted: true, fromHover: true })
      } else if (!reelVideo.paused && reelVideo.muted) {
        reelState.hoverUnmutedAt = performance.now()
        safePlayReel({ preferUnmuted: true, fromHover: true })
      }
    })

    reelPlayer.addEventListener('mouseleave', () => {
      reelState.hovering = false
      if (reelState.userSoundPref === 'on') return
      if (!reelVideo.muted) {
        fadeReelVolume(0, 200, () => {
          if (!reelState.hovering && reelState.userSoundPref !== 'on') {
            reelVideo.muted = true
            reelVideo.volume = 1
            syncReelUI()
          }
        })
      }
    })
  }

  // Click on video area toggles sound if muted, or toggles play/pause if already unmuted
  reelVideo.addEventListener('click', () => {
    reelState.hoverBlockedByPolicy = false
    if (reelVideo.paused) {
      reelState.userPaused = false
      reelState.userSoundPref = 'on'
      safePlayReel({ preferUnmuted: true })
    } else if (reelVideo.muted || (reelState.userSoundPref === null && performance.now() - reelState.hoverUnmutedAt < 400)) {
      reelState.userSoundPref = 'on'
      safePlayReel({ preferUnmuted: true })
    } else {
      reelState.userPaused = true
      reelVideo.pause()
      syncReelUI()
    }
  })

  if (reelPlayBtn) {
    reelPlayBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      if (reelVideo.paused) {
        reelState.userPaused = false
        safePlayReel({ preferUnmuted: !reelVideo.muted || reelState.userSoundPref === 'on' })
      } else {
        reelState.userPaused = true
        reelVideo.pause()
        syncReelUI()
      }
    })
  }

  if (reelMuteBtn) {
    reelMuteBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      reelState.hoverBlockedByPolicy = false
      const justHoverUnmuted = reelState.userSoundPref === null && (performance.now() - reelState.hoverUnmutedAt < 400)
      if (reelVideo.muted || justHoverUnmuted) {
        reelState.userSoundPref = 'on'
        safePlayReel({ preferUnmuted: true })
      } else {
        reelState.userSoundPref = 'off'
        reelVideo.muted = true
        reelVideo.volume = 1
        syncReelUI()
      }
    })
  }

  // Progress bar + time readout
  const updateProgress = () => {
    const dur = reelVideo.duration || 45
    const cur = reelVideo.currentTime || 0
    const pct = dur > 0 ? Math.min(100, (cur / dur) * 100) : 0
    if (reelProgressFill) reelProgressFill.style.width = `${pct}%`
    if (reelProgress) reelProgress.setAttribute('aria-valuenow', String(Math.round(pct)))
    if (reelTime) reelTime.textContent = `${formatReelTime(cur)} / ${formatReelTime(dur)}`
  }

  reelVideo.addEventListener('timeupdate', updateProgress)
  reelVideo.addEventListener('loadedmetadata', updateProgress)
  reelVideo.addEventListener('play', syncReelUI)
  reelVideo.addEventListener('pause', syncReelUI)
  reelVideo.addEventListener('volumechange', syncReelUI)

  if (reelProgress) {
    const seekAtClientX = (clientX) => {
      const rect = reelProgress.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      if (Number.isFinite(reelVideo.duration)) {
        reelVideo.currentTime = ratio * reelVideo.duration
      }
    }

    reelProgress.addEventListener('click', (e) => {
      e.stopPropagation()
      seekAtClientX(e.clientX)
    })

    reelProgress.addEventListener('keydown', (e) => {
      if (!Number.isFinite(reelVideo.duration)) return
      if (e.key === 'ArrowRight') {
        reelVideo.currentTime = Math.min(reelVideo.duration, reelVideo.currentTime + 5)
      } else if (e.key === 'ArrowLeft') {
        reelVideo.currentTime = Math.max(0, reelVideo.currentTime - 5)
      }
    })
  }

  if (reelFullscreenBtn) {
    reelFullscreenBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      const viewport = reelPlayer.querySelector('.reel-viewport') || reelVideo
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
      } else if (viewport.requestFullscreen) {
        viewport.requestFullscreen().catch(() => {})
      } else if (reelVideo.webkitEnterFullscreen) {
        reelVideo.webkitEnterFullscreen()
      }
    })
  }
}

document.querySelectorAll('.lang-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    currentLang = applyLanguage(btn.dataset.lang)
    animateHeroTitle()
    updateReelSourceForLanguage(currentLang)
    updateSoundToggleUI(soundEngine.getState())
  })
})

// ---------------------------------------------------------------------------
// Interactive Soundscape & Tactile UI Foley
// ---------------------------------------------------------------------------
const soundToggleBtn = document.getElementById('sound-toggle-btn')
const workSectionEl = document.getElementById('work')
const heroTitleEl = document.getElementById('hero-title')

function updateSoundToggleUI(state) {
  if (!soundToggleBtn) return
  const isOn = state.active
  soundToggleBtn.classList.toggle('is-active', isOn)
  soundToggleBtn.classList.toggle('is-ready', Boolean(state.waitingForGesture))
  soundToggleBtn.setAttribute('aria-pressed', String(isOn))
  soundToggleBtn.setAttribute(
    'title',
    t(isOn ? 'sound.onTitle' : 'sound.offTitle', currentLang)
  )
}

soundEngine.onChange(updateSoundToggleUI)

if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    soundEngine.toggle()
  })
}

// Reliable cross-platform audio unlock (retries across iOS Safari / Android touchend, click & keydown until AudioContext is running)
const UNLOCK_EVENTS = ['pointerdown', 'touchend', 'click', 'keydown']
const tryUnlockAudio = () => {
  if (!soundEngine.enabled) return
  soundEngine.unlock().then((running) => {
    if (running) {
      UNLOCK_EVENTS.forEach((evt) => window.removeEventListener(evt, tryUnlockAudio))
    }
  })
}
UNLOCK_EVENTS.forEach((evt) => window.addEventListener(evt, tryUnlockAudio, { passive: true }))

// Duck ambient soundscape while a project Lightbox video is open
window.addEventListener('weplay:lightbox', (e) => {
  soundEngine.setDucked('lightbox', Boolean(e.detail?.open))
})

// Switch atmosphere from Hero floating particles -> deep atmospheric drone at #work (and rest of site)
if (workSectionEl) {
  let scrollTicking = false
  const updateAtmosphereByScroll = () => {
    scrollTicking = false
    const workTop = workSectionEl.getBoundingClientRect().top
    const enterWorkThreshold = window.innerHeight * 0.58
    soundEngine.setMode(workTop <= enterWorkThreshold ? 'work' : 'hero')
  }

  const onScrollAtmosphere = () => {
    if (!scrollTicking) {
      scrollTicking = true
      requestAnimationFrame(updateAtmosphereByScroll)
    }
  }

  window.addEventListener('scroll', onScrollAtmosphere, { passive: true })
  window.addEventListener('resize', onScrollAtmosphere, { passive: true })
  updateAtmosphereByScroll()
}

// Hero kinetic words chime: desktop hover + mobile/tablet tap & finger slide
if (heroTitleEl) {
  const triggerHeroWord = (word, withBounce = false) => {
    if (!word) return
    const idx = Number(word.dataset.wordIndex || 0)
    if (withBounce) {
      word.classList.add('is-bouncing')
      clearTimeout(word._bounceTimer)
      word._bounceTimer = setTimeout(() => word.classList.remove('is-bouncing'), 340)
    }
    if (soundEngine.enabled) {
      soundEngine.unlock().then((ok) => {
        if (ok) soundEngine.playWordHover(idx)
      })
    }
  }

  if (!prefersTouch) {
    heroTitleEl.addEventListener('mouseover', (e) => {
      const word = e.target.closest('.hero-word')
      if (!word || (e.relatedTarget && word.contains(e.relatedTarget))) return
      triggerHeroWord(word, false)
    })
  }

  let lastTouchedWord = null
  heroTitleEl.addEventListener('touchstart', (e) => {
    const word = e.target.closest('.hero-word')
    lastTouchedWord = word || null
    if (word) triggerHeroWord(word, true)
  }, { passive: true })

  heroTitleEl.addEventListener('touchmove', (e) => {
    const touch = e.touches[0]
    if (!touch) return
    const el = document.elementFromPoint(touch.clientX, touch.clientY)
    const word = el ? el.closest('.hero-word') : null
    if (word && word !== lastTouchedWord) {
      lastTouchedWord = word
      triggerHeroWord(word, true)
    }
  }, { passive: true })

  heroTitleEl.addEventListener('touchend', () => {
    lastTouchedWord = null
  }, { passive: true })
}

// Tactile hover (soft) & click (richer/stronger) sounds on buttons, chips, links & cards
const INTERACTIVE_HOVER_SELECTOR = [
  '.btn',
  '.hero-chip',
  '.lang-btn',
  '.sound-toggle',
  '.nav-links a',
  '.hero-scroll-indicator',
  '.social-card',
  '.service-card',
  '.project-card',
  '.reel-ctrl-btn',
  '.reel-sound-pill',
  '.contact-modal-close',
  '.lightbox-close'
].join(', ')

const INTERACTIVE_CLICK_SELECTOR = [
  '.btn',
  '.hero-chip',
  '.lang-btn',
  '.nav-links a',
  '.hero-scroll-indicator',
  '.social-card',
  '.project-card',
  '.reel-ctrl-btn',
  '.reel-sound-pill',
  '.contact-modal-close',
  '.lightbox-close',
  '.mobile-menu-toggle'
].join(', ')

if (!prefersTouch) {
  let lastHoveredEl = null
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(INTERACTIVE_HOVER_SELECTOR)
    if (!target) {
      lastHoveredEl = null
      return
    }
    if (target !== lastHoveredEl) {
      lastHoveredEl = target
      soundEngine.playHover()
    }
  })
}

document.addEventListener('pointerdown', (e) => {
  const target = e.target.closest(INTERACTIVE_CLICK_SELECTOR)
  if (!target) return
  if (soundEngine.enabled) {
    soundEngine.unlock().then((ok) => {
      if (ok) soundEngine.playClick()
    })
  }
})

// Hero interactive spotlight & playful spark particles
const heroSection = document.getElementById('hero')
const heroCanvas = document.getElementById('hero-particles')

if (heroSection && !prefersReducedMotion) {
  let pointer = { x: -999, y: -999, active: false }

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    pointer = { x, y, active: true }
    heroSection.style.setProperty('--hero-x', `${x}px`)
    heroSection.style.setProperty('--hero-y', `${y}px`)
  })

  heroSection.addEventListener('mouseleave', () => {
    pointer.active = false
  })

  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d')
    let width = 0
    let height = 0
    const particleCount = 34
    const particles = []

    const resize = () => {
      const rect = heroSection.getBoundingClientRect()
      width = heroCanvas.width = rect.width
      height = heroCanvas.height = rect.height
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -0.15 - Math.random() * 0.35,
        r: 1.2 + Math.random() * 2.4,
        alpha: 0.18 + Math.random() * 0.45
      })
    }

    const tick = () => {
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        if (pointer.active) {
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const dist = Math.hypot(dx, dy)
          if (dist < 130 && dist > 1) {
            const force = (130 - dist) / 130
            p.vx += (dx / dist) * force * 0.18
            p.vy += (dy / dist) * force * 0.18
          }
        }

        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.985
        p.vy = p.vy * 0.985 - 0.004

        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
          p.vy = -0.2 - Math.random() * 0.3
        }
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 107, 0, ${p.alpha})`
        ctx.fill()
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }
}

// Hero discipline chips highlight target service card
document.querySelectorAll('.hero-chip[data-service-target]').forEach((chip) => {
  chip.addEventListener('click', () => {
    const targetKey = chip.dataset.serviceTarget
    const card = document.querySelector(`.service-card[data-service="${targetKey}"]`)
    if (!card) return
    setTimeout(() => {
      card.classList.add('highlight-pulse')
      setTimeout(() => card.classList.remove('highlight-pulse'), 1400)
    }, 450)
  })
})

// Mobile navigation toggle
const mobileToggle = document.getElementById('mobile-menu-toggle')
const navLinks = document.getElementById('nav-links')

if (mobileToggle && navLinks) {
  const closeMobileMenu = () => {
    navLinks.classList.remove('mobile-open')
    mobileToggle.classList.remove('open')
    mobileToggle.setAttribute('aria-expanded', 'false')
  }

  mobileToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('mobile-open')
    mobileToggle.classList.toggle('open', isOpen)
    mobileToggle.setAttribute('aria-expanded', String(isOpen))
  })

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu)
  })
}

// Initialize lightbox
const lightbox = new Lightbox()

// Scroll reveal animation for service & social cards
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible')
      revealObserver.unobserve(entry.target)
    }
  })
}, {
  root: null,
  rootMargin: '0px 0px -40px 0px',
  threshold: 0.12
})

document.querySelectorAll('.reveal-on-scroll').forEach((el, index) => {
  el.style.setProperty('--reveal-delay', `${(index % 4) * 90}ms`)
  revealObserver.observe(el)
})

// Interactive pointer glow, tilt & hover/scroll video playback on Service cards
const serviceCards = document.querySelectorAll('.service-card')

const playServiceVideo = (card, video) => {
  if (!video || prefersReducedMotion) return
  const playPromise = video.play()
  if (playPromise && typeof playPromise.then === 'function') {
    playPromise
      .then(() => card.classList.add('is-playing'))
      .catch(() => {})
  } else {
    card.classList.add('is-playing')
  }
}

const pauseServiceVideo = (card, video) => {
  if (!video) return
  video.pause()
  card.classList.remove('is-playing')
}

serviceCards.forEach((card) => {
  const video = card.querySelector('.service-video')

  card.addEventListener('mouseenter', () => {
    playServiceVideo(card, video)
  })

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateY = ((x / rect.width) - 0.5) * 6
    const rotateX = (0.5 - (y / rect.height)) * 6

    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
    card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`
  })

  card.addEventListener('mouseleave', () => {
    card.style.transform = ''
    pauseServiceVideo(card, video)
  })
})

if (prefersTouch && !prefersReducedMotion) {
  const touchVideoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const card = entry.target
      const video = card.querySelector('.service-video')
      if (entry.isIntersecting) {
        playServiceVideo(card, video)
      } else {
        pauseServiceVideo(card, video)
      }
    })
  }, { threshold: 0.5 })

  serviceCards.forEach((card) => touchVideoObserver.observe(card))
}

// Scroll animation for work grid cards
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('animate-in')
      }, index * 100)
    }
  })
}, {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
})

// Load pinned + Vimeo/YouTube portfolio projects in configured order
let currentPortfolioConfig = null
const editMode = isEditMode()

function getVideoMatchKey(url = '') {
  const vId = extractVimeoId(url)
  if (vId) return `vimeo:${vId}`
  const yId = extractYouTubeId(url)
  if (yId) return `yt:${yId}`
  return `url:${url}`
}

function findPinnedIndex(pinnedList, url) {
  const targetKey = getVideoMatchKey(url)
  return pinnedList.findIndex((item) => {
    const itemUrl = typeof item === 'string' ? item : item.url || (item.vimeoId ? `https://vimeo.com/${item.vimeoId}` : item.youtubeId ? `https://www.youtube.com/watch?v=${item.youtubeId}` : '')
    return getVideoMatchKey(itemUrl) === targetKey
  })
}

async function loadPortfolioContent(customConfig = null) {
  const container = document.getElementById('work-grid')
  try {
    const { projects: videos, config: loadedConfig } = await fetchPortfolioProjects(customConfig)
    currentPortfolioConfig = loadedConfig

    if (editMode) {
      renderEditorToolbar(currentPortfolioConfig, {
        onAdd: (newEntry) => {
          const existingIdx = findPinnedIndex(currentPortfolioConfig.pinned, newEntry.url)
          if (existingIdx !== -1) {
            currentPortfolioConfig.pinned[existingIdx] = { ...currentPortfolioConfig.pinned[existingIdx], ...newEntry }
          } else {
            currentPortfolioConfig.pinned.unshift(newEntry)
          }
          loadPortfolioContent(currentPortfolioConfig)
        },
        onSave: (statusEl) => savePortfolioConfig(currentPortfolioConfig, statusEl),
        onExit: () => {
          const url = new URL(window.location.href)
          url.searchParams.delete('edit')
          window.location.href = url.toString()
        }
      })
    }

    if (videos && videos.length > 0) {
      container.innerHTML = videos.map(video => {
        const safeVideoData = encodeURIComponent(JSON.stringify(video))
        const category = video.category || 'Vimeo'
        const pinnedIndex = findPinnedIndex(currentPortfolioConfig.pinned || [], video.url)
        const badge = (!editMode && video.featured) ? '<span class="project-badge">Featured</span>' : ''
        const editorControls = editMode
          ? renderCardEditorControls(video, pinnedIndex, (currentPortfolioConfig.pinned || []).length)
          : ''
        return `
          <article class="project-card ${editMode && pinnedIndex !== -1 ? 'is-pinned-edit' : ''}" data-video="${safeVideoData}">
            ${badge}
            ${editorControls}
            <img
              src="${video.thumbnail}"
              alt="${video.title}"
              class="card-image-placeholder"
              loading="lazy"
            />
            <div class="project-info">
              <h3 class="project-title">${video.title}</h3>
              <p class="project-category">${category}</p>
            </div>
          </article>
        `
      }).join('')

      if (editMode) {
        container.querySelectorAll('[data-action="toggle-pin"]').forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation()
            const { url, title, category } = btn.dataset
            const idx = findPinnedIndex(currentPortfolioConfig.pinned, url)
            if (idx !== -1) {
              currentPortfolioConfig.pinned.splice(idx, 1)
            } else {
              currentPortfolioConfig.pinned.push({ url, title, category })
            }
            loadPortfolioContent(currentPortfolioConfig)
          })
        })

        container.querySelectorAll('[data-action="move-left"]').forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation()
            const idx = Number(btn.dataset.index)
            if (idx > 0) {
              const arr = currentPortfolioConfig.pinned
              ;[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
              loadPortfolioContent(currentPortfolioConfig)
            }
          })
        })

        container.querySelectorAll('[data-action="move-right"]').forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation()
            const idx = Number(btn.dataset.index)
            const arr = currentPortfolioConfig.pinned
            if (idx < arr.length - 1) {
              ;[arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]]
              loadPortfolioContent(currentPortfolioConfig)
            }
          })
        })

        container.querySelectorAll('[data-action="change-category"]').forEach((select) => {
          select.addEventListener('click', (e) => e.stopPropagation())
          select.addEventListener('change', (e) => {
            e.stopPropagation()
            const idx = Number(select.dataset.index)
            if (currentPortfolioConfig.pinned[idx]) {
              currentPortfolioConfig.pinned[idx].category = select.value
              loadPortfolioContent(currentPortfolioConfig)
            }
          })
        })
      }

      container.querySelectorAll('.project-card').forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('animate-in')
        }, 60 + (index * 35))

        card.addEventListener('click', (e) => {
          if (e.target.closest('.card-editor-controls')) return
          e.preventDefault()
          try {
            const videoData = JSON.parse(decodeURIComponent(card.dataset.video))
            lightbox.open(videoData)
          } catch (err) {
            console.error('Error parsing video data:', err)
          }
        })

        cardObserver.observe(card)
      })
    } else {
      container.innerHTML = `<p class="loading-state" data-i18n="work.empty">${t('work.empty', currentLang)}</p>`
    }
  } catch (error) {
    console.error('Failed to load portfolio content:', error)
    container.innerHTML = `<p class="loading-state" data-i18n="work.error">${t('work.error', currentLang)}</p>`
  }
}

// Contact Modal functionality
const contactModal = document.getElementById('contact-modal')
const contactBtn = document.getElementById('contact-btn')
const contactForm = document.getElementById('contact-form')
const formStatus = document.getElementById('form-status')
const modalClose = document.querySelector('.contact-modal-close')
const modalOverlay = document.querySelector('.contact-modal-overlay')

const clearFormStatus = () => {
  if (!formStatus) return
  formStatus.textContent = ''
  formStatus.className = 'form-status'
}

if (contactBtn) {
  contactBtn.addEventListener('click', () => {
    clearFormStatus()
    contactModal.classList.add('active')
    document.body.style.overflow = 'hidden'
  })
}

const closeModal = () => {
  contactModal.classList.remove('active')
  document.body.style.overflow = ''
}

if (modalClose) modalClose.addEventListener('click', closeModal)
if (modalOverlay) modalOverlay.addEventListener('click', closeModal)

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactModal.classList.contains('active')) {
    closeModal()
  }
})

// Contact form handler — sends directly to karlosnogueras@gmail.com via FormSubmit
// and also submits to Netlify Forms when hosted on Netlify
const CONTACT_EMAIL = 'karlosnogueras@gmail.com'
const isLocalDev = ['localhost', '127.0.0.1'].includes(window.location.hostname)

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearFormStatus()

    const submitBtn = contactForm.querySelector('button[type="submit"]')
    submitBtn.disabled = true
    submitBtn.textContent = t('modal.sending', currentLang)

    try {
      const formData = new FormData(contactForm)
      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        _subject: `WePlay Studio Contact — ${formData.get('name')}`,
        _template: 'table',
        _captcha: 'false'
      }

      const emailResponse = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      // Also mirror to Netlify Forms in production (non-blocking)
      if (!isLocalDev) {
        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        }).catch(() => {})
      }

      if (emailResponse.ok) {
        if (formStatus) {
          formStatus.textContent = t('modal.success', currentLang)
          formStatus.className = 'form-status success'
        }
        contactForm.reset()
        setTimeout(() => {
          closeModal()
          clearFormStatus()
        }, 2000)
      } else {
        throw new Error(`Email submission failed (${emailResponse.status})`)
      }
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = t('modal.error', currentLang)
        formStatus.className = 'form-status error'
      }
      console.error('Form error:', error)
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = t('modal.submit', currentLang)
    }
  })
}

// Initialize
loadPortfolioContent()

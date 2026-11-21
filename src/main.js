import './style.css'
import { fetchPortfolioProjects, extractVimeoId, extractYouTubeId } from './services/social.js'
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

// Split Hero headline into interactive kinetic words
function animateHeroTitle() {
  const lines = document.querySelectorAll('#hero-title .hero-line')
  let wordIndex = 0

  lines.forEach((line) => {
    const text = line.textContent.trim().replace(/\s+/g, ' ')
    const words = text.split(' ')
    line.innerHTML = words
      .map((word) => {
        const delay = 80 + wordIndex * 65
        const tilt = wordIndex % 2 === 0 ? '-3deg' : '3deg'
        wordIndex += 1
        return `<span class="hero-word" style="--word-delay:${delay}ms;--word-tilt:${tilt}">${word}</span>`
      })
      .join(' ')
  })
}

// Initialize language (default EN, persisted in localStorage)
let currentLang = applyLanguage(getCurrentLang())
animateHeroTitle()

document.querySelectorAll('.lang-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    currentLang = applyLanguage(btn.dataset.lang)
    animateHeroTitle()
  })
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

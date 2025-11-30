import './style.css'
import { fetchVimeoVideos } from './services/social.js'
import { Lightbox } from './components/lightbox.js'

// Initialize lightbox
const lightbox = new Lightbox()

// Initialize fade-in animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
    }
  })
}, observerOptions)

// Observe fade-in elements
document.querySelectorAll('.fade-in-up').forEach(el => {
  observer.observe(el)
})

// Scroll animation for grid cards
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('animate-in')
      }, index * 100) // Stagger animation
    }
  })
}, {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
})

// Load Vimeo videos and render to grid (limit to 10 random videos)
async function loadVimeoContent() {
  try {
    const allVideos = await fetchVimeoVideos()
    console.log('Loaded videos:', allVideos.length)

    // Shuffle array and take only 10 videos
    const shuffleArray = (array) => {
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }

    const videos = shuffleArray(allVideos).slice(0, 10)
    const container = document.getElementById('work-grid')

    if (videos && videos.length > 0) {
      container.innerHTML = videos.map(video => {
        // Safely encode JSON for data attribute
        const safeVideoData = encodeURIComponent(JSON.stringify(video))
        return `
                <article class="project-card" data-video="${safeVideoData}">
                    <img 
                        src="${video.thumbnail}" 
                        alt="${video.title}" 
                        class="card-image-placeholder"
                        loading="lazy"
                    />
                    <div class="project-info">
                        <h3 class="project-title">${video.title}</h3>
                        <p class="project-category">Vimeo</p>
                    </div>
                </article>
            `
      }).join('')

      // Add click handlers for lightbox
      container.querySelectorAll('.project-card').forEach((card, index) => {
        // Force visibility after a small delay to ensure they appear
        // even if IntersectionObserver has issues
        setTimeout(() => {
          card.classList.add('animate-in')
        }, 100 + (index * 50))

        card.addEventListener('click', (e) => {
          e.preventDefault()
          try {
            const videoData = JSON.parse(decodeURIComponent(card.dataset.video))
            lightbox.open(videoData)
          } catch (err) {
            console.error('Error parsing video data:', err)
          }
        })

        // Still observe for scroll animations if they are off-screen
        cardObserver.observe(card)
      })
    } else {
      container.innerHTML = '<p>No projects available</p>'
    }
  } catch (error) {
    console.error('Failed to load Vimeo content:', error)
    document.getElementById('work-grid').innerHTML = '<p>Failed to load projects</p>'
  }
}

// Contact Modal functionality
const contactModal = document.getElementById('contact-modal')
const contactBtn = document.getElementById('contact-btn')
const contactForm = document.getElementById('contact-form')
const modalClose = document.querySelector('.contact-modal-close')
const modalOverlay = document.querySelector('.contact-modal-overlay')

// Open modal
if (contactBtn) {
  contactBtn.addEventListener('click', () => {
    contactModal.classList.add('active')
    document.body.style.overflow = 'hidden'
  })
}

// Close modal
const closeModal = () => {
  contactModal.classList.remove('active')
  document.body.style.overflow = ''
}

if (modalClose) modalClose.addEventListener('click', closeModal)
if (modalOverlay) modalOverlay.addEventListener('click', closeModal)

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactModal.classList.contains('active')) {
    closeModal()
  }
})

// Contact form handler
// Contact form handler
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const submitBtn = contactForm.querySelector('button[type="submit"]')
    const originalText = submitBtn.textContent
    submitBtn.disabled = true
    submitBtn.textContent = 'Sending...'

    try {
      const formData = new FormData(contactForm)

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })

      if (response.ok) {
        alert('¡Mensaje enviado! Te contactaremos pronto.')
        contactForm.reset()
        closeModal()
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      alert('Hubo un error. Por favor intenta de nuevo.')
      console.error('Form error:', error)
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = originalText
    }
  })
}

// Load Social Content (Dynamic Mosaic)
async function loadSocialContent() {
  const container = document.getElementById('recent-posts-grid')
  if (!container) return

  // Try to load images from 01.png to 30.png
  // This allows user to just drop files in public/social without rebuilding
  const maxImagesToCheck = 30
  const checkImage = (index) => {
    return new Promise((resolve) => {
      const num = index.toString().padStart(2, '0')
      const src = `/social/${num}.png`
      const img = new Image()
      img.onload = () => resolve(src)
      img.onerror = () => resolve(null)
      img.src = src
    })
  }

  // Check all potential images in parallel
  const promises = []
  for (let i = 1; i <= maxImagesToCheck; i++) {
    promises.push(checkImage(i))
  }

  const results = await Promise.all(promises)
  const validImages = results.filter(src => src !== null)

  if (validImages.length === 0) {
    // Fallback if no images found
    return
  }

  // Shuffle and pick 10
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const selectedImages = shuffleArray(validImages).slice(0, 10)

  const platforms = [
    { name: 'Instagram', url: 'https://www.instagram.com/weplay_studio/' },
    { name: 'Facebook', url: 'https://www.facebook.com/weplaystudio/' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@weplay_studio' }
  ]

  container.innerHTML = selectedImages.map(imgSrc => {
    // Random platform for each post
    const platform = platforms[Math.floor(Math.random() * platforms.length)]

    return `
      <a href="${platform.url}" target="_blank" class="post-item" aria-label="View on ${platform.name}">
          <img src="${imgSrc}" alt="Social media post" loading="lazy">
          <div class="post-overlay">
              <span class="post-platform">${platform.name}</span>
          </div>
      </a>
    `
  }).join('')
}

// Initialize
loadVimeoContent()
loadSocialContent()

console.log('WePlay Studio initialized!')

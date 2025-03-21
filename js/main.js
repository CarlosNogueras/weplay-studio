// Funciones principales
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes
    initVideoEmbeds();
    initScrollNavigation();
    initPortfolioItems();
    initContactForm();
    initAnimations();
    
    // Verificar secuencia para CMS
    initCmsSequenceDetection();
});

// Función para inicializar embebidos de video
function initVideoEmbeds() {
    // Video de cabecera
    const headerVideo = document.getElementById('header-video');
    if (headerVideo) {
        const headerIframe = document.createElement('iframe');
        headerIframe.src = 'https://player.vimeo.com/video/185780469?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1';
        headerIframe.setAttribute('frameborder', '0');
        headerIframe.setAttribute('allow', 'autoplay; fullscreen');
        headerIframe.style.width = '100%';
        headerIframe.style.height = '100%';
        headerIframe.style.position = 'absolute';
        headerIframe.style.top = '0';
        headerIframe.style.left = '0';
        headerVideo.appendChild(headerIframe);
    }
    
    // Showreel principal
    const mainShowreel = document.getElementById('main-showreel');
    if (mainShowreel) {
        const showreelIframe = document.createElement('iframe');
        showreelIframe.src = 'https://player.vimeo.com/video/1068241337?byline=0&title=0';
        showreelIframe.setAttribute('frameborder', '0');
        showreelIframe.setAttribute('allow', 'autoplay; fullscreen');
        showreelIframe.style.width = '100%';
        showreelIframe.style.height = '100%';
        showreelIframe.style.position = 'absolute';
        showreelIframe.style.top = '0';
        showreelIframe.style.left = '0';
        mainShowreel.appendChild(showreelIframe);
    }
}

// Función para navegación por scroll
function initScrollNavigation() {
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Resaltar enlace activo durante el scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('.section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Función para inicializar elementos del portfolio
function initPortfolioItems() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('video-modal');
    const modalVideoContainer = document.getElementById('modal-video-container');
    const closeModal = document.querySelector('.close-modal');
    
    // Cargar miniaturas de los videos
    portfolioItems.forEach(item => {
        const videoUrl = item.getAttribute('data-video');
        const thumbnailContainer = item.querySelector('.portfolio-thumbnail');
        
        if (videoUrl && thumbnailContainer) {
            // Extraer ID de video de Vimeo
            const videoId = videoUrl.split('/').pop();
            
            // Cargar miniatura desde Vimeo
            fetch(`https://vimeo.com/api/v2/video/${videoId}.json`)
                .then(response => response.json())
                .then(data => {
                    if (data && data[0] && data[0].thumbnail_large) {
                        thumbnailContainer.style.backgroundImage = `url(${data[0].thumbnail_large})`;
                        thumbnailContainer.style.backgroundSize = 'cover';
                        thumbnailContainer.style.backgroundPosition = 'center';
                        
                        // Actualizar título si está disponible
                        const infoTitle = item.querySelector('.portfolio-info h3');
                        if (infoTitle && data[0].title) {
                            infoTitle.textContent = data[0].title;
                        }
                    }
                })
                .catch(error => {
                    console.error('Error al cargar miniatura:', error);
                    thumbnailContainer.style.backgroundColor = '#333';
                });
        }
        
        // Abrir modal al hacer clic
        item.addEventListener('click', function() {
            const videoUrl = this.getAttribute('data-video');
            if (videoUrl) {
                const videoId = videoUrl.split('/').pop();
                
                // Crear iframe para el video
                modalVideoContainer.innerHTML = '';
                const iframe = document.createElement('iframe');
                iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1&byline=0&title=0`;
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'autoplay; fullscreen');
                iframe.style.position = 'absolute';
                iframe.style.top = '0';
                iframe.style.left = '0';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                
                modalVideoContainer.appendChild(iframe);
                modal.style.display = 'block';
                
                // Evitar scroll del body
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Cerrar modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            modalVideoContainer.innerHTML = '';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            modalVideoContainer.innerHTML = '';
            document.body.style.overflow = 'auto';
        }
    });
}

// Función para inicializar el formulario de contacto
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Validación básica
            if (!name || !email || !subject || !message) {
                alert('Please complete all form fields.');
                return;
            }
            
            // Preparar datos para envío
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('subject', subject);
            formData.append('message', message);
            formData.append('to', 'karlosnogueras@gmail.com');
            
            // Envío real utilizando un servicio de formularios
            fetch('https://formsubmit.co/karlosnogueras@gmail.com', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    // Mostrar mensaje de éxito
                    alert('Thank you for your message! We will contact you soon.');
                    // Limpiar formulario
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Error sending form:', error);
                alert('There was an error sending your message. Please try again later.');
            });
        });
    }
}

// Función para inicializar animaciones
function initAnimations() {
    // Animación de elementos al hacer scroll
    const animatedElements = document.querySelectorAll('.portfolio-item, .service-item, .intro, .contact-form');
    
    // Función para verificar si un elemento está en el viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Función para animar elementos visibles
    function animateOnScroll() {
        // Manejar la clase scrolled para el header
        const header = document.querySelector('.header-content');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Animar elementos cuando son visibles
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                if (!element.classList.contains('animate')) {
                    element.classList.add('animate');
                    
                    // Añadir efecto de entrada según el tipo de elemento
                    if (element.classList.contains('portfolio-item')) {
                        element.style.animation = 'fadeInUp 0.6s ease forwards';
                        element.style.animationDelay = (Array.from(element.parentNode.children).indexOf(element) * 0.1) + 's';
                    } else if (element.classList.contains('service-item')) {
                        element.style.animation = 'fadeInRight 0.6s ease forwards';
                        element.style.animationDelay = (Array.from(element.parentNode.children).indexOf(element) * 0.1) + 's';
                    } else {
                        element.style.animation = 'fadeIn 0.6s ease forwards';
                    }
                }
            }
        });
    }
    
    // Ejecutar al cargar y al hacer scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Animación de iconos de navegación
    const navIcons = document.querySelectorAll('.nav-icon');
    navIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Añadir estilos de animación si no existen
    if (!document.getElementById('animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes fadeInUp {
                from { 
                    opacity: 0;
                    transform: translateY(30px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fadeInRight {
                from { 
                    opacity: 0;
                    transform: translateX(-30px);
                }
                to { 
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            .portfolio-item, .service-item, .intro, .contact-form {
                opacity: 0;
            }
            
            .animate {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
}

// Función para detectar secuencia de activación del CMS
function initCmsSequenceDetection() {
    let keySequence = '';
    const targetSequence = 'oleoleole123';
    
    document.addEventListener('keydown', function(e) {
        // Añadir tecla a la secuencia
        keySequence += e.key;
        
        // Verificar si la secuencia contiene la clave de activación
        if (keySequence.includes(targetSequence)) {
            console.log('¡Secuencia CMS detectada!');
            keySequence = '';
            
            // Mostrar diálogo de autenticación
            const password = prompt('Ingrese la contraseña para acceder al CMS:');
            
            if (password === 'weplay2025') {
                console.log('Contraseña correcta. Activando CMS...');
                // Cargar el script del CMS
                loadCmsScript();
            } else {
                alert('Contraseña incorrecta.');
            }
        }
        
        // Limitar longitud de la secuencia para evitar consumo excesivo de memoria
        if (keySequence.length > 50) {
            keySequence = keySequence.substring(keySequence.length - 20);
        }
    });
}

// Función para cargar el script del CMS
function loadCmsScript() {
    // El CMS se implementará en un archivo separado (cms.js)
    console.log('Cargando CMS...');
    
    // Activar interfaz del CMS
    const cmsScript = document.createElement('script');
    cmsScript.src = 'js/cms.js';
    document.body.appendChild(cmsScript);
}

// Mejoras en las animaciones y transiciones

// Configuración de duración de transiciones más largas
const TRANSITION_DURATION = '1.2s'; // Duración extendida para transiciones más suaves
const TRANSITION_TIMING = 'cubic-bezier(0.165, 0.84, 0.44, 1)'; // Curva de aceleración suave

// Función para inicializar las animaciones mejoradas
function initEnhancedAnimations() {
    // Aplicar configuración de AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1200, // Duración más larga (1.2 segundos)
            easing: 'ease-out-cubic', // Curva de aceleración suave
            once: false, // Permitir que las animaciones se repitan al hacer scroll hacia arriba
            mirror: true, // Animar elementos al salir del viewport (scroll hacia arriba)
            offset: 120, // Iniciar animación un poco antes
            delay: 100, // Pequeño retraso para efecto más natural
            anchorPlacement: 'top-bottom' // Punto de anclaje para la animación
        });
    }
    
    // Aplicar estilos de transición a elementos clave
    applyEnhancedTransitions();
    
    // Inicializar observador de intersección para animaciones personalizadas
    initIntersectionObserver();
}

// Función para aplicar transiciones mejoradas a elementos clave
function applyEnhancedTransitions() {
    // Seleccionar elementos para aplicar transiciones
    const elements = document.querySelectorAll('.portfolio-item, .service-item, .social-icon, .intro, .header-quote');
    
    elements.forEach(element => {
        // Aplicar transiciones CSS mejoradas
        element.style.transition = `all ${TRANSITION_DURATION} ${TRANSITION_TIMING}`;
        
        // Añadir clase para identificar elementos con transiciones mejoradas
        element.classList.add('enhanced-transition');
    });
    
    // Aplicar transiciones específicas a elementos de portfolio
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.style.transitionProperty = 'transform, opacity, box-shadow';
        
        // Añadir efecto hover mejorado
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });
    });
    
    // Aplicar transiciones específicas a elementos de servicio
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        item.style.transitionProperty = 'transform, opacity, background-color';
        
        // Añadir efecto hover mejorado
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.backgroundColor = 'rgba(255, 107, 0, 0.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.backgroundColor = 'transparent';
        });
    });
}

// Función para inicializar observador de intersección para animaciones personalizadas
function initIntersectionObserver() {
    // Opciones para el observador
    const options = {
        root: null, // Viewport como referencia
        rootMargin: '0px', // Sin margen
        threshold: [0.1, 0.5, 0.9] // Múltiples umbrales para animación progresiva
    };
    
    // Crear observador
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Elemento que está siendo observado
            const element = entry.target;
            
            // Si el elemento está entrando en el viewport
            if (entry.isIntersecting) {
                // Aplicar animación según el ratio de intersección
                const ratio = entry.intersectionRatio;
                
                // Aplicar opacidad proporcional a la visibilidad
                element.style.opacity = Math.min(1, ratio * 1.5);
                
                // Aplicar transformación proporcional
                if (element.classList.contains('fade-up')) {
                    const translateY = 40 - (ratio * 40); // De 40px a 0px
                    element.style.transform = `translateY(${translateY}px)`;
                } else if (element.classList.contains('fade-right')) {
                    const translateX = 40 - (ratio * 40); // De 40px a 0px
                    element.style.transform = `translateX(${translateX}px)`;
                }
                
                // Si está casi completamente visible, añadir clase de animación completa
                if (ratio > 0.8) {
                    element.classList.add('fully-visible');
                }
            } else {
                // Si el elemento está saliendo del viewport y no tiene la clase 'once'
                if (!element.classList.contains('once')) {
                    // Resetear opacidad gradualmente
                    element.style.opacity = '0';
                    
                    // Resetear transformación según el tipo
                    if (element.classList.contains('fade-up')) {
                        element.style.transform = 'translateY(40px)';
                    } else if (element.classList.contains('fade-right')) {
                        element.style.transform = 'translateX(40px)';
                    }
                    
                    // Quitar clase de animación completa
                    element.classList.remove('fully-visible');
                }
            }
        });
    }, options);
    
    // Observar elementos con clases de animación personalizada
    document.querySelectorAll('.fade-up, .fade-right, .fade-in').forEach(element => {
        // Configurar estado inicial
        element.style.opacity = '0';
        element.style.transition = `opacity ${TRANSITION_DURATION} ${TRANSITION_TIMING}, transform ${TRANSITION_DURATION} ${TRANSITION_TIMING}`;
        
        if (element.classList.contains('fade-up')) {
            element.style.transform = 'translateY(40px)';
        } else if (element.classList.contains('fade-right')) {
            element.style.transform = 'translateX(40px)';
        }
        
        // Comenzar a observar
        observer.observe(element);
    });
}

// Función para aplicar animaciones a elementos específicos
function applySpecificAnimations() {
    // Animación para el logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.transition = `all ${TRANSITION_DURATION} ${TRANSITION_TIMING}`;
        logo.classList.add('enhanced-transition');
    }
    
    // Animación para la cita de cabecera
    const headerQuote = document.querySelector('.header-quote');
    if (headerQuote) {
        headerQuote.style.transition = `all ${TRANSITION_DURATION} ${TRANSITION_TIMING}`;
        headerQuote.classList.add('fade-in');
        headerQuote.classList.add('enhanced-transition');
    }
    
    // Animaciones para secciones
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        // Añadir clases de animación con retrasos escalonados
        section.style.transition = `all ${TRANSITION_DURATION} ${TRANSITION_TIMING}`;
        section.classList.add('fade-up');
        section.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Función para mejorar el formulario de contacto
function enhanceContactForm() {
    const form = document.querySelector('form');
    if (!form) return;
    
    // Añadir transiciones a los campos del formulario
    const formElements = form.querySelectorAll('input, textarea, button');
    formElements.forEach((element, index) => {
        element.style.transition = `all ${TRANSITION_DURATION} ${TRANSITION_TIMING}`;
        element.classList.add('fade-up');
        element.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Mejorar la limpieza del formulario después del envío
    form.addEventListener('submit', function(e) {
        // El evento submit continuará normalmente
        
        // Programar la limpieza del formulario después del envío
        setTimeout(() => {
            // Resetear el formulario
            this.reset();
            
            // Limpiar cada campo individualmente
            this.querySelectorAll('input, textarea').forEach(field => {
                field.value = '';
                field.blur();
            });
            
            // Mostrar mensaje de confirmación
            showNotification('Your message has been sent successfully!');
        }, 500);
    });
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar animaciones mejoradas
    initEnhancedAnimations();
    
    // Aplicar animaciones específicas
    applySpecificAnimations();
    
    // Mejorar formulario de contacto
    enhanceContactForm();
    
    // Disparar evento personalizado para indicar que las animaciones están cargadas
    const event = new CustomEvent('animations:enhanced', { detail: { version: '1.0' } });
    document.body.dispatchEvent(event);
});

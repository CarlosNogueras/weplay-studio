// Sistema CMS mejorado para WePlay Studio Portfolio
// Este script implementa un sistema CMS seguro con cambios permanentes al código

// Variables globales
let isAuthenticated = false;
let editMode = false;
let originalContent = {};
let changedContent = {};

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistema de autenticación oculto
    initHiddenAuth();
});

// Función para inicializar sistema de autenticación oculto
function initHiddenAuth() {
    // Crear elemento oculto para activación
    const hiddenAuth = document.createElement('div');
    hiddenAuth.id = 'hidden-auth-trigger';
    hiddenAuth.style.position = 'fixed';
    hiddenAuth.style.bottom = '0';
    hiddenAuth.style.right = '0';
    hiddenAuth.style.width = '10px';
    hiddenAuth.style.height = '10px';
    hiddenAuth.style.zIndex = '9999';
    hiddenAuth.style.opacity = '0';
    document.body.appendChild(hiddenAuth);
    
    // Detectar secuencia especial
    let keySequence = '';
    const targetSequence = 'oleoleole123';
    
    document.addEventListener('keydown', function(e) {
        // Añadir tecla a la secuencia
        keySequence += e.key;
        
        // Verificar si la secuencia contiene la clave de activación
        if (keySequence.includes(targetSequence)) {
            console.log('Secuencia CMS detectada');
            keySequence = '';
            
            if (!isAuthenticated) {
                showLoginForm();
            } else {
                toggleCmsPanel();
            }
        }
        
        // Limitar longitud de la secuencia
        if (keySequence.length > 50) {
            keySequence = keySequence.substring(keySequence.length - 20);
        }
    });
    
    // También permitir activación haciendo clic en la esquina inferior derecha 5 veces
    let clickCount = 0;
    hiddenAuth.addEventListener('click', function() {
        clickCount++;
        if (clickCount >= 5) {
            clickCount = 0;
            if (!isAuthenticated) {
                showLoginForm();
            } else {
                toggleCmsPanel();
            }
        }
        
        // Resetear contador después de 3 segundos
        setTimeout(() => {
            clickCount = 0;
        }, 3000);
    });
}

// Función para mostrar formulario de login
function showLoginForm() {
    // Crear overlay para el formulario
    const overlay = document.createElement('div');
    overlay.id = 'cms-login-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.zIndex = '10000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    
    // Crear formulario de login
    const loginForm = document.createElement('div');
    loginForm.style.backgroundColor = '#1e1e1e';
    loginForm.style.padding = '30px';
    loginForm.style.borderRadius = '8px';
    loginForm.style.width = '300px';
    loginForm.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
    
    loginForm.innerHTML = `
        <h2 style="color: #ff6b00; margin-bottom: 20px; text-align: center;">WePlay Studio CMS</h2>
        <p style="color: white; margin-bottom: 20px; text-align: center;">Please enter your password to access the CMS</p>
        <input type="password" id="cms-password" style="width: 100%; padding: 10px; margin-bottom: 20px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;" placeholder="Password">
        <div style="display: flex; justify-content: space-between;">
            <button id="cms-login-cancel" style="padding: 10px 15px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
            <button id="cms-login-submit" style="padding: 10px 15px; background: #ff6b00; color: white; border: none; border-radius: 4px; cursor: pointer;">Login</button>
        </div>
    `;
    
    overlay.appendChild(loginForm);
    document.body.appendChild(overlay);
    
    // Enfocar el campo de contraseña
    setTimeout(() => {
        document.getElementById('cms-password').focus();
    }, 100);
    
    // Manejar eventos de login
    document.getElementById('cms-login-submit').addEventListener('click', function() {
        authenticateUser();
    });
    
    document.getElementById('cms-password').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            authenticateUser();
        }
    });
    
    document.getElementById('cms-login-cancel').addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
}

// Función para autenticar usuario
function authenticateUser() {
    const password = document.getElementById('cms-password').value;
    
    if (password === 'weplay2025') {
        isAuthenticated = true;
        
        // Eliminar overlay de login
        const overlay = document.getElementById('cms-login-overlay');
        if (overlay) {
            document.body.removeChild(overlay);
        }
        
        // Inicializar CMS
        initCmsPanel();
    } else {
        alert('Incorrect password. Please try again.');
    }
}

// Función para inicializar panel CMS
function initCmsPanel() {
    // Crear panel CMS si no existe
    if (!document.getElementById('cms-panel')) {
        const cmsPanel = document.createElement('div');
        cmsPanel.id = 'cms-panel';
        cmsPanel.style.position = 'fixed';
        cmsPanel.style.top = '0';
        cmsPanel.style.right = '-400px'; // Inicialmente oculto
        cmsPanel.style.width = '400px';
        cmsPanel.style.height = '100vh';
        cmsPanel.style.backgroundColor = '#1e1e1e';
        cmsPanel.style.color = '#ffffff';
        cmsPanel.style.padding = '20px';
        cmsPanel.style.boxShadow = '-5px 0 15px rgba(0, 0, 0, 0.5)';
        cmsPanel.style.zIndex = '9999';
        cmsPanel.style.overflowY = 'auto';
        cmsPanel.style.transition = 'right 0.3s ease';
        
        // Contenido del panel
        cmsPanel.innerHTML = `
            <div class="cms-header">
                <h2 style="color: #ff6b00; margin-bottom: 20px;">WePlay Studio CMS</h2>
                <button id="cms-close" style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
                <div id="cms-edit-mode-toggle" style="margin-bottom: 20px;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="edit-mode-checkbox" style="margin-right: 10px;">
                        <span>Edit Mode</span>
                    </label>
                </div>
            </div>
            <div class="cms-content">
                <div class="cms-section">
                    <h3 style="margin: 15px 0; border-bottom: 1px solid #444; padding-bottom: 10px;">Edit Sections</h3>
                    <div class="cms-option">
                        <button class="cms-section-btn" data-section="header" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer; text-align: left;">Header Section</button>
                        <button class="cms-section-btn" data-section="home" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer; text-align: left;">Home Section</button>
                        <button class="cms-section-btn" data-section="portfolio" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer; text-align: left;">Portfolio Section</button>
                        <button class="cms-section-btn" data-section="services" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer; text-align: left;">Services Section</button>
                        <button class="cms-section-btn" data-section="contact" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer; text-align: left;">Contact Section</button>
                    </div>
                </div>
                
                <div class="cms-section">
                    <h3 style="margin: 15px 0; border-bottom: 1px solid #444; padding-bottom: 10px;">Manage Projects</h3>
                    <div class="cms-option">
                        <button id="cms-add-project" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #ff6b00; color: white; border: none; border-radius: 4px; cursor: pointer; text-align: center;"><i class="fas fa-plus"></i> Add New Project</button>
                    </div>
                </div>
                
                <div id="cms-section-editor" style="display: none; margin-top: 20px;">
                    <h3 id="cms-editor-title" style="margin: 15px 0; border-bottom: 1px solid #444; padding-bottom: 10px;">Edit Section</h3>
                    <div id="cms-editor-content"></div>
                    <div style="margin-top: 20px; display: flex; justify-content: space-between;">
                        <button id="cms-editor-cancel" style="padding: 10px 15px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                        <button id="cms-editor-save" style="padding: 10px 15px; background: #ff6b00; color: white; border: none; border-radius: 4px; cursor: pointer;">Save Changes</button>
                    </div>
                </div>
                
                <div class="cms-section" style="margin-top: 30px;">
                    <h3 style="margin: 15px 0; border-bottom: 1px solid #444; padding-bottom: 10px;">Global Settings</h3>
                    <div class="cms-option">
                        <label for="cms-color-bg" style="display: block; margin-bottom: 5px;">Background Color:</label>
                        <input type="color" id="cms-color-bg" value="#121212" style="width: 100%; height: 40px; margin-bottom: 15px; background: #333; border: 1px solid #555;">
                    </div>
                    <div class="cms-option">
                        <label for="cms-color-accent" style="display: block; margin-bottom: 5px;">Accent Color:</label>
                        <input type="color" id="cms-color-accent" value="#ff6b00" style="width: 100%; height: 40px; margin-bottom: 15px; background: #333; border: 1px solid #555;">
                    </div>
                    <button id="cms-apply-colors" style="width: 100%; padding: 10px; margin-top: 10px; background: #ff6b00; color: white; border: none; border-radius: 4px; cursor: pointer;">Apply Colors</button>
                </div>
                
                <div class="cms-section" style="margin-top: 30px;">
                    <h3 style="margin: 15px 0; border-bottom: 1px solid #444; padding-bottom: 10px;">Save All Changes</h3>
                    <p style="margin-bottom: 15px; font-size: 14px; color: #aaa;">Save all changes permanently to the website code.</p>
                    <button id="cms-save-permanent" style="width: 100%; padding: 10px; background: #ff6b00; color: white; border: none; border-radius: 4px; cursor: pointer;">Save Permanently</button>
                </div>
                
                <div class="cms-section" style="margin-top: 30px;">
                    <h3 style="margin: 15px 0; border-bottom: 1px solid #444; padding-bottom: 10px;">Logout</h3>
                    <button id="cms-logout" style="width: 100%; padding: 10px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; cursor: pointer;">Logout from CMS</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(cmsPanel);
        
        // Inicializar eventos del CMS
        initCmsEvents();
        
        // Inicializar integración con Netlify si está disponible
        if (window.NetlifyAPI && typeof window.NetlifyAPI.init === 'function') {
            window.NetlifyAPI.init();
        }
    }
    
    // Mostrar panel
    toggleCmsPanel();
}

// Función para mostrar/ocultar panel CMS
function toggleCmsPanel() {
    const cmsPanel = document.getElementById('cms-panel');
    if (cmsPanel) {
        const currentRight = window.getComputedStyle(cmsPanel).right;
        if (currentRight === '0px') {
            cmsPanel.style.right = '-400px';
        } else {
            cmsPanel.style.right = '0';
        }
    }
}

// Función para inicializar eventos del CMS
function initCmsEvents() {
    // Cerrar CMS
    document.getElementById('cms-close').addEventListener('click', function() {
        toggleCmsPanel();
    });
    
    // Toggle modo edición
    document.getElementById('edit-mode-checkbox').addEventListener('change', function() {
        editMode = this.checked;
        toggleEditMode(editMode);
    });
    
    // Botones de sección
    const sectionButtons = document.querySelectorAll('.cms-section-btn');
    sectionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            openSectionEditor(section);
        });
    });
    
    // Botón añadir proyecto
    document.getElementById('cms-add-project').addEventListener('click', function() {
        openAddProjectForm();
    });
    
    // Botón cancelar editor
    document.getElementById('cms-editor-cancel').addEventListener('click', function() {
        document.getElementById('cms-section-editor').style.display = 'none';
    });
    
    // Botón guardar editor
    document.getElementById('cms-editor-save').addEventListener('click', function() {
        saveSectionChanges();
    });
    
    // Botón aplicar colores
    document.getElementById('cms-apply-colors').addEventListener('click', function() {
        applyColorChanges();
    });
    
    // Botón guardar permanentemente
    document.getElementById('cms-save-permanent').addEventListener('click', function() {
        savePermanentChanges();
    });
    
    // Botón logout
    document.getElementById('cms-logout').addEventListener('click', function() {
        logoutFromCms();
    });
}

// Función para activar/desactivar modo edición
function toggleEditMode(enabled) {
    if (enabled) {
        // Guardar contenido original
        saveOriginalContent();
        
        // Añadir clase de edición al body
        document.body.classList.add('cms-edit-mode');
        
        // Hacer elementos editables
        makeElementsEditable();
        
        // Mostrar mensaje
        showNotification('Edit mode enabled. Click on text to edit.');
    } else {
        // Quitar clase de edición
        document.body.classList.remove('cms-edit-mode');
        
        // Quitar editables
        removeEditableElements();
        
        // Mostrar mensaje
        showNotification('Edit mode disabled.');
    }
}

// Función para guardar contenido original
function saveOriginalContent() {
    originalContent = {
        headerVideo: document.getElementById('header-video').innerHTML,
        headerQuote: document.querySelector('.header-quote p').textContent,
        mainShowreel: document.getElementById('main-showreel').innerHTML,
        introTitle: document.querySelector('.intro h2').textContent,
        introText: document.querySelector('.intro p').textContent,
        portfolioTitle: document.querySelector('#portfolio h2').textContent,
        servicesTitle: document.querySelector('#services h2').textContent,
        serviceItems: Array.from(document.querySelectorAll('.service-item')).map(item => {
            return {
                title: item.querySelector('h3').textContent,
                text: item.querySelector('p').textContent
            };
        }),
        contactTitle: document.querySelector('#contact h2').textContent
    };
}

// Función para hacer elementos editables
function makeElementsEditable() {
    // Títulos y textos
    const editableElements = [
        document.querySelector('.header-quote p'),
        document.querySelector('.intro h2'),
        document.querySelector('.intro p'),
        document.querySelector('#portfolio h2'),
        document.querySelector('#services h2'),
        document.querySelector('#contact h2')
    ];
    
    editableElements.forEach(el => {
        if (el) {
            el.contentEditable = true;
            el.classList.add('cms-editable');
            
            // Añadir evento para guardar cambios
            el.addEventListener('blur', function() {
                changedContent[el.id || el.tagName + '-' + Math.random().toString(36).substr(2, 9)] = el.textContent;
            });
        }
    });
    
    // Servicios
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach((item, index) => {
        const title = item.querySelector('h3');
        const text = item.querySelector('p');
        
        if (title) {
            title.contentEditable = true;
            title.classList.add('cms-editable');
            title.id = 'service-title-' + index;
            
            title.addEventListener('blur', function() {
                changedContent[title.id] = title.textContent;
            });
        }
        
        if (text) {
            text.contentEditable = true;
            text.classList.add('cms-editable');
            text.id = 'service-text-' + index;
            
            text.addEventListener('blur', function() {
                changedContent[text.id] = text.textContent;
            });
        }
    });
    
    // Añadir estilos para editables
    addEditableStyles();
}

// Función para añadir estilos para elementos editables
function addEditableStyles() {
    if (!document.getElementById('cms-editable-styles')) {
        const style = document.createElement('style');
        style.id = 'cms-editable-styles';
        style.textContent = `
            .cms-editable {
                border: 2px dashed #ff6b00;
                padding: 5px;
                min-height: 20px;
                position: relative;
            }
            .cms-editable:hover {
                background-color: rgba(255, 107, 0, 0.1);
            }
            .cms-editable:focus {
                outline: none;
                border: 2px solid #ff6b00;
                background-color: rgba(255, 107, 0, 0.2);
            }
        `;
        document.head.appendChild(style);
    }
}

// Función para quitar elementos editables
function removeEditableElements() {
    // Quitar contentEditable y clases
    document.querySelectorAll('.cms-editable').forEach(el => {
        el.contentEditable = false;
        el.classList.remove('cms-editable');
    });
    
    // Quitar estilos
    const editableStyles = document.getElementById('cms-editable-styles');
    if (editableStyles) {
        document.head.removeChild(editableStyles);
    }
}

// Función para abrir editor de sección
function openSectionEditor(section) {
    const editorTitle = document.getElementById('cms-editor-title');
    const editorContent = document.getElementById('cms-editor-content');
    
    // Configurar título
    editorTitle.textContent = 'Edit ' + section.charAt(0).toUpperCase() + section.slice(1) + ' Section';
    
    // Limpiar contenido anterior
    editorContent.innerHTML = '';
    
    // Configurar contenido según sección
    switch (section) {
        case 'header':
            editorContent.innerHTML = `
                <div class="cms-editor-field">
                    <label for="header-video-url" style="display: block; margin-bottom: 5px;">Header Video URL (Vimeo):</label>
                    <input type="text" id="header-video-url" value="https://vimeo.com/weplaystudio/hello" style="width: 100%; padding: 8px; margin-bottom: 15px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
                </div>
            `;
            break;
            
        case 'home':
            editorContent.innerHTML = `
                <div class="cms-editor-field">
                    <label for="showreel-url" style="display: block; margin-bottom: 5px;">Showreel Video URL (Vimeo):</label>
                    <input type="text" id="showreel-url" value="https://vimeo.com/1068241337" style="width: 100%; padding: 8px; margin-bottom: 15px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
                </div>
                <div class="cms-editor-field">
                    <label for="intro-title" style="display: block; margin-bottom: 5px;">Introduction Title:</label>
                    <input type="text" id="intro-title" value="${document.querySelector('.intro h2').textContent}" style="width: 100%; padding: 8px; margin-bottom: 15px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
                </div>
                <div class="cms-editor-field">
                    <label for="intro-text" style="display: block; margin-bottom: 5px;">Introduction Text:</label>
                    <textarea id="intro-text" rows="4" style="width: 100%; padding: 8px; margin-bottom: 15px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">${document.querySelector('.intro p').textContent}</textarea>
                </div>
            `;
            break;
            
        case 'portfolio':
            let portfolioHtml = `
                <div class="cms-editor-field">
                    <label for="portfolio-title" style="display: block; margin-bottom: 5px;">Portfolio Title:</label>
                    <input type="text" id="portfolio-title" value="${document.querySelector('#portfolio h2').textContent}" style="width: 100%; padding: 8px; margin-bottom: 15px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
                </div>
            `;
            
            // Añadir campos para cada proyecto
            const portfolioItems = document.querySelectorAll('.portfolio-item');
            portfolioItems.forEach((item, index) => {
                const videoUrl = item.getAttribute('data-video');
                const title = item.querySelector('.portfolio-info h3').textContent;
                const category = item.querySelector('.portfolio-info p').textContent;
                
                portfolioHtml += `
                    <div class="cms-editor-field" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #444;">
                        <h4 style="margin-bottom: 10px;">Project ${index + 1}</h4>
                        <label for="portfolio-video-${index}" style="display: block; margin-bottom: 5px;">Video URL (Vimeo):</label>
                        <input type="text" id="portfolio-video-${index}" value="${videoUrl}" style="width: 100%; padding: 8px; margin-bottom: 15px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
                        
                        <label for="portfolio-title-${index}" style="display: block; margin-bottom: 5px;">Project Title:</label>
                        <input type="text" id="portfolio-title-${index}" value="${title}" style="width: 100%; padding: 8px; margin-bottom: 15px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
                        
                        <label for="portfolio-category-${index}" style="display: block; margin-bottom: 5px;">Project Category:</label>
                        <input type="text" id="portfolio-category-${index}" value="${category}" style="width: 100%; padding: 8px; margin-bottom: 15px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
                    </div>
                `;
            });
            
            editorContent.innerHTML = portfolioHtml;
            break;
            
        case 'services':
            let servicesHtml = `
                <div class="cms-editor-field">
                    <label for="services-title" style="display: block; margin-bottom: 5px;">Services Title:</label>
                    <input type="text" id="services-title" value="${document.querySelector('#services h2').textContent}" style="width: 100%; padding: 8px; margin-bottom: 15px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
                </div>
            `;
            
            // Añadir campos para cada servicio
            const serviceItems = document.querySelectorAll('.service-item');
            serviceItems.forEach((item, index) => {
                const title = item.querySelector('h3').textContent;
                const text = item.querySelector('p').textContent;
                
                servicesHtml += `
                    <div class="cms-editor-field" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #444;">
                        <h4 style="margin-bottom: 10px;">Service ${index + 1}</h4>
                        <label for="service-title-${index}" style="display: block; margin-bottom: 5px;">Service Title:</label>
                        <input type="text" id="service-title-${index}" value="${title}" style="width: 100%; padding: 8px; margin-bottom: 15px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
                        
                        <label for="service-text-${index}" style="display: block; margin-bottom: 5px;">Service Description:</label>
                        <textarea id="service-text-${index}" rows="4" style="width: 100%; padding: 8px; margin-bottom: 15px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">${text}</textarea>
                    </div>
                `;
            });
            
            editorContent.innerHTML = servicesHtml;
            break;
            
        case 'contact':
            editorContent.innerHTML = `
                <div class="cms-editor-field">
                    <label for="contact-title" style="display: block; margin-bottom: 5px;">Contact Title:</label>
                    <input type="text" id="contact-title" value="${document.querySelector('#contact h2').textContent}" style="width: 100%; padding: 8px; margin-bottom: 15px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
                </div>
                <div class="cms-editor-field">
                    <label for="contact-email" style="display: block; margin-bottom: 5px;">Contact Email:</label>
                    <input type="email" id="contact-email" value="karlosnogueras@gmail.com" style="width: 100%; padding: 8px; margin-bottom: 15px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
                </div>
            `;
            break;
    }
    
    // Guardar sección actual
    document.getElementById('cms-section-editor').setAttribute('data-current-section', section);
    
    // Mostrar editor
    document.getElementById('cms-section-editor').style.display = 'block';
}

// Función para guardar cambios de sección
function saveSectionChanges() {
    const section = document.getElementById('cms-section-editor').getAttribute('data-current-section');
    
    switch (section) {
        case 'header':
            const headerVideoUrl = document.getElementById('header-video-url').value;
            updateHeaderVideo(headerVideoUrl);
            break;
            
        case 'home':
            const showreelUrl = document.getElementById('showreel-url').value;
            const introTitle = document.getElementById('intro-title').value;
            const introText = document.getElementById('intro-text').value;
            
            updateShowreel(showreelUrl);
            updateIntroSection(introTitle, introText);
            break;
            
        case 'portfolio':
            const portfolioTitle = document.getElementById('portfolio-title').value;
            document.querySelector('#portfolio h2').textContent = portfolioTitle;
            
            // Actualizar proyectos
            const portfolioItems = document.querySelectorAll('.portfolio-item');
            portfolioItems.forEach((item, index) => {
                const videoUrl = document.getElementById(`portfolio-video-${index}`).value;
                const title = document.getElementById(`portfolio-title-${index}`).value;
                const category = document.getElementById(`portfolio-category-${index}`).value;
                
                item.setAttribute('data-video', videoUrl);
                item.querySelector('.portfolio-info h3').textContent = title;
                item.querySelector('.portfolio-info p').textContent = category;
            });
            break;
            
        case 'services':
            const servicesTitle = document.getElementById('services-title').value;
            document.querySelector('#services h2').textContent = servicesTitle;
            
            // Actualizar servicios
            const serviceItems = document.querySelectorAll('.service-item');
            serviceItems.forEach((item, index) => {
                const title = document.getElementById(`service-title-${index}`).value;
                const text = document.getElementById(`service-text-${index}`).value;
                
                item.querySelector('h3').textContent = title;
                item.querySelector('p').textContent = text;
            });
            break;
            
        case 'contact':
            const contactTitle = document.getElementById('contact-title').value;
            const contactEmail = document.getElementById('contact-email').value;
            
            document.querySelector('#contact h2').textContent = contactTitle;
            
            // Actualizar email en el formulario
            const formScript = document.querySelector('form').getAttribute('action');
            if (formScript) {
                document.querySelector('form').setAttribute('action', `https://formsubmit.co/${contactEmail}`);
            }
            break;
    }
    
    // Ocultar editor
    document.getElementById('cms-section-editor').style.display = 'none';
    
    // Mostrar notificación
    showNotification('Changes saved successfully!');
}

// Función para actualizar video de cabecera
function updateHeaderVideo(videoUrl) {
    // Extraer ID de Vimeo
    const videoId = extractVideoId(videoUrl);
    
    if (videoId) {
        const headerVideo = document.getElementById('header-video');
        headerVideo.innerHTML = '';
        
        const headerIframe = document.createElement('iframe');
        headerIframe.src = `https://player.vimeo.com/video/${videoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`;
        headerIframe.setAttribute('frameborder', '0');
        headerIframe.setAttribute('allow', 'autoplay; fullscreen');
        headerIframe.style.width = '100%';
        headerIframe.style.height = '100%';
        headerIframe.style.position = 'absolute';
        headerIframe.style.top = '0';
        headerIframe.style.left = '0';
        
        headerVideo.appendChild(headerIframe);
    }
}

// Función para actualizar showreel
function updateShowreel(videoUrl) {
    // Extraer ID de Vimeo
    const videoId = extractVideoId(videoUrl);
    
    if (videoId) {
        const mainShowreel = document.getElementById('main-showreel');
        mainShowreel.innerHTML = '';
        
        const showreelIframe = document.createElement('iframe');
        showreelIframe.src = `https://player.vimeo.com/video/${videoId}?byline=0&title=0`;
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

// Función para actualizar sección de introducción
function updateIntroSection(title, text) {
    document.querySelector('.intro h2').textContent = title;
    document.querySelector('.intro p').textContent = text;
}

// Función para aplicar cambios de color
function applyColorChanges() {
    const bgColor = document.getElementById('cms-color-bg').value;
    const accentColor = document.getElementById('cms-color-accent').value;
    
    // Aplicar colores a variables CSS
    document.documentElement.style.setProperty('--color-bg-primary', bgColor);
    document.documentElement.style.setProperty('--color-accent', accentColor);
    
    // Mostrar notificación
    showNotification('Colors applied successfully!');
}

// Función para guardar cambios permanentemente
function savePermanentChanges() {
    if (confirm('Are you sure you want to save all changes permanently? This will modify the website code.')) {
        // Recopilar todos los cambios actuales
        const currentChanges = {
            headerVideo: document.getElementById('header-video').innerHTML,
            headerQuote: document.querySelector('.header-quote p').textContent,
            mainShowreel: document.getElementById('main-showreel').innerHTML,
            introTitle: document.querySelector('.intro h2').textContent,
            introText: document.querySelector('.intro p').textContent,
            portfolioTitle: document.querySelector('#portfolio h2').textContent,
            portfolioItems: Array.from(document.querySelectorAll('.portfolio-item')).map(item => {
                return {
                    videoUrl: item.getAttribute('data-video'),
                    title: item.querySelector('.portfolio-info h3').textContent,
                    category: item.querySelector('.portfolio-info p').textContent
                };
            }),
            servicesTitle: document.querySelector('#services h2').textContent,
            serviceItems: Array.from(document.querySelectorAll('.service-item')).map(item => {
                return {
                    title: item.querySelector('h3').textContent,
                    text: item.querySelector('p').textContent
                };
            }),
            socialTitle: document.querySelector('#social h2').textContent,
            socialLinks: Array.from(document.querySelectorAll('.social-links a')).map(link => {
                return {
                    url: link.getAttribute('href'),
                    icon: link.querySelector('i').className
                };
            }),
            contactTitle: document.querySelector('#contact h2').textContent,
            contactEmail: document.querySelector('form').getAttribute('action').replace('https://formsubmit.co/', '')
        };
        
        // Guardar cambios en localStorage para persistencia
        localStorage.setItem('weplay-cms-changes', JSON.stringify(currentChanges));
        
        // Crear un objeto con los cambios para enviar al servidor
        const changesForServer = {
            type: 'cms_save_changes',
            changes: currentChanges,
            timestamp: new Date().toISOString()
        };
        
        // Intentar guardar en Netlify si está disponible
        if (window.NetlifyAPI && typeof window.NetlifyAPI.saveChanges === 'function') {
            window.NetlifyAPI.saveChanges(changesForServer)
                .then(success => {
                    if (!success) {
                        // Si falla, ofrecer descarga como respaldo
                        createDownloadableChanges(changesForServer);
                    }
                })
                .catch(error => {
                    console.error('Error saving to Netlify:', error);
                    // Si hay error, ofrecer descarga como respaldo
                    createDownloadableChanges(changesForServer);
                });
        } else {
            // Si Netlify API no está disponible, usar método de descarga
            createDownloadableChanges(changesForServer);
        }
        
        // Guardar estado actual como original
        saveOriginalContent();
        
        // Mostrar notificación
        showNotification('All changes have been saved permanently!');
    }
}

// Función para crear archivo descargable con los cambios
function createDownloadableChanges(changesData) {
    // Crear un archivo de cambios descargable
    const changesBlob = new Blob([JSON.stringify(changesData, null, 2)], {type: 'application/json'});
    const changesURL = URL.createObjectURL(changesBlob);
    
    // Crear enlace de descarga
    const downloadLink = document.createElement('a');
    downloadLink.href = changesURL;
    downloadLink.download = 'weplay-cms-changes.json';
    
    // Añadir temporalmente al DOM, hacer clic y eliminar
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
        showNotification('All changes have been saved permanently! Download the changes file to apply them to your repository.');
    }
}

// Función para cerrar sesión del CMS
function logoutFromCms() {
    if (confirm('Are you sure you want to logout from the CMS?')) {
        // Desactivar modo edición si está activo
        if (editMode) {
            document.getElementById('edit-mode-checkbox').checked = false;
            toggleEditMode(false);
        }
        
        // Ocultar panel CMS
        const cmsPanel = document.getElementById('cms-panel');
        if (cmsPanel) {
            cmsPanel.style.right = '-400px';
            
            // Eliminar panel después de la animación
            setTimeout(() => {
                document.body.removeChild(cmsPanel);
            }, 300);
        }
        
        // Resetear autenticación
        isAuthenticated = false;
        
        // Mostrar notificación
        showNotification('Logged out successfully!');
    }
}

// Función para mostrar notificación
function showNotification(message) {
    // Crear elemento de notificación si no existe
    if (!document.getElementById('cms-notification')) {
        const notification = document.createElement('div');
        notification.id = 'cms-notification';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '20px';
        notification.style.backgroundColor = '#ff6b00';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        notification.style.zIndex = '10001';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(notification);
    }
    
    // Actualizar mensaje y mostrar
    const notification = document.getElementById('cms-notification');
    notification.textContent = message;
    notification.style.opacity = '1';
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
    }, 3000);
}

// Función para abrir formulario de añadir proyecto
function openAddProjectForm() {
    const editorTitle = document.getElementById('cms-editor-title');
    const editorContent = document.getElementById('cms-editor-content');
    
    // Configurar título
    editorTitle.textContent = 'Add New Project';
    
    // Limpiar contenido anterior
    editorContent.innerHTML = '';
    
    // Crear formulario para nuevo proyecto
    editorContent.innerHTML = `
        <div class="cms-editor-field">
            <label for="new-project-video" style="display: block; margin-bottom: 5px;">Video URL (Vimeo):</label>
            <input type="text" id="new-project-video" style="width: 100%; padding: 8px; margin-bottom: 15px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;" placeholder="https://vimeo.com/...">
        </div>
        <div class="cms-editor-field">
            <label for="new-project-title" style="display: block; margin-bottom: 5px;">Project Title:</label>
            <input type="text" id="new-project-title" style="width: 100%; padding: 8px; margin-bottom: 15px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;" placeholder="Project Title">
        </div>
        <div class="cms-editor-field">
            <label for="new-project-category" style="display: block; margin-bottom: 5px;">Project Category:</label>
            <input type="text" id="new-project-category" style="width: 100%; padding: 8px; margin-bottom: 15px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;" placeholder="Animation, 3D, Motion Graphics, etc.">
        </div>
        <div style="margin-top: 20px; display: flex; justify-content: space-between;">
            <button id="new-project-cancel" style="padding: 10px 15px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
            <button id="new-project-add" style="padding: 10px 15px; background: #ff6b00; color: white; border: none; border-radius: 4px; cursor: pointer;">Add Project</button>
        </div>
    `;
    
    // Mostrar editor
    document.getElementById('cms-section-editor').style.display = 'block';
    document.getElementById('cms-section-editor').setAttribute('data-current-section', 'new-project');
    
    // Añadir eventos a los botones
    document.getElementById('new-project-cancel').addEventListener('click', function() {
        document.getElementById('cms-section-editor').style.display = 'none';
    });
    
    document.getElementById('new-project-add').addEventListener('click', function() {
        addNewProject();
    });
}

// Función para añadir nuevo proyecto
function addNewProject() {
    const videoUrl = document.getElementById('new-project-video').value;
    const title = document.getElementById('new-project-title').value;
    const category = document.getElementById('new-project-category').value;
    
    // Validar campos
    if (!videoUrl || !title || !category) {
        alert('Please fill in all fields');
        return;
    }
    
    // Crear nuevo elemento de proyecto
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const newProjectIndex = portfolioGrid.children.length;
    
    // Crear elemento HTML
    const newProject = document.createElement('div');
    newProject.className = 'portfolio-item';
    newProject.setAttribute('data-video', videoUrl);
    
    newProject.innerHTML = `
        <div class="portfolio-thumbnail"></div>
        <div class="portfolio-info">
            <h3>${title}</h3>
            <p>${category}</p>
        </div>
    `;
    
    // Añadir a la galería
    portfolioGrid.appendChild(newProject);
    
    // Actualizar eventos de clic para el nuevo proyecto
    newProject.addEventListener('click', function() {
        const videoUrl = this.getAttribute('data-video');
        if (videoUrl) {
            const videoId = extractVideoId(videoUrl);
            
            // Crear iframe para el video
            const modalVideoContainer = document.getElementById('modal-video-container');
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
            document.getElementById('video-modal').style.display = 'block';
            
            // Evitar scroll del body
            document.body.style.overflow = 'hidden';
        }
    });
    
    // Cargar miniatura
    const videoId = extractVideoId(videoUrl);
    const thumbnailContainer = newProject.querySelector('.portfolio-thumbnail');
    
    if (videoId) {
        // Cargar miniatura desde Vimeo
        fetch(`https://vimeo.com/api/v2/video/${videoId}.json`)
            .then(response => response.json())
            .then(data => {
                if (data && data[0] && data[0].thumbnail_large) {
                    thumbnailContainer.style.backgroundImage = `url(${data[0].thumbnail_large})`;
                    thumbnailContainer.style.backgroundSize = 'cover';
                    thumbnailContainer.style.backgroundPosition = 'center';
                }
            })
            .catch(error => {
                console.error('Error al cargar miniatura:', error);
                thumbnailContainer.style.backgroundColor = '#333';
            });
    }
    
    // Cerrar editor
    document.getElementById('cms-section-editor').style.display = 'none';
    
    // Mostrar notificación
    showNotification('New project added successfully!');
    
    // Aplicar animación al nuevo elemento
    setTimeout(() => {
        newProject.style.animation = 'fadeInUp 0.6s ease forwards';
    }, 100);
}

// Función auxiliar para extraer ID de video de Vimeo
function extractVideoId(url) {
    if (!url) return null;
    
    // Patrones para URLs de Vimeo
    const patterns = [
        /vimeo\.com\/(\d+)/,
        /vimeo\.com\/.*\/(\d+)/,
        /player\.vimeo\.com\/video\/(\d+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    return null;
}

// Funciones para mejorar el editor CMS con capacidades adicionales

// Variables globales
let currentEditingSection = null;

// Función para inicializar las mejoras del editor
function initEnhancedEditor() {
    // Añadir eventos para los botones de sección
    document.querySelectorAll('.cms-section-btn').forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            openSectionEditor(section);
        });
    });
    
    // Inicializar editor de cabecera
    initHeaderEditor();
    
    // Inicializar editor de portfolio mejorado
    initEnhancedPortfolioEditor();
}

// Función para abrir el editor de una sección específica
function openSectionEditor(sectionName) {
    currentEditingSection = sectionName;
    const editorContainer = document.getElementById('cms-section-editor');
    const editorTitle = document.getElementById('cms-editor-title');
    const editorContent = document.getElementById('cms-editor-content');
    
    if (!editorContainer || !editorTitle || !editorContent) return;
    
    // Mostrar el editor
    editorContainer.style.display = 'block';
    
    // Configurar título según la sección
    switch(sectionName) {
        case 'header':
            editorTitle.textContent = 'Edit Header Section';
            loadHeaderEditorContent(editorContent);
            break;
        case 'home':
            editorTitle.textContent = 'Edit Home Section';
            loadHomeEditorContent(editorContent);
            break;
        case 'portfolio':
            editorTitle.textContent = 'Edit Portfolio Section';
            loadPortfolioEditorContent(editorContent);
            break;
        case 'services':
            editorTitle.textContent = 'Edit Services Section';
            loadServicesEditorContent(editorContent);
            break;
        case 'contact':
            editorTitle.textContent = 'Edit Contact Section';
            loadContactEditorContent(editorContent);
            break;
        default:
            editorTitle.textContent = 'Edit Section';
            editorContent.innerHTML = '<p>Select a section to edit</p>';
    }
    
    // Configurar eventos para los botones
    document.getElementById('cms-editor-cancel').addEventListener('click', function() {
        editorContainer.style.display = 'none';
        currentEditingSection = null;
    });
    
    document.getElementById('cms-editor-save').addEventListener('click', function() {
        saveSectionChanges(sectionName);
        editorContainer.style.display = 'none';
        currentEditingSection = null;
    });
}

// Función para cargar el contenido del editor de cabecera
function loadHeaderEditorContent(container) {
    const headerQuote = document.querySelector('.header-quote p').textContent;
    const headerVideoUrl = document.getElementById('header-video').getAttribute('data-video-url') || '';
    
    container.innerHTML = `
        <div class="editor-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #ccc;">Header Quote:</label>
            <textarea id="header-quote-editor" style="width: 100%; padding: 10px; height: 80px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">${headerQuote}</textarea>
            <div class="text-formatting" style="margin-top: 10px;">
                <button class="format-btn" data-format="bold" style="padding: 5px 10px; background: #444; color: white; border: none; border-radius: 4px; margin-right: 5px; cursor: pointer;"><i class="fas fa-bold"></i></button>
                <button class="format-btn" data-format="italic" style="padding: 5px 10px; background: #444; color: white; border: none; border-radius: 4px; margin-right: 5px; cursor: pointer;"><i class="fas fa-italic"></i></button>
                <button class="format-btn" data-format="size-up" style="padding: 5px 10px; background: #444; color: white; border: none; border-radius: 4px; margin-right: 5px; cursor: pointer;"><i class="fas fa-plus"></i></button>
                <button class="format-btn" data-format="size-down" style="padding: 5px 10px; background: #444; color: white; border: none; border-radius: 4px; cursor: pointer;"><i class="fas fa-minus"></i></button>
            </div>
        </div>
        
        <div class="editor-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #ccc;">Header Video URL (Vimeo):</label>
            <input type="text" id="header-video-url-editor" value="${headerVideoUrl}" style="width: 100%; padding: 10px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
            <p style="margin-top: 5px; font-size: 12px; color: #aaa;">Enter the full Vimeo URL (e.g., https://vimeo.com/weplaystudio/hello)</p>
        </div>
    `;
    
    // Añadir eventos para los botones de formato
    container.querySelectorAll('.format-btn').forEach(button => {
        button.addEventListener('click', function() {
            const format = this.getAttribute('data-format');
            const textarea = document.getElementById('header-quote-editor');
            
            if (!textarea) return;
            
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = textarea.value.substring(start, end);
            
            let formattedText = selectedText;
            
            switch(format) {
                case 'bold':
                    formattedText = `<strong>${selectedText}</strong>`;
                    break;
                case 'italic':
                    formattedText = `<em>${selectedText}</em>`;
                    break;
                case 'size-up':
                    formattedText = `<span style="font-size: larger;">${selectedText}</span>`;
                    break;
                case 'size-down':
                    formattedText = `<span style="font-size: smaller;">${selectedText}</span>`;
                    break;
            }
            
            textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
        });
    });
}

// Función para cargar el contenido del editor de la sección home
function loadHomeEditorContent(container) {
    const introTitle = document.querySelector('.intro h2').textContent;
    const introText = document.querySelector('.intro p').textContent;
    const showreelUrl = document.getElementById('main-showreel').getAttribute('data-video-url') || '';
    
    container.innerHTML = `
        <div class="editor-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #ccc;">Introduction Title:</label>
            <input type="text" id="intro-title-editor" value="${introTitle}" style="width: 100%; padding: 10px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
        </div>
        
        <div class="editor-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #ccc;">Introduction Text:</label>
            <textarea id="intro-text-editor" style="width: 100%; padding: 10px; height: 120px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">${introText}</textarea>
        </div>
        
        <div class="editor-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #ccc;">Showreel Video URL (Vimeo):</label>
            <input type="text" id="showreel-url-editor" value="${showreelUrl}" style="width: 100%; padding: 10px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
            <p style="margin-top: 5px; font-size: 12px; color: #aaa;">Enter the full Vimeo URL (e.g., https://vimeo.com/weplaystudio/reel-2016)</p>
        </div>
    `;
}

// Función para cargar el contenido del editor de portfolio
function loadPortfolioEditorContent(container) {
    const portfolioTitle = document.querySelector('#portfolio h2').textContent;
    
    container.innerHTML = `
        <div class="editor-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #ccc;">Portfolio Section Title:</label>
            <input type="text" id="portfolio-title-editor" value="${portfolioTitle}" style="width: 100%; padding: 10px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
        </div>
        
        <div class="editor-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #ccc;">Portfolio Items:</label>
            <p style="margin-bottom: 10px; font-size: 14px; color: #aaa;">Use the "Manage Projects" section to add, edit or remove portfolio items.</p>
            <button id="open-portfolio-manager" style="width: 100%; padding: 10px; background: #ff6b00; color: white; border: none; border-radius: 4px; cursor: pointer;">Open Portfolio Manager</button>
        </div>
    `;
    
    // Añadir evento para abrir el gestor de portfolio
    container.querySelector('#open-portfolio-manager').addEventListener('click', function() {
        document.getElementById('cms-section-editor').style.display = 'none';
        openPortfolioManager();
    });
}

// Función para cargar el contenido del editor de servicios
function loadServicesEditorContent(container) {
    const servicesTitle = document.querySelector('#services h2').textContent;
    const serviceItems = Array.from(document.querySelectorAll('.service-item')).map(item => {
        return {
            title: item.querySelector('h3').textContent,
            text: item.querySelector('p').textContent,
            icon: item.querySelector('.service-icon i').className
        };
    });
    
    container.innerHTML = `
        <div class="editor-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #ccc;">Services Section Title:</label>
            <input type="text" id="services-title-editor" value="${servicesTitle}" style="width: 100%; padding: 10px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
        </div>
        
        <div class="editor-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #ccc;">Services:</label>
            <div id="services-items-editor">
                ${serviceItems.map((service, index) => `
                    <div class="service-editor-item" data-index="${index}" style="margin-bottom: 15px; padding: 10px; background: #333; border-radius: 4px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span>Service ${index + 1}</span>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; margin-bottom: 5px; color: #ccc;">Title:</label>
                            <input type="text" class="service-title-input" value="${service.title}" style="width: 100%; padding: 8px; background: #444; border: 1px solid #555; color: white; border-radius: 4px;">
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; margin-bottom: 5px; color: #ccc;">Description:</label>
                            <textarea class="service-text-input" style="width: 100%; padding: 8px; height: 80px; background: #444; border: 1px solid #555; color: white; border-radius: 4px;">${service.text}</textarea>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; color: #ccc;">Icon:</label>
                            <select class="service-icon-select" style="width: 100%; padding: 8px; background: #444; border: 1px solid #555; color: white; border-radius: 4px;">
                                <option value="fas fa-film" ${service.icon.includes('film') ? 'selected' : ''}>Film</option>
                                <option value="fas fa-robot" ${service.icon.includes('robot') ? 'selected' : ''}>Robot (AI)</option>
                                <option value="fas fa-lightbulb" ${service.icon.includes('lightbulb') ? 'selected' : ''}>Lightbulb (Consulting)</option>
                                <option value="fas fa-camera" ${service.icon.includes('camera') ? 'selected' : ''}>Camera</option>
                                <option value="fas fa-paint-brush" ${service.icon.includes('paint-brush') ? 'selected' : ''}>Paint Brush</option>
                                <option value="fas fa-code" ${service.icon.includes('code') ? 'selected' : ''}>Code</option>
                            </select>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Función para cargar el contenido del editor de contacto
function loadContactEditorContent(container) {
    const contactTitle = document.querySelector('#contact h2').textContent;
    const contactEmail = document.querySelector('form').getAttribute('action').replace('https://formsubmit.co/', '');
    
    container.innerHTML = `
        <div class="editor-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #ccc;">Contact Section Title:</label>
            <input type="text" id="contact-title-editor" value="${contactTitle}" style="width: 100%; padding: 10px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
        </div>
        
        <div class="editor-field" style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #ccc;">Contact Email:</label>
            <input type="email" id="contact-email-editor" value="${contactEmail}" style="width: 100%; padding: 10px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
            <p style="margin-top: 5px; font-size: 12px; color: #aaa;">This email will receive messages from the contact form.</p>
        </div>
    `;
}

// Función para guardar los cambios de una sección
function saveSectionChanges(sectionName) {
    switch(sectionName) {
        case 'header':
            saveHeaderChanges();
            break;
        case 'home':
            saveHomeChanges();
            break;
        case 'portfolio':
            savePortfolioChanges();
            break;
        case 'services':
            saveServicesChanges();
            break;
        case 'contact':
            saveContactChanges();
            break;
    }
    
    // Mostrar notificación
    showNotification(`${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} section updated successfully!`);
}

// Función para guardar cambios de la cabecera
function saveHeaderChanges() {
    const headerQuote = document.getElementById('header-quote-editor').value;
    const headerVideoUrl = document.getElementById('header-video-url-editor').value;
    
    // Actualizar cita de cabecera
    const headerQuoteElement = document.querySelector('.header-quote p');
    if (headerQuoteElement) {
        headerQuoteElement.innerHTML = headerQuote;
    }
    
    // Actualizar video de cabecera
    if (headerVideoUrl) {
        updateHeaderVideo(headerVideoUrl);
    }
}

// Función para guardar cambios de la sección home
function saveHomeChanges() {
    const introTitle = document.getElementById('intro-title-editor').value;
    const introText = document.getElementById('intro-text-editor').value;
    const showreelUrl = document.getElementById('showreel-url-editor').value;
    
    // Actualizar título de introducción
    const introTitleElement = document.querySelector('.intro h2');
    if (introTitleElement) {
        introTitleElement.textContent = introTitle;
    }
    
    // Actualizar texto de introducción
    const introTextElement = document.querySelector('.intro p');
    if (introTextElement) {
        introTextElement.textContent = introText;
    }
    
    // Actualizar showreel
    if (showreelUrl) {
        updateMainShowreel(showreelUrl);
    }
}

// Función para guardar cambios de la sección portfolio
function savePortfolioChanges() {
    const portfolioTitle = document.getElementById('portfolio-title-editor').value;
    
    // Actualizar título de portfolio
    const portfolioTitleElement = document.querySelector('#portfolio h2');
    if (portfolioTitleElement) {
        portfolioTitleElement.textContent = portfolioTitle;
    }
}

// Función para guardar cambios de la sección servicios
function saveServicesChanges() {
    const servicesTitle = document.getElementById('services-title-editor').value;
    
    // Actualizar título de servicios
    const servicesTitleElement = document.querySelector('#services h2');
    if (servicesTitleElement) {
        servicesTitleElement.textContent = servicesTitle;
    }
    
    // Actualizar elementos de servicio
    const serviceItems = document.querySelectorAll('.service-editor-item');
    const serviceElements = document.querySelectorAll('.service-item');
    
    serviceItems.forEach((item, index) => {
        const titleInput = item.querySelector('.service-title-input');
        const textInput = item.querySelector('.service-text-input');
        const iconSelect = item.querySelector('.service-icon-select');
        
        if (serviceElements[index] && titleInput && textInput && iconSelect) {
            // Actualizar título
            const titleElement = serviceElements[index].querySelector('h3');
            if (titleElement) {
                titleElement.textContent = titleInput.value;
            }
            
            // Actualizar texto
            const textElement = serviceElements[index].querySelector('p');
            if (textElement) {
                textElement.textContent = textInput.value;
            }
            
            // Actualizar icono
            const iconElement = serviceElements[index].querySelector('.service-icon i');
            if (iconElement) {
                iconElement.className = iconSelect.value;
            }
        }
    });
}

// Función para guardar cambios de la sección contacto
function saveContactChanges() {
    const contactTitle = document.getElementById('contact-title-editor').value;
    const contactEmail = document.getElementById('contact-email-editor').value;
    
    // Actualizar título de contacto
    const contactTitleElement = document.querySelector('#contact h2');
    if (contactTitleElement) {
        contactTitleElement.textContent = contactTitle;
    }
    
    // Actualizar email de contacto
    const contactForm = document.querySelector('form');
    if (contactForm && contactEmail) {
        contactForm.setAttribute('action', `https://formsubmit.co/${contactEmail}`);
    }
}

// Función para inicializar el editor de cabecera mejorado
function initHeaderEditor() {
    // Esta función se llama al inicializar el CMS
    console.log('Header editor initialized');
}

// Función para inicializar el editor de portfolio mejorado
function initEnhancedPortfolioEditor() {
    // Añadir soporte para múltiples plataformas
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'cms-add-project') {
            openAddProjectForm();
        }
    });
}

// Función para abrir el formulario de añadir proyecto
function openAddProjectForm() {
    // Crear overlay para el formulario
    const overlay = document.createElement('div');
    overlay.id = 'add-project-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.zIndex = '10001';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    
    // Crear formulario
    const form = document.createElement('div');
    form.style.backgroundColor = '#1e1e1e';
    form.style.padding = '30px';
    form.style.borderRadius = '8px';
    form.style.width = '500px';
    form.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
    
    form.innerHTML = `
        <h2 style="color: #ff6b00; margin-bottom: 20px; text-align: center;">Add New Project</h2>
        
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 10px; color: white;">Project Type:</label>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                <label style="display: flex; align-items: center; cursor: pointer; margin-right: 15px;">
                    <input type="radio" name="project-type" value="vimeo" checked style="margin-right: 5px;">
                    <span style="color: white;">Vimeo Video</span>
                </label>
                <label style="display: flex; align-items: center; cursor: pointer; margin-right: 15px;">
                    <input type="radio" name="project-type" value="youtube" style="margin-right: 5px;">
                    <span style="color: white;">YouTube Video</span>
                </label>
                <label style="display: flex; align-items: center; cursor: pointer; margin-right: 15px;">
                    <input type="radio" name="project-type" value="instagram" style="margin-right: 5px;">
                    <span style="color: white;">Instagram Post</span>
                </label>
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="radio" name="project-type" value="image" style="margin-right: 5px;">
                    <span style="color: white;">Image</span>
                </label>
            </div>
        </div>
        
        <div id="project-url-field" style="margin-bottom: 20px;">
            <label for="project-url" style="display: block; margin-bottom: 5px; color: white;">Video URL:</label>
            <input type="text" id="project-url" placeholder="https://vimeo.com/..." style="width: 100%; padding: 10px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
            <p style="margin-top: 5px; font-size: 12px; color: #aaa;">Enter the full URL of your video</p>
        </div>
        
        <div id="project-image-field" style="margin-bottom: 20px; display: none;">
            <label for="project-image" style="display: block; margin-bottom: 5px; color: white;">Image Upload:</label>
            <input type="file" id="project-image" accept="image/*" style="width: 100%; padding: 10px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
            <p style="margin-top: 5px; font-size: 12px; color: #aaa;">Select an image file (JPG, PNG, GIF)</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <label for="project-title" style="display: block; margin-bottom: 5px; color: white;">Project Title:</label>
            <input type="text" id="project-title" placeholder="Enter project title" style="width: 100%; padding: 10px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
        </div>
        
        <div style="margin-bottom: 20px;">
            <label for="project-category" style="display: block; margin-bottom: 5px; color: white;">Project Category:</label>
            <input type="text" id="project-category" placeholder="Animation, 3D, etc." style="width: 100%; padding: 10px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-top: 30px;">
            <button id="cancel-add-project" style="padding: 10px 20px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
            <button id="save-new-project" style="padding: 10px 20px; background: #ff6b00; color: white; border: none; border-radius: 4px; cursor: pointer;">Add Project</button>
        </div>
    `;
    
    overlay.appendChild(form);
    document.body.appendChild(overlay);
    
    // Manejar cambio de tipo de proyecto
    const projectTypeRadios = document.querySelectorAll('input[name="project-type"]');
    const projectUrlField = document.getElementById('project-url-field');
    const projectImageField = document.getElementById('project-image-field');
    
    projectTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'image') {
                projectUrlField.style.display = 'none';
                projectImageField.style.display = 'block';
            } else {
                projectUrlField.style.display = 'block';
                projectImageField.style.display = 'none';
                
                // Actualizar placeholder según el tipo
                const urlInput = document.getElementById('project-url');
                if (urlInput) {
                    switch(this.value) {
                        case 'vimeo':
                            urlInput.placeholder = 'https://vimeo.com/...';
                            break;
                        case 'youtube':
                            urlInput.placeholder = 'https://youtube.com/watch?v=...';
                            break;
                        case 'instagram':
                            urlInput.placeholder = 'https://instagram.com/p/...';
                            break;
                    }
                }
            }
        });
    });
    
    // Manejar eventos de botones
    document.getElementById('cancel-add-project').addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    document.getElementById('save-new-project').addEventListener('click', function() {
        addNewProject();
        document.body.removeChild(overlay);
    });
}

// Función para añadir un nuevo proyecto
function addNewProject() {
    // Obtener valores del formulario
    const projectType = document.querySelector('input[name="project-type"]:checked').value;
    const projectUrl = document.getElementById('project-url').value.trim();
    const projectTitle = document.getElementById('project-title').value.trim();
    const projectCategory = document.getElementById('project-category').value.trim();
    
    // Validar datos
    if (projectType !== 'image' && !projectUrl) {
        showNotification('Please enter a valid URL for your project', 'error');
        return;
    }
    
    if (!projectTitle) {
        showNotification('Please enter a title for your project', 'error');
        return;
    }
    
    // Crear nuevo elemento de portfolio
    const portfolioContainer = document.querySelector('.portfolio-grid');
    if (!portfolioContainer) {
        showNotification('Portfolio container not found', 'error');
        return;
    }
    
    // Crear elemento según el tipo
    const newItem = document.createElement('div');
    newItem.className = 'portfolio-item';
    newItem.setAttribute('data-aos', 'fade-up');
    newItem.setAttribute('data-aos-delay', '100');
    
    if (projectType === 'image') {
        // Manejar subida de imagen
        const imageFile = document.getElementById('project-image').files[0];
        if (!imageFile) {
            showNotification('Please select an image file', 'error');
            return;
        }
        
        // Crear URL temporal para la imagen
        const imageUrl = URL.createObjectURL(imageFile);
        
        newItem.innerHTML = `
            <div class="portfolio-img">
                <img src="${imageUrl}" alt="${projectTitle}">
            </div>
            <div class="portfolio-info">
                <h3>${projectTitle}</h3>
                <p>${projectCategory}</p>
            </div>
        `;
        
        // Añadir evento para mostrar imagen en modal
        newItem.addEventListener('click', function() {
            // Implementar visualización de imagen en modal
        });
    } else {
        // Configurar para video
        let embedCode = '';
        let videoId = '';
        
        switch(projectType) {
            case 'vimeo':
                videoId = extractVimeoId(projectUrl);
                embedCode = `<iframe src="https://player.vimeo.com/video/${videoId}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
                break;
            case 'youtube':
                videoId = extractYouTubeId(projectUrl);
                embedCode = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                break;
            case 'instagram':
                // Para Instagram, usamos una imagen de vista previa y luego cargamos el post en un modal
                embedCode = `<div class="instagram-preview"><i class="fab fa-instagram"></i></div>`;
                break;
        }
        
        newItem.setAttribute('data-video', projectUrl);
        newItem.innerHTML = `
            <div class="portfolio-img">
                ${embedCode}
            </div>
            <div class="portfolio-info">
                <h3>${projectTitle}</h3>
                <p>${projectCategory}</p>
            </div>
        `;
        
        // Añadir evento para mostrar video en modal
        newItem.addEventListener('click', function() {
            openVideoModal(projectUrl);
        });
    }
    
    // Añadir al DOM
    portfolioContainer.appendChild(newItem);
    
    // Mostrar notificación
    showNotification('New project added successfully!');
    
    // Reiniciar animaciones si están disponibles
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Función para extraer ID de Vimeo
function extractVimeoId(url) {
    const regex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?))/;
    const match = url.match(regex);
    return match ? match[3] : '';
}

// Función para extraer ID de YouTube
function extractYouTubeId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
}

// Función para abrir el gestor de portfolio
function openPortfolioManager() {
    // Implementar interfaz para gestionar todos los proyectos
    console.log('Portfolio manager opened');
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar mejoras del editor cuando se cargue el CMS
    document.body.addEventListener('cms:loaded', function() {
        initEnhancedEditor();
    });
    
    // Disparar evento personalizado para indicar que las mejoras están cargadas
    const event = new CustomEvent('cms:enhanced', { detail: { version: '1.0' } });
    document.body.dispatchEvent(event);
});

// Función para cargar y gestionar enlaces sociales
function loadSocialLinks() {
    const socialLinksContainer = document.getElementById('social-links-manager');
    if (!socialLinksContainer) return;
    
    // Limpiar contenedor
    socialLinksContainer.innerHTML = '';
    
    // Obtener enlaces sociales actuales
    const socialLinks = Array.from(document.querySelectorAll('.social-links a'));
    
    // Crear interfaz para cada enlace social
    socialLinks.forEach((link, index) => {
        const linkUrl = link.getAttribute('href');
        const iconClass = link.querySelector('i').className;
        
        const linkItem = document.createElement('div');
        linkItem.className = 'social-link-item';
        linkItem.style.marginBottom = '15px';
        linkItem.style.padding = '10px';
        linkItem.style.backgroundColor = '#333';
        linkItem.style.borderRadius = '4px';
        
        linkItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span><i class="${iconClass}" style="margin-right: 10px;"></i> Social Link ${index + 1}</span>
                <button class="delete-social-link" data-index="${index}" style="background: none; border: none; color: #ff6b00; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 5px; color: #ccc;">URL:</label>
                <input type="text" class="social-link-url" value="${linkUrl}" style="width: 100%; padding: 8px; background: #444; border: 1px solid #555; color: white; border-radius: 4px;">
            </div>
            <div>
                <label style="display: block; margin-bottom: 5px; color: #ccc;">Icon:</label>
                <select class="social-link-icon" style="width: 100%; padding: 8px; background: #444; border: 1px solid #555; color: white; border-radius: 4px;">
                    <option value="fab fa-vimeo-v" ${iconClass.includes('vimeo') ? 'selected' : ''}>Vimeo</option>
                    <option value="fab fa-instagram" ${iconClass.includes('instagram') ? 'selected' : ''}>Instagram</option>
                    <option value="fab fa-youtube" ${iconClass.includes('youtube') ? 'selected' : ''}>YouTube</option>
                    <option value="fab fa-facebook-f" ${iconClass.includes('facebook') ? 'selected' : ''}>Facebook</option>
                    <option value="fab fa-twitter" ${iconClass.includes('twitter') ? 'selected' : ''}>Twitter</option>
                    <option value="fab fa-linkedin-in" ${iconClass.includes('linkedin') ? 'selected' : ''}>LinkedIn</option>
                    <option value="fab fa-behance" ${iconClass.includes('behance') ? 'selected' : ''}>Behance</option>
                    <option value="fab fa-dribbble" ${iconClass.includes('dribbble') ? 'selected' : ''}>Dribbble</option>
                    <option value="fab fa-pinterest" ${iconClass.includes('pinterest') ? 'selected' : ''}>Pinterest</option>
                </select>
            </div>
        `;
        
        socialLinksContainer.appendChild(linkItem);
    });
    
    // Añadir eventos a los botones de eliminar
    document.querySelectorAll('.delete-social-link').forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this social link?')) {
                const index = parseInt(this.getAttribute('data-index'));
                const socialLinksSection = document.querySelector('.social-links');
                const links = socialLinksSection.querySelectorAll('a');
                
                if (links[index]) {
                    links[index].remove();
                    loadSocialLinks(); // Recargar la interfaz
                }
            }
        });
    });
    
    // Añadir eventos para actualizar enlaces al cambiar valores
    document.querySelectorAll('.social-link-url, .social-link-icon').forEach((input, index) => {
        input.addEventListener('change', function() {
            updateSocialLink(Math.floor(index / 2));
        });
    });
}

// Función para actualizar un enlace social
function updateSocialLink(index) {
    const socialLinksItems = document.querySelectorAll('.social-link-item');
    if (!socialLinksItems[index]) return;
    
    const urlInput = socialLinksItems[index].querySelector('.social-link-url');
    const iconSelect = socialLinksItems[index].querySelector('.social-link-icon');
    
    if (!urlInput || !iconSelect) return;
    
    const newUrl = urlInput.value.trim();
    const newIcon = iconSelect.value;
    
    // Actualizar el enlace en el DOM
    const socialLinksSection = document.querySelector('.social-links');
    const links = socialLinksSection.querySelectorAll('a');
    
    if (links[index]) {
        links[index].setAttribute('href', newUrl);
        const iconElement = links[index].querySelector('i');
        if (iconElement) {
            iconElement.className = newIcon;
        }
    }
}

// Función para añadir un nuevo enlace social
function addSocialLink() {
    // Crear nuevo enlace
    const newLink = document.createElement('a');
    newLink.setAttribute('href', 'https://');
    newLink.setAttribute('target', '_blank');
    newLink.className = 'social-icon';
    
    const newIcon = document.createElement('i');
    newIcon.className = 'fab fa-instagram';
    newLink.appendChild(newIcon);
    
    // Añadir al DOM
    const socialLinksSection = document.querySelector('.social-links');
    if (socialLinksSection) {
        socialLinksSection.appendChild(newLink);
        
        // Recargar la interfaz
        loadSocialLinks();
        
        // Mostrar notificación
        showNotification('New social link added successfully!');
    }
}

// Añadir evento al botón de añadir enlace social
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar eventos después de que el DOM esté cargado
    document.body.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'add-social-link') {
            addSocialLink();
        }
    });
});

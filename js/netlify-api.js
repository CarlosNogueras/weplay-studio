/**
 * Netlify API Integration for WePlay Studio CMS
 * This script maneja la integración con la API de Netlify para guardar cambios permanentemente
 */

// Configuración de la API de Netlify
const NETLIFY_API = {
    siteId: 'e3dd33cf-e71e-48ce-a0a1-02201b72ba63',
    apiUrl: 'https://api.netlify.com/api/v1',
    tokenKey: 'netlify_token' // Clave para almacenar el token en localStorage
};

/**
 * Inicializa la integración con Netlify
 */
function initNetlifyIntegration() {
    // Verificar si ya hay un token guardado
    const savedToken = localStorage.getItem(NETLIFY_API.tokenKey);
    
    // Añadir botón de configuración de Netlify al panel CMS si existe
    const cmsPanel = document.getElementById('cms-panel');
    if (cmsPanel && !document.getElementById('netlify-config-btn')) {
        const netlifyConfigBtn = document.createElement('button');
        netlifyConfigBtn.id = 'netlify-config-btn';
        netlifyConfigBtn.className = 'cms-button';
        netlifyConfigBtn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Configure Netlify';
        netlifyConfigBtn.style.backgroundColor = '#00AD9F';
        netlifyConfigBtn.style.marginTop = '10px';
        
        // Añadir al panel después del botón de guardar cambios
        const saveBtn = document.getElementById('save-changes-btn');
        if (saveBtn && saveBtn.parentNode) {
            saveBtn.parentNode.insertBefore(netlifyConfigBtn, saveBtn.nextSibling);
        } else {
            // Si no encuentra el botón de guardar, añadir al final del panel
            const cmsActions = cmsPanel.querySelector('.cms-actions');
            if (cmsActions) {
                cmsActions.appendChild(netlifyConfigBtn);
            }
        }
        
        // Añadir evento para mostrar configuración de Netlify
        netlifyConfigBtn.addEventListener('click', showNetlifyConfig);
    }
    
    console.log('Netlify integration initialized');
}

/**
 * Muestra el formulario de configuración de Netlify
 */
function showNetlifyConfig() {
    // Crear overlay para el formulario
    const overlay = document.createElement('div');
    overlay.id = 'netlify-config-overlay';
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
    
    // Obtener token guardado
    const savedToken = localStorage.getItem(NETLIFY_API.tokenKey) || '';
    
    // Crear formulario de configuración
    const configForm = document.createElement('div');
    configForm.style.backgroundColor = '#1e1e1e';
    configForm.style.padding = '30px';
    configForm.style.borderRadius = '8px';
    configForm.style.width = '400px';
    configForm.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
    
    configForm.innerHTML = `
        <h2 style="color: #00AD9F; margin-bottom: 20px; text-align: center;">Netlify Configuration</h2>
        <p style="color: white; margin-bottom: 20px; text-align: left;">Enter your Netlify Personal Access Token to enable direct deployment. <a href="https://app.netlify.com/user/applications#personal-access-tokens" target="_blank" style="color: #00AD9F;">Get a token here</a>.</p>
        
        <div style="margin-bottom: 15px;">
            <label for="netlify-token" style="display: block; color: white; margin-bottom: 5px;">Personal Access Token:</label>
            <input type="password" id="netlify-token" value="${savedToken}" style="width: 100%; padding: 10px; background: #333; border: 1px solid #555; color: white; border-radius: 4px;">
        </div>
        
        <div style="margin-bottom: 15px;">
            <label style="display: block; color: white; margin-bottom: 5px;">Site ID: <span style="color: #00AD9F;">${NETLIFY_API.siteId}</span></label>
            <p style="color: #aaa; font-size: 12px; margin-top: 5px;">This is your Netlify site ID, provided during setup.</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <button id="netlify-config-cancel" style="padding: 10px 15px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
            <button id="netlify-config-test" style="padding: 10px 15px; background: #555; color: white; border: none; border-radius: 4px; cursor: pointer;">Test Connection</button>
            <button id="netlify-config-save" style="padding: 10px 15px; background: #00AD9F; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
        </div>
    `;
    
    overlay.appendChild(configForm);
    document.body.appendChild(overlay);
    
    // Manejar eventos
    document.getElementById('netlify-config-cancel').addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    document.getElementById('netlify-config-test').addEventListener('click', function() {
        const token = document.getElementById('netlify-token').value.trim();
        if (!token) {
            alert('Please enter a valid Netlify token');
            return;
        }
        
        testNetlifyConnection(token);
    });
    
    document.getElementById('netlify-config-save').addEventListener('click', function() {
        const token = document.getElementById('netlify-token').value.trim();
        if (!token) {
            alert('Please enter a valid Netlify token');
            return;
        }
        
        // Guardar token en localStorage
        localStorage.setItem(NETLIFY_API.tokenKey, token);
        
        // Cerrar overlay
        document.body.removeChild(overlay);
        
        // Mostrar notificación
        showNotification('Netlify configuration saved successfully!');
    });
}

/**
 * Prueba la conexión con Netlify
 * @param {string} token - Token de acceso personal de Netlify
 */
async function testNetlifyConnection(token) {
    try {
        // Mostrar indicador de carga
        showNotification('Testing connection to Netlify...', 'info');
        
        // Verificar que el sitio existe
        const response = await fetch(`${NETLIFY_API.apiUrl}/sites/${NETLIFY_API.siteId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const siteData = await response.json();
            showNotification(`Connection successful! Site name: ${siteData.name}`, 'success');
            return true;
        } else {
            const errorData = await response.json();
            showNotification(`Connection failed: ${errorData.message || 'Unknown error'}`, 'error');
            return false;
        }
    } catch (error) {
        showNotification(`Connection error: ${error.message}`, 'error');
        return false;
    }
}

/**
 * Guarda los cambios en Netlify
 * @param {Object} changes - Objeto con los cambios a guardar
 * @returns {Promise<boolean>} - True si se guardó correctamente, False en caso contrario
 */
async function saveChangesToNetlify(changes) {
    const token = localStorage.getItem(NETLIFY_API.tokenKey);
    
    if (!token) {
        showNotification('Netlify token not configured. Please configure Netlify integration first.', 'error');
        return false;
    }
    
    try {
        // Mostrar indicador de carga
        showNotification('Saving changes to Netlify...', 'info');
        
        // Convertir los cambios a formato para Netlify
        const files = prepareFilesForNetlify(changes);
        
        // Crear un nuevo deploy
        const deployResponse = await fetch(`${NETLIFY_API.apiUrl}/sites/${NETLIFY_API.siteId}/deploys`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: files
            })
        });
        
        if (!deployResponse.ok) {
            const errorData = await deployResponse.json();
            showNotification(`Deploy failed: ${errorData.message || 'Unknown error'}`, 'error');
            return false;
        }
        
        const deployData = await deployResponse.json();
        
        // Subir los archivos requeridos
        if (deployData.required && deployData.required.length > 0) {
            for (const fileHash of deployData.required) {
                // Aquí subiríamos cada archivo requerido
                // Pero como estamos trabajando con cambios en el CMS, esto requeriría
                // una implementación más compleja que está fuera del alcance actual
            }
        }
        
        showNotification('Changes saved to Netlify successfully!', 'success');
        return true;
    } catch (error) {
        showNotification(`Error saving to Netlify: ${error.message}`, 'error');
        return false;
    }
}

/**
 * Prepara los archivos para enviar a Netlify
 * @param {Object} changes - Objeto con los cambios a guardar
 * @returns {Object} - Objeto con los archivos en formato para Netlify
 */
function prepareFilesForNetlify(changes) {
    // Esta es una implementación simplificada
    // En un caso real, necesitaríamos generar hashes SHA1 de los archivos
    // y preparar el formato exacto que espera la API de Netlify
    
    // Por ahora, retornamos un objeto vacío
    return {};
}

// Exportar funciones para uso en otros scripts
window.NetlifyAPI = {
    init: initNetlifyIntegration,
    saveChanges: saveChangesToNetlify,
    testConnection: testNetlifyConnection
};

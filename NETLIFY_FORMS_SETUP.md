# Guía Rápida: Activar Netlify Forms

## El problema
Actualmente el formulario de contacto solo muestra un `alert()` pero no envía correos.

## La solución: Netlify Forms (Gratuito, 100 envíos/mes)

### Paso 1: Actualizar el formulario en index.html

Busca la línea que dice:
```html
<form id="contact-form" class="contact-form">
```

Y reemplázala con:
```html
<form 
    id="contact-form" 
    name="contact" 
    method="POST" 
    data-netlify="true" 
    netlify-honeypot="bot-field"
    class="contact-form">
    
    <!-- Campos ocultos OBLIGATORIOS para Netlify -->
    <input type="hidden" name="form-name" value="contact" />
    <p style="display: none;">
        <label>Don't fill this: <input name="bot-field" /></label>
    </p>
    
    <!-- Resto de los campos del formulario aquí -->
```

### Paso 2: Actualizar main.js para manejar el envío

Busca la función `contactForm.addEventListener('submit'` y reemplázala con:

```javascript
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const submitBtn = contactForm.querySelector('button[type="submit"]')
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
      console.error(error)
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = 'Send Message'
    }
  })
}
```

### Paso 3: Re-deploy en Netlify

```bash
git add .
git commit -m "Activar Netlify Forms"
git push
```

### Paso 4: Configurar notificaciones por email en Netlify

1. Ve a tu sitio en Netlify Dashboard
2. Click en "Forms" en el menú lateral
3. Click en "Settings & usage"
4. En "Form notifications" → "Add notification"
5. Selecciona "Email notification"
6. Ingresa `karlosnogueras@gmail.com`
7. Guarda

## ¿Cómo funciona?

Netlify detecta automáticamente formularios con `data-netlify="true"` cuando haces el deploy. Los envíos se guardan en el panel de Netlify y  te llegan por email.

## Verificación

Después del deploy:
1. Ve a tu sitio → Forms en Netlify
2. Deberías ver el formulario "contact" listado
3. Envía un mensaje de prueba desde tu web
4. Debería aparecer en "Form submissions" y llegar a tu email

---

**Nota importante**: El formulario SOLO funcionará después de hacer un nuevo deploy en Netlify. No funcionará localmente (`npm run dev`).

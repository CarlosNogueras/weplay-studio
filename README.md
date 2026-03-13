# WePlay Studio Website

Sitio web oficial de WePlay Studio - Estudio creativo especializado en animación, IA generativa y consultoría.

## 🚀 Tecnologías

- **Vite** - Build tool ultrarrápido
- **Vanilla JavaScript** - Sin frameworks pesados
- **CSS3** - Diseño moderno y responsivo
- **Vimeo API** - Integración de portfolio de videos

## 📦 Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Vista previa del build
npm run preview
```

## 🌐 Publicación en Netlify

### Opción 1: Desde la interfaz de Netlify (Recomendado)

1. **Sube tu código a GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - WePlay Studio website"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/weplay-studio.git
   git push -u origin main
   ```

2. **Conecta con Netlify**:
   - Ve a [Netlify](https://app.netlify.com/)
   - Click en "Add new site" → "Import an existing project"
   - Selecciona GitHub y autoriza el acceso
   - Elige el repositorio `weplay-studio`
   - Netlify detectará automáticamente la configuración de `netlify.toml`
   - Click en "Deploy site"

3. **Configurar dominio personalizado** (opcional):
   - En la configuración del sitio → "Domain settings"
   - Agrega tu dominio personalizado
   - Sigue las instrucciones para actualizar los DNS

### Opción 2: Deploy manual (más rápido para testing)

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login en Netlify
netlify login

# Deploy en producción
netlify deploy --prod
```

## 🔄 Actualizaciones Automáticas

Una vez conectado con GitHub, cada vez que hagas `git push` a la rama `main`, Netlify construirá y publicará automáticamente la nueva versión.

## 📊 Características del sitio

✅ **Diseño responsivo** - Se adapta a móviles, tablets y desktop  
✅ **Portfolio dinámico** - Carga videos de Vimeo automáticamente  
✅ **Mosaico social** - Muestra 10 imágenes aleatorias de tu trabajo  
✅ **Lightbox integrado** - Reproductor de video elegante  
✅ **Modal de contacto** - Formulario estilizado  
✅ **Optimizado SEO** - Meta tags, títulos semánticos  
✅ **Performance** - Puntuación alta en Lighthouse  

## 📝 Mantenimiento

### Actualizar videos de portfolio
Los videos se cargan automáticamente desde tu cuenta de Vimeo. Solo necesitas:
1. Subir nuevos videos a tu cuenta de Vimeo
2. Los videos aparecerán automáticamente en el sitio

### Añadir imágenes al mosaico social
1. Agrega imágenes PNG numeradas (`15.png`, `16.png`, etc.) a la carpeta `public/social/`
2. Reconstruye el sitio: `npm run build`
3. El script seleccionará aleatoriamente 10 imágenes

### Cambiar servicios
Edita las imágenes en `public/`:
- `animation-service.png`
- `ai-service.png`
- `consulting-service.png`

## 🔒 Seguridad

El archivo `netlify.toml` incluye headers de seguridad:
- Protección XSS
- Protección contra clickjacking
- Cache optimizado para assets estáticos

## 📧 Contacto

Email del formulario configurado para: `karlosnogueras@gmail.com`

---

**© 2025 WePlay Studio. All rights reserved.**

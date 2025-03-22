# WePlay Studio Portfolio - Documentación

## Descripción General

Este proyecto es un portfolio profesional para WePlay Studio, enfocado en mostrar trabajos de animación, IA generativa y servicios de consultoría. La web es una single-page con scroll vertical que destaca proyectos visuales de manera moderna y atractiva.

## Características Principales

- **Diseño Single-Page**: Navegación fluida con scroll vertical
- **Diseño Responsivo**: Adaptable a todos los dispositivos
- **Integración de Videos**: Soporte para Vimeo, YouTube e Instagram
- **Sistema CMS Personalizado**: Editor visual con autenticación segura
- **Persistencia de Datos**: Integración con Netlify para guardar cambios permanentemente
- **Animaciones Avanzadas**: Transiciones suaves y efectos visuales bidireccionales
- **Formulario de Contacto**: Envío de mensajes a través de FormSubmit
- **SEO Optimizado**: Para búsquedas relacionadas con animación y producción digital

## Estructura del Proyecto

```
portfolio-weplay/
├── css/
│   └── styles.css
├── img/
│   ├── favicon/
│   └── logos/
├── js/
│   ├── animations-enhanced.js
│   ├── cms.js
│   ├── cms-enhanced.js
│   ├── main.js
│   ├── netlify-api.js
│   └── social-links.js
├── index.html
├── deploy-github.sh
├── deploy-netlify.sh
├── deploy-vercel.sh
├── optimize.sh
└── README.md
```

## Guía de Uso

### Visualización del Sitio

1. Descomprime el archivo ZIP
2. Abre el archivo `index.html` en tu navegador para ver el sitio localmente
3. Navega por las diferentes secciones haciendo scroll

### Sistema CMS

El sitio incluye un sistema CMS personalizado para editar el contenido:

#### Acceso al CMS

Hay dos formas de activar el panel de administración:
1. **Secuencia de Teclado**: Escribe "oleoleole123" en cualquier parte del sitio
2. **Clic Oculto**: Haz clic 5 veces en la esquina inferior derecha de la pantalla

Después de activar el panel, se te pedirá la contraseña: `weplay2025`

#### Funcionalidades del CMS

El panel de administración permite:

1. **Editar Secciones**: Cada sección del sitio puede editarse individualmente
   - Header: Editar video de cabecera y texto superpuesto
   - Home: Editar título, texto de introducción y showreel
   - Portfolio: Gestionar proyectos existentes y añadir nuevos
   - Servicios: Editar servicios ofrecidos
   - Contacto: Modificar email de contacto

2. **Gestión de Proyectos**: Añadir, editar o eliminar proyectos del portfolio
   - Soporte para múltiples plataformas: Vimeo, YouTube, Instagram e imágenes
   - Edición de títulos y categorías
   - Organización visual de elementos

3. **Redes Sociales**: Gestionar enlaces a redes sociales
   - Añadir nuevos enlaces
   - Editar URLs existentes
   - Seleccionar iconos de una biblioteca predefinida

4. **Personalización Visual**: Modificar colores y estilos
   - Color de fondo
   - Color de acento (naranja)

5. **Persistencia de Datos**: Guardar cambios permanentemente
   - Integración con Netlify (requiere token de acceso)
   - Respaldo mediante descarga de archivo JSON

### Integración con Netlify

El sitio incluye integración con la API de Netlify para guardar cambios permanentemente:

1. **Configuración**:
   - En el panel CMS, ve a la sección "Netlify Integration"
   - Introduce tu token de acceso de Netlify
   - Haz clic en "Test Connection" para verificar la conexión

2. **Uso**:
   - Realiza los cambios deseados en el sitio
   - Haz clic en "Save Permanently" en el panel CMS
   - Los cambios se guardarán directamente en Netlify

3. **Site ID de Netlify**:
   - El sitio está configurado para usar el ID: `e3dd33cf-e71e-48ce-a0a1-02201b72ba63`

### Animaciones y Transiciones

El sitio incluye animaciones avanzadas que mejoran la experiencia de usuario:

1. **Transiciones Suaves**: Duración extendida (1.2 segundos) para efectos más fluidos
2. **Animaciones Bidireccionales**: Funcionan tanto al entrar como al salir del viewport
3. **Efectos de Aparición**: Los elementos aparecen con efectos de desplazamiento y opacidad
4. **Interacciones Mejoradas**: Efectos hover en elementos del portfolio y servicios

## Opciones de Despliegue

El proyecto incluye scripts para facilitar el despliegue en diferentes plataformas:

### GitHub Pages

1. Crea un repositorio en GitHub
2. Ejecuta el script `deploy-github.sh` (requiere Git instalado)
3. Sigue las instrucciones para configurar GitHub Pages

### Netlify

1. Crea una cuenta en Netlify
2. Ejecuta el script `deploy-netlify.sh`
3. Sube la carpeta del proyecto a Netlify

### Vercel

1. Crea una cuenta en Vercel
2. Ejecuta el script `deploy-vercel.sh`
3. Sigue las instrucciones para completar el despliegue

## Optimización

Para optimizar los recursos antes del despliegue:

1. Ejecuta el script `optimize.sh` (requiere herramientas de optimización instaladas)
2. Este script comprimirá imágenes y minificará archivos CSS/JS

## Personalización Adicional

### Modificación de Estilos

Los estilos principales se encuentran en `css/styles.css`. Para realizar cambios:

1. Edita este archivo para modificar colores, fuentes, espaciados, etc.
2. Utiliza el sistema CMS para cambios básicos de color

### Añadir Nuevas Funcionalidades

Para desarrolladores que deseen extender el sitio:

1. Los archivos JavaScript están organizados por funcionalidad
2. Añade nuevos scripts en la carpeta `js/`
3. Incluye referencias a los nuevos scripts en `index.html`

## Solución de Problemas

### Problemas con el CMS

Si el CMS no funciona correctamente:
- Verifica que todos los archivos JavaScript estén correctamente cargados
- Comprueba la consola del navegador para ver posibles errores
- Asegúrate de que localStorage esté habilitado en tu navegador

### Problemas con la Integración de Netlify

Si la integración con Netlify falla:
- Verifica que el token de acceso sea válido
- Comprueba que el Site ID sea correcto
- Revisa los permisos del token (debe tener permisos de escritura)

### Problemas con las Animaciones

Si las animaciones no funcionan correctamente:
- Asegúrate de que JavaScript esté habilitado
- Verifica que no haya conflictos con otros scripts
- Prueba en diferentes navegadores

## Contacto y Soporte

Para cualquier consulta o soporte relacionado con este proyecto, contacta a:
- Email: karlosnogueras@gmail.com

---

© 2025 WePlay Studio. Todos los derechos reservados.

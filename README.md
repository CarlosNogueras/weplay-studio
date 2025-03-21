# Documentación del Portfolio Web de WePlay Studio

## Información General

Este documento proporciona instrucciones detalladas sobre cómo mantener, actualizar y desplegar el portfolio web de WePlay Studio.

## Estructura del Proyecto

```
portfolio-weplay/
├── css/
│   ├── styles.css
│   └── styles.min.css (generado)
├── js/
│   ├── main.js
│   ├── main.min.js (generado)
│   ├── cms.js
│   └── cms.min.js (generado)
├── img/
│   └── favicon/
│       └── favicon.png
├── assets/
├── index.html
├── optimize.sh
└── README.md
```

## Características Principales

1. **Diseño Single-page con Scroll Vertical**: Navegación fluida entre secciones.
2. **Integración de Videos de Vimeo**: Video de cabecera en loop, showreel destacado y galería de proyectos.
3. **Diseño Responsive**: Adaptable a todos los dispositivos.
4. **Sistema CMS Integrado**: Permite editar contenido sin conocimientos técnicos.
5. **Formulario de Contacto**: Envía mensajes directamente a karlosnogueras@gmail.com.

## Instrucciones de Uso

### Visualización del Sitio

El sitio web es una single-page con scroll vertical. La navegación se realiza a través de los iconos en la parte superior, que llevan a las diferentes secciones:

- **Inicio**: Información general y showreel.
- **Portfolio**: Galería de proyectos con videos de Vimeo.
- **Servicios**: Descripción de los servicios ofrecidos.
- **Contacto**: Formulario para enviar mensajes.

### Sistema CMS

El sitio incluye un sistema CMS que permite editar el contenido sin necesidad de modificar el código. Para acceder:

1. Presiona la secuencia de teclas "oleoleole123" en cualquier parte del sitio.
2. Introduce la contraseña "weplay2025" cuando se solicite.
3. Se abrirá un panel lateral con opciones para:
   - Editar textos
   - Cambiar fuentes
   - Modificar colores
   - Insertar videos desde Vimeo/YouTube/Instagram
   - Subir imágenes locales

## Instrucciones de Despliegue

### Opción 1: GitHub Pages

1. Crea un repositorio en GitHub.
2. Sube todos los archivos del proyecto al repositorio.
3. Ve a Settings > Pages.
4. Selecciona la rama main como fuente y guarda.
5. El sitio estará disponible en https://[tu-usuario].github.io/[nombre-repositorio].

### Opción 2: Netlify

1. Crea una cuenta en [Netlify](https://www.netlify.com/).
2. Haz clic en "New site from Git".
3. Conecta con tu repositorio de GitHub.
4. Selecciona el repositorio del portfolio.
5. Haz clic en "Deploy site".
6. El sitio estará disponible en una URL proporcionada por Netlify.

### Opción 3: Vercel

1. Crea una cuenta en [Vercel](https://vercel.com/).
2. Haz clic en "Import Project".
3. Conecta con tu repositorio de GitHub.
4. Selecciona el repositorio del portfolio.
5. Haz clic en "Deploy".
6. El sitio estará disponible en una URL proporcionada por Vercel.

## Optimización de Recursos

Antes de desplegar, ejecuta el script de optimización para mejorar el rendimiento:

```bash
./optimize.sh
```

Este script:
- Comprime imágenes
- Minifica archivos CSS y JavaScript
- Actualiza referencias en el HTML

## Mantenimiento y Actualizaciones

### Actualización de Contenido

Para actualizar el contenido del sitio, utiliza el sistema CMS integrado siguiendo las instrucciones en la sección "Sistema CMS".

### Actualización de Código

Si necesitas modificar el código:

1. Edita los archivos fuente (no los minificados).
2. Ejecuta el script de optimización después de los cambios.
3. Sube los cambios al repositorio para actualizar el sitio desplegado.

### Solución de Problemas Comunes

- **Videos no cargan**: Verifica que las URLs de Vimeo sean correctas y que los videos sean públicos.
- **Formulario no envía mensajes**: Asegúrate de que el servicio de correo esté configurado correctamente.
- **CMS no se activa**: Verifica que estés introduciendo la secuencia y contraseña correctas.

## Contacto para Soporte

Para cualquier consulta o soporte técnico, contacta a:
- Email: karlosnogueras@gmail.com

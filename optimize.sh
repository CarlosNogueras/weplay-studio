# Optimización de Imágenes y Recursos

# Compresión de imágenes
find . -type f -name "*.jpg" -o -name "*.png" -o -name "*.gif" | xargs -I{} optipng -o5 {}
find . -type f -name "*.jpg" -o -name "*.jpeg" | xargs -I{} jpegoptim --max=85 {}

# Minificación de CSS
npm install -g clean-css-cli
cleancss -o css/styles.min.css css/styles.css

# Minificación de JavaScript
npm install -g uglify-js
uglifyjs js/main.js -o js/main.min.js
uglifyjs js/cms.js -o js/cms.min.js

# Actualizar referencias en HTML
sed -i 's/styles.css/styles.min.css/g' index.html
sed -i 's/main.js/main.min.js/g' index.html
sed -i 's/cms.js/cms.min.js/g' index.html

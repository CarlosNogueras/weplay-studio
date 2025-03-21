# Configuración para Netlify

# Crear archivo netlify.toml para configuración
cat > netlify.toml << EOL
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOL

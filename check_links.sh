#!/bin/bash

echo "🔍 Verificando enlaces en el proyecto AWS Memory Game..."
echo "=================================================="

echo ""
echo "📁 Enlaces en README.md:"
grep -n "https://github.com" README.md | head -5

echo ""
echo "📄 Enlaces en package.json:"
grep -n "github.com" package.json

echo ""
echo "🌐 Enlaces en index.html:"
grep -n "github.com/dvst" index.html | head -3

echo ""
echo "⚙️ Configuración de GitHub en JavaScript:"
grep -A 3 "GITHUB_REPO" index.html

echo ""
echo "🔧 Configuración en config.js:"
echo "   GitHub:"
grep -A 2 "github:" config.js
echo "   Enlaces sociales:"
grep -A 1 "url:" config.js | grep -E "(javitech|github|dev.to|youtube|linkedin)" | head -5

echo ""
echo "🔗 Verificando consistencia entre archivos:"
GITHUB_OWNER_CONFIG=$(grep -o "owner: '[^']*'" config.js | cut -d"'" -f2)
GITHUB_REPO_CONFIG=$(grep -o "repo: '[^']*'" config.js | cut -d"'" -f2)
echo "   Config.js - Owner: $GITHUB_OWNER_CONFIG, Repo: $GITHUB_REPO_CONFIG"

GITHUB_PACKAGE=$(grep -o "dvst/[^\"]*" package.json | head -1)
echo "   Package.json - Repo: $GITHUB_PACKAGE"

echo ""
echo "✅ Verificación completada!"
echo ""
echo "📝 Enlaces que podrías necesitar actualizar:"
echo "   - Dominio del juego: Actualizar cuando tengas hosting"
echo "   - Verificar que todos los enlaces sociales funcionen"
echo ""
echo "🚀 Para probar la configuración:"
echo "   - Abre test_config.html en el navegador"
echo "   - Verifica que todos los enlaces se carguen correctamente"

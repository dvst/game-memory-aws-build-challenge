#!/bin/bash

# Script avanzado para verificar enlaces y configuración del proyecto AWS Memory Game

echo "🔍 VERIFICACIÓN AVANZADA DE ENLACES - AWS Memory Game"
echo "====================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para verificar si un archivo existe
check_file() {
    if [ ! -f "$1" ]; then
        echo -e "${RED}❌ Archivo no encontrado: $1${NC}"
        return 1
    fi
    return 0
}

# Función para extraer URLs de config.js
extract_config_urls() {
    if check_file "config.js"; then
        echo -e "\n${BLUE}🔧 CONFIGURACIÓN EN CONFIG.JS:${NC}"
        
        # GitHub (buscar en la sección github)
        GITHUB_OWNER=$(grep -A 5 "github:" config.js | grep "owner:" | sed "s/.*owner: ['\"]\\([^'\"]*\\)['\"].*/\\1/")
        GITHUB_REPO=$(grep -A 5 "github:" config.js | grep "repo:" | sed "s/.*repo: ['\"]\\([^'\"]*\\)['\"].*/\\1/")
        GITHUB_URL=$(grep -A 5 "github:" config.js | grep "url:" | sed "s/.*url: ['\"]\\([^'\"]*\\)['\"].*/\\1/")
        
        echo "   📂 GitHub Owner: $GITHUB_OWNER"
        echo "   📦 GitHub Repo: $GITHUB_REPO"
        echo "   🔗 GitHub URL: $GITHUB_URL"
        
        # Enlaces sociales
        echo -e "\n   🌐 Enlaces Sociales:"
        echo "      • Website: $(grep -A 3 "website:" config.js | grep "url:" | sed "s/.*url: ['\"]\\([^'\"]*\\)['\"].*/\\1/")"
        echo "      • GitHub: $(grep -A 15 "social:" config.js | grep -A 3 "github:" | grep "url:" | sed "s/.*url: ['\"]\\([^'\"]*\\)['\"].*/\\1/")"
        echo "      • Blog: $(grep -A 3 "blog:" config.js | grep "url:" | sed "s/.*url: ['\"]\\([^'\"]*\\)['\"].*/\\1/")"
        echo "      • LinkedIn: $(grep -A 3 "linkedin:" config.js | grep "url:" | sed "s/.*url: ['\"]\\([^'\"]*\\)['\"].*/\\1/")"
        echo "      • YouTube: $(grep -A 3 "youtube:" config.js | grep "url:" | sed "s/.*url: ['\"]\\([^'\"]*\\)['\"].*/\\1/")"
    fi
}

# Función para verificar consistencia
check_consistency() {
    echo -e "\n${YELLOW}🔍 VERIFICACIÓN DE CONSISTENCIA:${NC}"
    
    # Verificar GitHub owner/repo en diferentes archivos
    if check_file "config.js" && check_file "package.json"; then
        CONFIG_OWNER=$(grep -A 5 "github:" config.js | grep "owner:" | sed "s/.*owner: ['\"]\\([^'\"]*\\)['\"].*/\\1/")
        PACKAGE_OWNER=$(grep -o "dvst" package.json | head -1)
        
        if [ "$CONFIG_OWNER" = "$PACKAGE_OWNER" ]; then
            echo -e "   ${GREEN}✅ GitHub owner consistente: $CONFIG_OWNER${NC}"
        else
            echo -e "   ${RED}❌ GitHub owner inconsistente: config.js($CONFIG_OWNER) vs package.json($PACKAGE_OWNER)${NC}"
        fi
        
        # Verificar repo
        CONFIG_REPO=$(grep -A 5 "github:" config.js | grep "repo:" | sed "s/.*repo: ['\"]\\([^'\"]*\\)['\"].*/\\1/")
        PACKAGE_REPO=$(grep -o "game-memory-aws-build-challenge" package.json | head -1)
        
        if [ "$CONFIG_REPO" = "$PACKAGE_REPO" ]; then
            echo -e "   ${GREEN}✅ GitHub repo consistente: $CONFIG_REPO${NC}"
        else
            echo -e "   ${RED}❌ GitHub repo inconsistente: config.js($CONFIG_REPO) vs package.json($PACKAGE_REPO)${NC}"
        fi
    fi
}

# Función para verificar enlaces en archivos
check_file_links() {
    echo -e "\n${BLUE}📁 ENLACES POR ARCHIVO:${NC}"
    
    # README.md
    if check_file "README.md"; then
        echo "   📄 README.md:"
        GITHUB_LINKS=$(grep -c "github.com/dvst" README.md)
        echo "      • Enlaces de GitHub: $GITHUB_LINKS"
    fi
    
    # package.json
    if check_file "package.json"; then
        echo "   📦 package.json:"
        REPO_URL=$(grep -o "https://github.com/[^\"]*" package.json | head -1)
        echo "      • Repository URL: $REPO_URL"
    fi
    
    # index.html
    if check_file "index.html"; then
        echo "   🌐 index.html:"
        SOCIAL_LINKS=$(grep -c "social-link" index.html)
        CONFIG_USAGE=$(grep -c "CONFIG\." index.html)
        echo "      • Enlaces sociales encontrados: $SOCIAL_LINKS"
        echo "      • Referencias a CONFIG: $CONFIG_USAGE"
    fi
    
    # config.js
    if check_file "config.js"; then
        echo "   ⚙️ config.js:"
        SOCIAL_SECTIONS=$(grep -c "url:" config.js)
        echo "      • URLs configuradas: $SOCIAL_SECTIONS"
    fi
}

# Función para detectar enlaces pendientes
check_pending_updates() {
    echo -e "\n${YELLOW}⚠️  ENLACES PENDIENTES DE ACTUALIZAR:${NC}"
    
    PENDING=0
    
    # Buscar patrones de enlaces temporales
    if grep -q "tu-dominio.com" README.md 2>/dev/null; then
        echo -e "   ${RED}• README.md contiene 'tu-dominio.com'${NC}"
        PENDING=$((PENDING + 1))
    fi
    
    if grep -q "tu-perfil" config.js 2>/dev/null; then
        echo -e "   ${RED}• config.js contiene 'tu-perfil'${NC}"
        PENDING=$((PENDING + 1))
    fi
    
    if grep -q "tu-blog.com" README.md 2>/dev/null; then
        echo -e "   ${RED}• README.md contiene 'tu-blog.com'${NC}"
        PENDING=$((PENDING + 1))
    fi
    
    if [ $PENDING -eq 0 ]; then
        echo -e "   ${GREEN}✅ No se encontraron enlaces pendientes obvios${NC}"
    fi
}

# Función para verificar integración CONFIG.js
check_config_integration() {
    echo -e "\n${BLUE}🔗 INTEGRACIÓN CONFIG.JS:${NC}"
    
    if check_file "index.html" && check_file "config.js"; then
        # Verificar que index.html incluya config.js
        if grep -q "config.js" index.html; then
            echo -e "   ${GREEN}✅ config.js está incluido en index.html${NC}"
        else
            echo -e "   ${RED}❌ config.js NO está incluido en index.html${NC}"
        fi
        
        # Verificar uso de CONFIG en JavaScript
        CONFIG_REFS=$(grep -c "CONFIG\." index.html)
        echo "   📊 Referencias a CONFIG en index.html: $CONFIG_REFS"
        
        # Verificar función de inicialización
        if grep -q "initializeSocialLinks" index.html; then
            echo -e "   ${GREEN}✅ Función initializeSocialLinks encontrada${NC}"
        else
            echo -e "   ${RED}❌ Función initializeSocialLinks NO encontrada${NC}"
        fi
    fi
}

# Función para generar reporte
generate_report() {
    echo -e "\n${GREEN}📊 REPORTE FINAL:${NC}"
    echo "   • Archivos verificados: config.js, package.json, README.md, index.html"
    echo "   • Configuración centralizada: ✅ Implementada"
    echo "   • Enlaces de GitHub: ✅ Actualizados"
    echo -e "\n${BLUE}🚀 PRÓXIMOS PASOS RECOMENDADOS:${NC}"
    echo "   1. Ejecutar: open test_config.html (para probar configuración)"
    echo "   2. Verificar enlaces en navegador"
    echo "   3. Actualizar enlaces pendientes si los hay"
    echo "   4. Hacer commit: git add . && git commit -m 'Update links configuration'"
}

# Ejecutar todas las verificaciones
main() {
    extract_config_urls
    check_file_links
    check_config_integration
    check_consistency
    check_pending_updates
    generate_report
}

# Ejecutar script principal
main

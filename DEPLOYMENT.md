# 🚀 Guía de Despliegue - AWS Memory Game

Esta guía te ayudará a configurar el despliegue automático del juego en AWS S3 usando GitHub Actions.

## 📋 Prerrequisitos

- ✅ Cuenta de AWS activa
- ✅ AWS CLI instalado y configurado
- ✅ Repositorio en GitHub
- ✅ Permisos de administrador en el repositorio

## 🏗️ Paso 1: Configurar AWS

### 1.1 Crear y configurar bucket S3

```bash
# Ejecutar script de configuración de S3
./aws-setup.sh
```

Este script:
- Crea el bucket `aws-memory-game-javitech`
- Habilita hosting web estático
- Configura política de acceso público
- Desbloquea acceso público

### 1.2 Crear usuario IAM para GitHub Actions

```bash
# Ejecutar script de configuración IAM
./iam-setup.sh
```

Este script:
- Crea usuario `github-actions-aws-memory-game`
- Crea política con permisos mínimos necesarios
- Genera access keys para GitHub Actions

**⚠️ IMPORTANTE**: Guarda las credenciales de forma segura y elimina el archivo `access-keys.json` después de usarlas.

## 🔐 Paso 2: Configurar Secrets en GitHub

Ve a tu repositorio en GitHub:

1. **Settings** → **Secrets and variables** → **Actions**
2. Crea estos **Repository secrets**:

| Secret Name | Value | Descripción |
|-------------|-------|-------------|
| `AWS_ACCESS_KEY_ID` | Tu Access Key ID | Credencial de AWS |
| `AWS_SECRET_ACCESS_KEY` | Tu Secret Access Key | Credencial de AWS |
| `CLOUDFRONT_DISTRIBUTION_ID` | (Opcional) | ID de distribución CloudFront |

### 📸 Cómo configurar secrets:

```
GitHub Repo → Settings → Secrets and variables → Actions → New repository secret
```

## 🚀 Paso 3: Activar GitHub Actions

El workflow se ejecutará automáticamente cuando:
- Hagas push a la rama `main` o `master`
- Crees un Pull Request

### 🔄 Workflow incluye:

1. **Test Job**:
   - ✅ Valida estructura HTML
   - ✅ Verifica config.js
   - ✅ Ejecuta verificador de enlaces
   - ✅ Genera estadísticas del proyecto

2. **Deploy Job**:
   - 🧹 Limpia archivos de desarrollo
   - 🚀 Sube archivos a S3
   - 🌐 Configura cache headers
   - ✅ Notifica resultado

## 🌍 URLs del Juego

Después del despliegue exitoso:

- **URL Principal**: http://aws-memory-game-javitech.s3-website-us-east-1.amazonaws.com
- **Status**: Se mostrará en los logs de GitHub Actions

## 🔧 Configuración Avanzada (Opcional)

### CloudFront CDN

Para mejor rendimiento y HTTPS:

1. Crear distribución CloudFront
2. Configurar origen S3
3. Agregar `CLOUDFRONT_DISTRIBUTION_ID` a secrets

### Dominio Personalizado

1. Registrar dominio en Route 53
2. Crear certificado SSL en ACM
3. Configurar alias en CloudFront

## 🐛 Troubleshooting

### Error: "Access Denied"
- Verificar permisos IAM
- Comprobar política del bucket S3

### Error: "Bucket not found"
- Verificar nombre del bucket
- Comprobar región AWS

### Error: "Invalid credentials"
- Verificar secrets en GitHub
- Regenerar access keys si es necesario

## 📊 Monitoreo

### Logs de GitHub Actions
- Ve a **Actions** tab en tu repositorio
- Revisa logs detallados de cada job

### AWS CloudWatch
- Monitorea requests a S3
- Configura alertas si es necesario

## 🔄 Actualizaciones

Para actualizar el juego:
1. Haz cambios en tu código
2. Commit y push a `main`
3. GitHub Actions desplegará automáticamente

## 📝 Comandos Útiles

```bash
# Verificar estado del bucket
aws s3 ls s3://aws-memory-game-javitech

# Ver logs de despliegue
aws s3 website s3://aws-memory-game-javitech

# Limpiar bucket (si es necesario)
aws s3 rm s3://aws-memory-game-javitech --recursive
```

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs de GitHub Actions
2. Verifica la configuración de AWS
3. Ejecuta `./check_links_advanced.sh` para diagnósticos

---

✅ **¡Tu juego estará disponible 24/7 en AWS S3!** 🎮

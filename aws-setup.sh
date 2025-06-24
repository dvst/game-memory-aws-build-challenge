#!/bin/bash

# Script para configurar AWS S3 bucket para hosting web
BUCKET_NAME="aws-memory-game-javitech"
REGION="us-east-1"

echo "🚀 Configurando bucket S3 para AWS Memory Game..."

# 1. Crear bucket
echo "📦 Creando bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $REGION

# 2. Habilitar hosting web estático
echo "🌐 Habilitando hosting web estático..."
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# 3. Configurar política de bucket para acceso público
echo "🔓 Configurando política de acceso público..."
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

# 4. Aplicar política al bucket
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

# 5. Desbloquear acceso público
aws s3api delete-public-access-block --bucket $BUCKET_NAME

echo "✅ Bucket configurado exitosamente!"
echo "🌍 URL del sitio web: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Crear usuario IAM para GitHub Actions"
echo "   2. Configurar secrets en GitHub"
echo "   3. Ejecutar el workflow"

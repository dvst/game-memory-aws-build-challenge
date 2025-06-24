#!/bin/bash

# Script para crear usuario IAM para GitHub Actions
USER_NAME="github-actions-aws-memory-game"
POLICY_NAME="S3DeploymentPolicy"
BUCKET_NAME="aws-memory-game-javitech"

echo "👤 Creando usuario IAM para GitHub Actions..."

# 1. Crear usuario IAM
echo "📝 Creando usuario: $USER_NAME"
aws iam create-user --user-name $USER_NAME

# 2. Crear política personalizada para S3 (solo permisos necesarios)
echo "🔐 Creando política de permisos mínimos..."
cat > s3-deployment-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::$BUCKET_NAME"
        }
    ]
}
EOF

# 3. Crear la política
aws iam create-policy --policy-name $POLICY_NAME --policy-document file://s3-deployment-policy.json

# 4. Obtener ARN de la política
POLICY_ARN=$(aws iam list-policies --query "Policies[?PolicyName=='$POLICY_NAME'].Arn" --output text)

# 5. Adjuntar política al usuario
echo "🔗 Adjuntando política al usuario..."
aws iam attach-user-policy --user-name $USER_NAME --policy-arn $POLICY_ARN

# 6. Crear access keys
echo "🔑 Creando access keys..."
aws iam create-access-key --user-name $USER_NAME > access-keys.json

echo "✅ Usuario IAM creado exitosamente!"
echo ""
echo "🔑 IMPORTANTE: Guarda estas credenciales de forma segura:"
cat access-keys.json | jq '.AccessKey | {AccessKeyId, SecretAccessKey}'
echo ""
echo "🔐 Permisos otorgados (principio de menor privilegio):"
echo "   • s3:PutObject - Subir archivos al bucket"
echo "   • s3:PutObjectAcl - Configurar permisos de archivos"
echo "   • s3:GetObject - Leer archivos del bucket"
echo "   • s3:DeleteObject - Eliminar archivos obsoletos"
echo "   • s3:ListBucket - Listar contenido del bucket específico"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Copia el AccessKeyId y SecretAccessKey"
echo "   2. Configúralos como secrets en GitHub"
echo "   3. Elimina el archivo access-keys.json por seguridad"

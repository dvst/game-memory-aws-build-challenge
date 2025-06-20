# AWS Memory Game 🎮

Un juego de memoria temático de Amazon Web Services (AWS) construido con Phaser.js y JavaScript vanilla.

## 🎯 Objetivo del Juego

Encuentra todos los pares de servicios AWS antes de que se acabe el tiempo (30 segundos). El juego presenta dos niveles de dificultad con diferentes servicios AWS.

## 🎮 Cómo Jugar

1. **Selecciona un nivel de dificultad:**
   - **Fácil**: Servicios AWS básicos (S3, Lambda, EC2, RDS)
   - **Difícil**: Servicios AWS avanzados (EKS, SageMaker, Kinesis, Redshift)

2. **Encuentra los pares:**
   - Haz clic en las cartas para voltearlas
   - Memoriza la ubicación de cada servicio
   - Encuentra los pares antes de que se acabe el tiempo

3. **Gana el juego:**
   - Encuentra todos los 4 pares para ganar
   - Si se acaba el tiempo, pierdes

## 🛠️ Tecnologías Utilizadas

- **Phaser.js 3.70.0**: Motor de juegos 2D
- **HTML5 Canvas**: Renderizado de gráficos
- **CSS3**: Estilos y animaciones
- **JavaScript ES6+**: Lógica del juego
- **Web Audio API**: Efectos de sonido

## 📁 Estructura del Proyecto

```
AWSGameBuild-Q-cli-2025/
├── index.html              # Archivo principal del juego
├── src/
│   ├── game.js            # Lógica principal del juego
│   └── iconGenerator.js   # Generador de iconos (opcional)
├── public/
│   └── lib/
│       └── phaser.min.js  # Librería Phaser.js local
└── README.md              # Este archivo
```

## 🚀 Instalación y Ejecución

1. **Clona o descarga el proyecto**
2. **Abre `index.html` en tu navegador web**
   - No requiere servidor web
   - Funciona completamente offline
   - Compatible con navegadores modernos

## 🎨 Características

- ✅ **Completamente offline**: No requiere conexión a internet
- ✅ **Responsive**: Se adapta a diferentes tamaños de pantalla
- ✅ **Pixel Art Style**: Estilo retro inspirado en juegos clásicos
- ✅ **Efectos de sonido**: Sonidos generados programáticamente
- ✅ **Dos niveles de dificultad**: Servicios básicos y avanzados de AWS
- ✅ **Interfaz intuitiva**: Fácil de usar y navegar
- ✅ **Animaciones suaves**: Transiciones y efectos visuales

## 🎵 Controles

- **Clic izquierdo**: Voltear carta
- **ESC**: Volver al menú principal
- **F5**: Reiniciar juego (cuando termina)

## 📱 Compatibilidad

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Dispositivos móviles (iOS/Android)

## 🔧 Personalización

Para agregar nuevos servicios AWS o modificar el juego:

1. **Edita el objeto `awsServices` en `src/game.js`**
2. **Agrega nuevos iconos en la función `drawServiceIcon()`**
3. **Modifica los colores y estilos en `index.html`**

## 📚 Servicios AWS Incluidos

### Nivel Fácil
- **S3**: Simple Storage Service
- **Lambda**: Serverless Functions
- **EC2**: Virtual Servers
- **RDS**: Managed Database

### Nivel Difícil
- **EKS**: Kubernetes Service
- **SageMaker**: Machine Learning Platform
- **Kinesis**: Data Streaming
- **Redshift**: Data Warehouse

## 🐛 Solución de Problemas

**El juego no carga:**
- Verifica que `public/lib/phaser.min.js` existe
- Abre la consola del navegador para ver errores

**No hay sonido:**
- Los navegadores requieren interacción del usuario para reproducir audio
- Haz clic en cualquier parte de la página primero

**Problemas de rendimiento:**
- Cierra otras pestañas del navegador
- Actualiza la página

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Puedes:
- Agregar nuevos servicios AWS
- Mejorar los gráficos
- Optimizar el rendimiento
- Corregir bugs

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

¡Diviértete aprendiendo sobre los servicios de AWS! 🎉

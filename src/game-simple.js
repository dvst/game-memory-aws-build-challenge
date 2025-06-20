// AWS Memory Game - Versión Simplificada
let game;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 4;
let timeLeft = 30;
let gameActive = false;
let currentLevel = 'easy';
let gameTimer = null;

// Servicios AWS por dificultad
const awsServices = {
    easy: [
        { name: 'S3', color: '#FF9900', description: 'Simple Storage Service' },
        { name: 'Lambda', color: '#FF9900', description: 'Serverless Functions' },
        { name: 'EC2', color: '#FF9900', description: 'Virtual Servers' },
        { name: 'RDS', color: '#FF9900', description: 'Managed Database' }
    ],
    hard: [
        { name: 'EKS', color: '#FF9900', description: 'Kubernetes Service' },
        { name: 'SageMaker', color: '#FF9900', description: 'Machine Learning' },
        { name: 'Kinesis', color: '#FF9900', description: 'Data Streaming' },
        { name: 'Redshift', color: '#FF9900', description: 'Data Warehouse' }
    ]
};

// Configuración del juego
const gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-game',
    backgroundColor: '#1a1a2e',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    pixelArt: true
};

function preload() {
    console.log('Preload iniciado');
    createCardTextures.call(this);
}

function create() {
    console.log('Create iniciado');
    
    // Título del juego
    this.add.text(400, 50, 'AWS MEMORY GAME', {
        fontSize: '32px',
        fill: '#FF9900',
        fontFamily: 'monospace'
    }).setOrigin(0.5);
    
    setupCards.call(this);
    console.log('Juego creado exitosamente');
}

function update() {
    // Lógica de actualización si es necesaria
}

function createCardTextures() {
    const graphics = this.add.graphics();
    
    // Crear textura para carta volteada (reverso)
    graphics.fillStyle(0x232F3E);
    graphics.fillRoundedRect(0, 0, 120, 160, 10);
    graphics.lineStyle(4, 0xFF9900);
    graphics.strokeRoundedRect(2, 2, 116, 156, 10);
    
    // Agregar texto AWS
    graphics.fillStyle(0xFF9900);
    const awsText = this.add.text(60, 80, 'AWS', {
        fontSize: '24px',
        fill: '#FF9900',
        fontFamily: 'monospace'
    }).setOrigin(0.5);
    
    graphics.generateTexture('card-back', 120, 160);
    awsText.destroy();
    graphics.clear();
    
    // Crear texturas para cada servicio
    const services = [...awsServices.easy, ...awsServices.hard];
    services.forEach(service => {
        // Fondo blanco de la carta
        graphics.fillStyle(0xFFFFFF);
        graphics.fillRoundedRect(0, 0, 120, 160, 10);
        
        // Borde naranja AWS
        graphics.lineStyle(4, 0xFF9900);
        graphics.strokeRoundedRect(2, 2, 116, 156, 10);
        
        // Área del servicio
        graphics.fillStyle(0xFF9900);
        graphics.fillRoundedRect(10, 10, 100, 80, 5);
        
        // Área del texto
        graphics.fillStyle(0x232F3E);
        graphics.fillRoundedRect(10, 100, 100, 50, 5);
        
        graphics.generateTexture(`card-${service.name.toLowerCase()}`, 120, 160);
        graphics.clear();
    });
    
    graphics.destroy();
}

function setupCards() {
    const services = awsServices[currentLevel];
    const cardData = [];
    
    // Crear pares de cartas
    services.forEach(service => {
        cardData.push(service, service);
    });
    
    // Mezclar cartas
    shuffleArray(cardData);
    
    // Crear cartas en la escena
    const startX = 200;
    const startY = 150;
    const cardWidth = 120;
    const cardHeight = 160;
    const spacingX = 40;
    const spacingY = 30;
    
    cards = [];
    
    for (let i = 0; i < 8; i++) {
        const row = Math.floor(i / 4);
        const col = i % 4;
        
        const x = startX + col * (cardWidth + spacingX);
        const y = startY + row * (cardHeight + spacingY);
        
        const card = this.add.sprite(x, y, 'card-back')
            .setInteractive()
            .setOrigin(0);
        
        card.cardData = cardData[i];
        card.isFlipped = false;
        card.isMatched = false;
        card.cardIndex = i;
        
        // Efectos de hover y click
        card.on('pointerdown', () => flipCard.call(this, card));
        card.on('pointerover', () => {
            if (!card.isFlipped && !card.isMatched && gameActive) {
                card.setTint(0xdddddd);
            }
        });
        card.on('pointerout', () => {
            if (!card.isFlipped && !card.isMatched) {
                card.clearTint();
            }
        });
        
        cards.push(card);
    }
}

function flipCard(card) {
    if (!gameActive || card.isFlipped || card.isMatched || flippedCards.length >= 2) {
        return;
    }
    
    card.isFlipped = true;
    card.setTexture(`card-${card.cardData.name.toLowerCase()}`);
    card.clearTint();
    flippedCards.push(card);
    
    // Agregar texto del servicio
    const text = this.add.text(card.x + 60, card.y + 130, card.cardData.name, {
        fontSize: '14px',
        fill: '#FFFFFF',
        fontFamily: 'monospace',
        fontWeight: 'bold'
    }).setOrigin(0.5);
    
    card.serviceText = text;
    
    if (flippedCards.length === 2) {
        this.time.delayedCall(1000, () => checkMatch.call(this));
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.cardData.name === card2.cardData.name) {
        // ¡Coincidencia!
        card1.isMatched = true;
        card2.isMatched = true;
        card1.setTint(0x90EE90);
        card2.setTint(0x90EE90);
        
        matchedPairs++;
        
        // Actualizar UI
        document.getElementById('pairs').textContent = matchedPairs;
        
        if (matchedPairs === totalPairs) {
            gameWon.call(this);
        }
    } else {
        // No coinciden, voltear de nuevo
        card1.isFlipped = false;
        card2.isFlipped = false;
        card1.setTexture('card-back');
        card2.setTexture('card-back');
        
        if (card1.serviceText) {
            card1.serviceText.destroy();
        }
        if (card2.serviceText) {
            card2.serviceText.destroy();
        }
    }
    
    flippedCards = [];
}

function gameWon() {
    gameActive = false;
    clearInterval(gameTimer);
    
    // Crear overlay de victoria
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
    
    this.add.text(400, 250, '¡GANASTE!', {
        fontSize: '48px',
        fill: '#90EE90',
        fontFamily: 'monospace'
    }).setOrigin(0.5);
    
    this.add.text(400, 320, `Tiempo restante: ${timeLeft}s`, {
        fontSize: '20px',
        fill: '#FFFFFF',
        fontFamily: 'monospace'
    }).setOrigin(0.5);
    
    this.add.text(400, 360, 'Presiona ESC para volver al menú', {
        fontSize: '16px',
        fill: '#FF9900',
        fontFamily: 'monospace'
    }).setOrigin(0.5);
}

function gameOver() {
    gameActive = false;
    clearInterval(gameTimer);
    
    // Crear overlay de derrota
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
    
    this.add.text(400, 250, 'TIEMPO AGOTADO', {
        fontSize: '40px',
        fill: '#FF6B6B',
        fontFamily: 'monospace'
    }).setOrigin(0.5);
    
    this.add.text(400, 320, `Pares encontrados: ${matchedPairs}/${totalPairs}`, {
        fontSize: '20px',
        fill: '#FFFFFF',
        fontFamily: 'monospace'
    }).setOrigin(0.5);
    
    this.add.text(400, 360, 'Presiona ESC para volver al menú', {
        fontSize: '16px',
        fill: '#FF9900',
        fontFamily: 'monospace'
    }).setOrigin(0.5);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer() {
    gameActive = true;
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            gameOver.call(game.scene.scenes[0]);
        }
    }, 1000);
}

// Funciones para el menú
function startGame(level) {
    console.log('Iniciando juego con nivel:', level);
    
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('ui').classList.remove('hidden');
    document.getElementById('reset-btn').classList.remove('hidden');
    
    currentLevel = level;
    timeLeft = 30;
    matchedPairs = 0;
    flippedCards = [];
    cards = [];
    
    // Actualizar UI
    document.getElementById('level').textContent = level.toUpperCase();
    document.getElementById('timer').textContent = '30';
    document.getElementById('pairs').textContent = '0';
    
    // Destruir juego anterior si existe
    if (game) {
        game.destroy(true);
    }
    
    // Crear nuevo juego
    game = new Phaser.Game(gameConfig);
    
    // Iniciar timer después de un breve delay
    setTimeout(() => {
        startTimer();
    }, 1000);
}

function resetToMenu() {
    console.log('Volviendo al menú');
    
    if (gameTimer) {
        clearInterval(gameTimer);
    }
    
    if (game) {
        game.destroy(true);
        game = null;
    }
    
    // Reset variables
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    timeLeft = 30;
    gameActive = false;
    
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('ui').classList.add('hidden');
    document.getElementById('reset-btn').classList.add('hidden');
}

// Inicializar cuando se carga la página
window.addEventListener('load', () => {
    console.log('AWS Memory Game cargado - versión simplificada');
    
    // Verificar que Phaser está disponible
    if (typeof Phaser === 'undefined') {
        console.error('Phaser no está disponible');
        return;
    }
    
    console.log('Phaser versión:', Phaser.VERSION);
    
    // Agregar listener para tecla ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            resetToMenu();
        }
    });
});

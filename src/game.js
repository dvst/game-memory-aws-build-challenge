// AWS Memory Game
class AWSMemoryGame {
    constructor() {
        this.gameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'phaser-game',
            backgroundColor: '#1a1a2e',
            scene: {
                preload: this.preload.bind(this),
                create: this.create.bind(this),
                update: this.update.bind(this)
            },
            pixelArt: true
        };
        
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.totalPairs = 4;
        this.timeLeft = 30;
        this.gameActive = false;
        this.currentLevel = 'easy';
        
        // Servicios AWS por dificultad
        this.awsServices = {
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
        
        this.game = null;
        this.gameTimer = null;
    }
    
    preload() {
        // Crear texturas programáticamente para las cartas
        this.createCardTextures();
        
        // Crear sonidos simples usando Web Audio API
        this.createSounds();
    }
    
    createSounds() {
        // Los sonidos se crearán usando Web Audio API en el navegador
        this.sounds = {
            flip: this.createBeepSound(440, 0.1),
            match: this.createBeepSound(660, 0.2),
            win: this.createBeepSound(880, 0.3),
            lose: this.createBeepSound(220, 0.5)
        };
    }
    
    createBeepSound(frequency, duration) {
        return () => {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'square';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch(e) {
                // Silenciar errores de audio
                console.log('Audio no disponible');
            }
        };
    }
    
    createCardTextures() {
        const graphics = this.add.graphics();
        
        // Crear textura para carta volteada (reverso)
        graphics.fillStyle(0x232F3E);
        graphics.fillRoundedRect(0, 0, 140, 180, 15);
        graphics.lineStyle(4, 0xFF9900);
        graphics.strokeRoundedRect(2, 2, 136, 176, 15);
        
        // Agregar patrón AWS en el reverso
        graphics.fillStyle(0xFF9900);
        graphics.fillRect(20, 40, 100, 4);
        graphics.fillRect(20, 60, 100, 4);
        graphics.fillRect(20, 80, 100, 4);
        graphics.fillRect(20, 100, 100, 4);
        graphics.fillRect(20, 120, 100, 4);
        graphics.fillRect(20, 140, 100, 4);
        
        graphics.generateTexture('card-back', 140, 180);
        graphics.clear();
        
        // Crear texturas para cada servicio
        const services = [...this.awsServices.easy, ...this.awsServices.hard];
        services.forEach(service => {
            // Fondo blanco de la carta
            graphics.fillStyle(0xFFFFFF);
            graphics.fillRoundedRect(0, 0, 140, 180, 15);
            
            // Borde naranja AWS
            graphics.lineStyle(4, 0xFF9900);
            graphics.strokeRoundedRect(2, 2, 136, 176, 15);
            
            // Área del icono (parte superior)
            graphics.fillStyle(0xFF9900);
            graphics.fillRoundedRect(10, 10, 120, 100, 10);
            
            // Área del texto (parte inferior)
            graphics.fillStyle(0x232F3E);
            graphics.fillRoundedRect(10, 120, 120, 50, 10);
            
            this.drawServiceIcon(graphics, service.name, 70, 60);
            
            graphics.generateTexture(`card-${service.name.toLowerCase()}`, 140, 180);
            graphics.clear();
        });
        
        graphics.destroy();
    }
    
    drawServiceIcon(graphics, serviceName, centerX, centerY) {
        graphics.fillStyle(0x232F3E);
        graphics.lineStyle(3, 0x232F3E);
        
        switch(serviceName.toLowerCase()) {
            case 's3':
                // Dibujar bucket
                graphics.fillRect(centerX - 25, centerY - 15, 50, 30);
                graphics.strokeRect(centerX - 25, centerY - 15, 50, 30);
                graphics.fillRect(centerX - 20, centerY - 10, 40, 5);
                graphics.fillRect(centerX - 20, centerY, 40, 5);
                graphics.fillRect(centerX - 20, centerY + 10, 40, 5);
                break;
                
            case 'lambda':
                // Dibujar lambda
                graphics.beginPath();
                graphics.moveTo(centerX - 20, centerY + 20);
                graphics.lineTo(centerX - 10, centerY - 20);
                graphics.lineTo(centerX, centerY - 10);
                graphics.lineTo(centerX + 10, centerY - 20);
                graphics.lineTo(centerX + 20, centerY + 20);
                graphics.lineTo(centerX + 10, centerY + 20);
                graphics.lineTo(centerX + 5, centerY + 5);
                graphics.lineTo(centerX - 5, centerY + 5);
                graphics.lineTo(centerX - 10, centerY + 20);
                graphics.closePath();
                graphics.fillPath();
                break;
                
            case 'ec2':
                // Dibujar servidor
                graphics.fillRect(centerX - 25, centerY - 20, 50, 40);
                graphics.strokeRect(centerX - 25, centerY - 20, 50, 40);
                graphics.fillCircle(centerX - 15, centerY - 10, 3);
                graphics.fillCircle(centerX, centerY - 10, 3);
                graphics.fillCircle(centerX + 15, centerY - 10, 3);
                graphics.fillRect(centerX - 20, centerY, 40, 3);
                graphics.fillRect(centerX - 20, centerY + 8, 40, 3);
                break;
                
            case 'rds':
                // Dibujar base de datos
                graphics.fillEllipse(centerX, centerY - 15, 40, 10);
                graphics.fillRect(centerX - 20, centerY - 15, 40, 30);
                graphics.fillEllipse(centerX, centerY + 15, 40, 10);
                graphics.strokeEllipse(centerX, centerY - 15, 40, 10);
                graphics.strokeEllipse(centerX, centerY + 15, 40, 10);
                graphics.strokeRect(centerX - 20, centerY - 15, 40, 30);
                break;
                
            case 'eks':
                // Dibujar rueda de Kubernetes
                graphics.beginPath();
                graphics.arc(centerX, centerY, 20, 0, Math.PI * 2);
                graphics.stroke();
                for(let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI * 2) / 6;
                    graphics.beginPath();
                    graphics.moveTo(centerX, centerY);
                    graphics.lineTo(centerX + Math.cos(angle) * 20, centerY + Math.sin(angle) * 20);
                    graphics.stroke();
                }
                break;
                
            case 'sagemaker':
                // Dibujar cerebro/ML
                graphics.beginPath();
                graphics.arc(centerX, centerY, 18, 0, Math.PI * 2);
                graphics.stroke();
                graphics.beginPath();
                graphics.moveTo(centerX - 10, centerY - 5);
                graphics.quadraticCurveTo(centerX, centerY - 15, centerX + 10, centerY - 5);
                graphics.stroke();
                graphics.beginPath();
                graphics.moveTo(centerX - 10, centerY + 5);
                graphics.quadraticCurveTo(centerX, centerY + 15, centerX + 10, centerY + 5);
                graphics.stroke();
                break;
                
            case 'kinesis':
                // Dibujar stream
                graphics.beginPath();
                graphics.moveTo(centerX - 25, centerY);
                graphics.quadraticCurveTo(centerX - 10, centerY - 15, centerX + 5, centerY);
                graphics.quadraticCurveTo(centerX + 20, centerY + 15, centerX + 25, centerY);
                graphics.stroke();
                graphics.beginPath();
                graphics.moveTo(centerX - 25, centerY - 8);
                graphics.quadraticCurveTo(centerX - 10, centerY - 23, centerX + 5, centerY - 8);
                graphics.quadraticCurveTo(centerX + 20, centerY + 7, centerX + 25, centerY - 8);
                graphics.stroke();
                graphics.beginPath();
                graphics.moveTo(centerX - 25, centerY + 8);
                graphics.quadraticCurveTo(centerX - 10, centerY - 7, centerX + 5, centerY + 8);
                graphics.quadraticCurveTo(centerX + 20, centerY + 23, centerX + 25, centerY + 8);
                graphics.stroke();
                break;
                
            case 'redshift':
                // Dibujar data warehouse
                graphics.fillRect(centerX - 25, centerY - 15, 50, 8);
                graphics.fillRect(centerX - 25, centerY - 3, 50, 8);
                graphics.fillRect(centerX - 25, centerY + 9, 50, 8);
                graphics.strokeRect(centerX - 25, centerY - 15, 50, 8);
                graphics.strokeRect(centerX - 25, centerY - 3, 50, 8);
                graphics.strokeRect(centerX - 25, centerY + 9, 50, 8);
                break;
        }
    }
    
    create() {
        // Título del juego
        this.add.text(400, 50, 'AWS MEMORY GAME', {
            fontSize: '32px',
            fill: '#FF9900',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        this.setupCards();
        this.setupTimer();
    }
    
    setupCards() {
        const services = this.awsServices[this.currentLevel];
        const cardData = [];
        
        // Crear pares de cartas
        services.forEach(service => {
            cardData.push(service, service);
        });
        
        // Mezclar cartas
        this.shuffleArray(cardData);
        
        // Crear cartas en la escena
        const startX = 150;
        const startY = 150;
        const cardWidth = 140;
        const cardHeight = 180;
        const spacingX = 30;
        const spacingY = 20;
        
        this.cards = [];
        
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
            
            // Efectos de hover
            card.on('pointerdown', () => this.flipCard(card));
            card.on('pointerover', () => {
                if (!card.isFlipped && !card.isMatched && this.gameActive) {
                    card.setScale(1.05);
                    card.setTint(0xdddddd);
                }
            });
            card.on('pointerout', () => {
                if (!card.isFlipped && !card.isMatched) {
                    card.setScale(1);
                    card.clearTint();
                }
            });
            
            this.cards.push(card);
        }
    }
    
    setupTimer() {
        // Los textos de UI se manejan desde el HTML
        this.timeLeft = 30;
        this.matchedPairs = 0;
    }
    
    flipCard(card) {
        if (!this.gameActive || card.isFlipped || card.isMatched || this.flippedCards.length >= 2) {
            return;
        }
        
        // Sonido de voltear carta
        if (this.sounds && this.sounds.flip) {
            this.sounds.flip();
        }
        
        card.isFlipped = true;
        card.setTexture(`card-${card.cardData.name.toLowerCase()}`);
        card.setScale(1);
        card.clearTint();
        this.flippedCards.push(card);
        
        // Agregar texto del servicio sobre la carta
        const text = this.add.text(card.x + 70, card.y + 140, card.cardData.name, {
            fontSize: '16px',
            fill: '#FFFFFF',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        const description = this.add.text(card.x + 70, card.y + 160, card.cardData.description, {
            fontSize: '10px',
            fill: '#FFFFFF',
            fontFamily: 'monospace',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        card.serviceText = text;
        card.descriptionText = description;
        
        if (this.flippedCards.length === 2) {
            this.time.delayedCall(1500, () => this.checkMatch());
        }
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.cardData.name === card2.cardData.name) {
            // ¡Coincidencia!
            if (this.sounds && this.sounds.match) {
                this.sounds.match();
            }
            
            card1.isMatched = true;
            card2.isMatched = true;
            card1.setTint(0x90EE90);
            card2.setTint(0x90EE90);
            
            this.matchedPairs++;
            
            // Actualizar UI
            document.getElementById('pairs').textContent = this.matchedPairs;
            
            if (this.matchedPairs === this.totalPairs) {
                this.gameWon();
            }
        } else {
            // No coinciden, voltear de nuevo
            card1.isFlipped = false;
            card2.isFlipped = false;
            card1.setTexture('card-back');
            card2.setTexture('card-back');
            
            if (card1.serviceText) {
                card1.serviceText.destroy();
                card1.descriptionText.destroy();
            }
            if (card2.serviceText) {
                card2.serviceText.destroy();
                card2.descriptionText.destroy();
            }
        }
        
        this.flippedCards = [];
    }
    
    update() {
        // Lógica de actualización del juego si es necesaria
    }
    
    startTimer() {
        this.gameActive = true;
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timer').textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.gameOver();
            }
        }, 1000);
    }
    
    gameWon() {
        this.gameActive = false;
        clearInterval(this.gameTimer);
        
        if (this.sounds && this.sounds.win) {
            this.sounds.win();
        }
        
        // Crear overlay de victoria
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        
        this.add.text(400, 250, '¡GANASTE!', {
            fontSize: '64px',
            fill: '#90EE90',
            fontFamily: 'monospace',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        this.add.text(400, 320, `Tiempo restante: ${this.timeLeft}s`, {
            fontSize: '24px',
            fill: '#FFFFFF',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        this.add.text(400, 360, 'Presiona F5 para jugar de nuevo', {
            fontSize: '18px',
            fill: '#FF9900',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
    }
    
    gameOver() {
        this.gameActive = false;
        clearInterval(this.gameTimer);
        
        if (this.sounds && this.sounds.lose) {
            this.sounds.lose();
        }
        
        // Crear overlay de derrota
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        
        this.add.text(400, 250, 'TIEMPO AGOTADO', {
            fontSize: '48px',
            fill: '#FF6B6B',
            fontFamily: 'monospace',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        this.add.text(400, 320, `Pares encontrados: ${this.matchedPairs}/${this.totalPairs}`, {
            fontSize: '24px',
            fill: '#FFFFFF',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        this.add.text(400, 360, 'Presiona F5 para jugar de nuevo', {
            fontSize: '18px',
            fill: '#FF9900',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    setLevel(level) {
        this.currentLevel = level;
        this.timeLeft = 30;
        this.matchedPairs = 0;
    }
    
    startGame() {
        if (this.game) {
            this.game.destroy(true);
        }
        
        this.game = new Phaser.Game(this.gameConfig);
        
        // Esperar un poco antes de iniciar el timer para que el juego se cargue
        setTimeout(() => {
            this.startTimer();
        }, 500);
    }
    
    resetGame() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.timeLeft = 30;
        this.gameActive = false;
        
        if (this.game) {
            this.game.destroy(true);
            this.game = null;
        }
    }
}

// Variables globales
let memoryGame = new AWSMemoryGame();

// Funciones para el menú
function startGame(level) {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('ui').classList.remove('hidden');
    document.getElementById('reset-btn').classList.remove('hidden');
    
    memoryGame.setLevel(level);
    memoryGame.startGame();
    
    // Actualizar UI
    document.getElementById('level').textContent = level.toUpperCase();
    document.getElementById('timer').textContent = '30';
    document.getElementById('pairs').textContent = '0';
}

function resetToMenu() {
    memoryGame.resetGame();
    
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('ui').classList.add('hidden');
    document.getElementById('reset-btn').classList.add('hidden');
}

// Inicializar cuando se carga la página
window.addEventListener('load', () => {
    console.log('AWS Memory Game cargado');
    
    // Agregar listener para tecla ESC para volver al menú
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            resetToMenu();
        }
    });
});

// Prevenir zoom en dispositivos móviles
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
});

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

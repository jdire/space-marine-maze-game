// Main game logic
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentLevel = 1;
        this.maxLevel = 10;
        this.gameState = 'start'; // 'start', 'playing', 'levelComplete'
        
        this.keys = {};
        this.maze = null;
        this.player = null;
        this.audioSystem = null;
        this.isMuted = false;
        this.lastMoveTime = 0;
        
        this.setupEventListeners();
        this.setupUI();
        
        // Game loop
        this.lastFrameTime = 0;
        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Prevent arrow key scrolling
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // UI buttons
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('next-level').addEventListener('click', () => {
            this.nextLevel();
        });

        document.getElementById('audio-test').addEventListener('click', () => {
            this.testAudio();
        });

        // Resume audio context on first user interaction
        document.addEventListener('click', () => {
            if (this.audioSystem) {
                this.audioSystem.resumeContext();
            }
        }, { once: true });
    }

    setupUI() {
        this.levelDisplay = document.getElementById('current-level');
        this.gameOverScreen = document.getElementById('game-over');
        this.gameStartScreen = document.getElementById('game-start');
        this.completedLevelDisplay = document.getElementById('completed-level');
        this.setupAudioControls();
    }

    setupAudioControls() {
        const volumeSlider = document.getElementById('volume-slider');
        const muteToggle = document.getElementById('mute-toggle');
        
        if (!volumeSlider || !muteToggle) {
            console.error('Audio controls not found in DOM');
            return;
        }
        
        // Initialize audio system
        this.audioSystem = new AudioSystem();
        
        const handleVolumeChange = (e) => {
            const volume = e.target.value / 100;
            console.log('Setting volume to:', volume);
            if (this.audioSystem) {
                this.audioSystem.setVolume(volume);
            }
            if (volume === 0) {
                this.isMuted = true;
                muteToggle.textContent = '🔇';
            } else {
                this.isMuted = false;
                muteToggle.textContent = '🔊';
            }
        };
        
        volumeSlider.addEventListener('input', handleVolumeChange);
        volumeSlider.addEventListener('change', handleVolumeChange);
        
        muteToggle.addEventListener('click', () => {
            console.log('Mute toggle clicked, current muted state:', this.isMuted);
            if (this.isMuted) {
                volumeSlider.value = 30;
                if (this.audioSystem) {
                    this.audioSystem.setVolume(0.3);
                }
                this.isMuted = false;
                muteToggle.textContent = '🔊';
            } else {
                volumeSlider.value = 0;
                if (this.audioSystem) {
                    this.audioSystem.setVolume(0);
                }
                this.isMuted = true;
                muteToggle.textContent = '🔇';
            }
        });
        
        console.log('Audio controls initialized');
    }

    testAudio() {
        console.log('Testing audio system...');
        if (!this.audioSystem) {
            this.audioSystem = new AudioSystem();
        }
        this.audioSystem.resumeContext();
        
        // Play a simple test sound
        setTimeout(() => {
            console.log('Playing test sound');
            this.audioSystem.playGameStartSound();
        }, 100);
    }

    startGame() {
        this.currentLevel = 1;
        this.gameState = 'playing';
        this.gameStartScreen.classList.add('hidden');
        
        // Start background music and play start sound
        this.audioSystem.resumeContext();
        this.audioSystem.playGameStartSound();
        setTimeout(() => {
            this.audioSystem.playBackgroundMusic();
        }, 1000);
        
        this.initializeLevel();
    }

    initializeLevel() {
        // Progressive difficulty - maze gets larger and more complex
        const baseSize = 15;
        const levelMultiplier = Math.floor((this.currentLevel - 1) / 2);
        const mazeWidth = baseSize + levelMultiplier * 4;
        const mazeHeight = baseSize + levelMultiplier * 3;
        
        // Ensure odd dimensions for proper maze generation
        const width = mazeWidth % 2 === 0 ? mazeWidth + 1 : mazeWidth;
        const height = mazeHeight % 2 === 0 ? mazeHeight + 1 : mazeHeight;
        
        this.maze = new Maze(width, height);
        
        // Player starts at the entrance (top-left area)
        const startX = this.maze.cellSize * 1.5;
        const startY = this.maze.cellSize * 1.5;
        this.player = new Player(startX, startY);
        
        // Update UI
        this.levelDisplay.textContent = this.currentLevel;
    }

    nextLevel() {
        this.currentLevel++;
        this.gameOverScreen.classList.add('hidden');
        
        if (this.currentLevel > this.maxLevel) {
            // Game completed
            this.audioSystem.stopBackgroundMusic();
            this.gameState = 'start';
            this.gameStartScreen.classList.remove('hidden');
            this.gameStartScreen.querySelector('h1').textContent = 'Mission Accomplished!';
            this.gameStartScreen.querySelector('p').textContent = 'All hostile territories have been cleared. Outstanding work, Space Marine!';
            this.gameStartScreen.querySelector('button').textContent = 'New Campaign';
        } else {
            this.gameState = 'playing';
            this.initializeLevel();
        }
    }

    handleInput() {
        if (this.gameState !== 'playing' || !this.player) return;

        let dx = 0;
        let dy = 0;

        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            dx = -1;
        }
        if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            dx = 1;
        }
        if (this.keys['ArrowUp'] || this.keys['KeyW']) {
            dy = -1;
        }
        if (this.keys['ArrowDown'] || this.keys['KeyS']) {
            dy = 1;
        }

        // Play move sound if player actually moved
        if (dx !== 0 || dy !== 0) {
            const currentTime = Date.now();
            if (currentTime - this.lastMoveTime > 150) { // Throttle move sounds
                const didMove = this.player.move(dx, dy, this.maze);
                if (didMove && !this.isMuted) {
                    this.audioSystem.playMoveSound();
                    this.lastMoveTime = currentTime;
                }
            } else {
                this.player.move(dx, dy, this.maze);
            }
        }
    }

    update() {
        if (this.gameState !== 'playing') return;

        this.player.update();
        
        // Check if player reached the goal
        if (this.player.checkGoalReached(this.maze)) {
            this.levelComplete();
        }
    }

    levelComplete() {
        this.gameState = 'levelComplete';
        this.completedLevelDisplay.textContent = this.currentLevel;
        this.gameOverScreen.classList.remove('hidden');
        
        // Play completion sound and effects
        this.audioSystem.playLevelCompleteSound();
        this.playCompletionEffect();
    }

    playCompletionEffect() {
        // Visual completion effect - screen flash
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = 'rgba(0, 255, 0, 0.3)';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '1000';
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            document.body.removeChild(flash);
        }, 200);
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000010';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.gameState === 'playing' && this.maze && this.player) {
            // Calculate camera offset to center the maze
            const mazePixelWidth = this.maze.width * this.maze.cellSize;
            const mazePixelHeight = this.maze.height * this.maze.cellSize;
            
            let offsetX = (this.canvas.width - mazePixelWidth) / 2;
            let offsetY = (this.canvas.height - mazePixelHeight) / 2;
            
            // For larger mazes, follow the player
            if (mazePixelWidth > this.canvas.width * 0.8 || mazePixelHeight > this.canvas.height * 0.8) {
                offsetX = this.canvas.width / 2 - this.player.x;
                offsetY = this.canvas.height / 2 - this.player.y;
                
                // Clamp camera to maze boundaries
                offsetX = Math.min(0, Math.max(this.canvas.width - mazePixelWidth, offsetX));
                offsetY = Math.min(0, Math.max(this.canvas.height - mazePixelHeight, offsetY));
            }
            
            // Render maze and player
            this.maze.render(this.ctx, offsetX, offsetY);
            this.player.render(this.ctx, offsetX, offsetY);
            
            // Add scanning lines effect
            this.renderScanlines();
        }
    }

    renderScanlines() {
        // Futuristic scanning effect
        const time = Date.now() / 1000;
        const scanlineY = (time * 100) % this.canvas.height;
        
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, scanlineY);
        this.ctx.lineTo(this.canvas.width, scanlineY);
        this.ctx.stroke();
        
        // Add some static noise
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            this.ctx.fillStyle = `rgba(0, 255, 255, ${Math.random() * 0.1})`;
            this.ctx.fillRect(x, y, 1, 1);
        }
    }

    gameLoop(currentTime) {
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;

        this.handleInput();
        this.update();
        this.render();

        requestAnimationFrame(this.gameLoop);
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    window.game = new Game();
    
    // Add debug functions to window for testing
    window.debugAudio = () => {
        console.log('Game instance:', window.game);
        console.log('Audio system:', window.game.audioSystem);
        console.log('Volume slider:', document.getElementById('volume-slider'));
        console.log('Mute toggle:', document.getElementById('mute-toggle'));
        
        if (window.game.audioSystem) {
            console.log('Testing audio...');
            window.game.audioSystem.resumeContext();
            window.game.audioSystem.playMoveSound();
        }
    };
});
// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Physics constants
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const GROUND_FRICTION = 0.8;

// Particle system
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 2;
        this.speedX = Math.random() * 8 - 4;
        this.speedY = Math.random() * 8 - 4;
        this.life = 1.0; // Life value from 1 to 0
        this.color = `hsl(${Math.random() * 60 + 200}, 100%, 50%)`; // Blue to purple colors
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.02;
        this.size *= 0.99;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Player properties
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 30,
    speed: 5,
    color: '#02C6AF',
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    jumpCount: 0,
    maxJumps: 2
};

// Platform (ground)
const ground = {
    y: canvas.height - 50,
    color: '#333'
};

// Particles array
let particles = [];

// Keep track of which keys are currently pressed
const keys = {
    A: false,
    ArrowRight: false,
    Space: false
};

// Event listeners for key presses
window.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !keys.Space) {
        keys.Space = true;
        if (player.jumpCount < player.maxJumps) {
            player.velocityY = JUMP_FORCE;
            player.jumpCount++;
            
            // Create particle effect on second jump
            if (player.jumpCount === 2) {
                createParticleEffect();
            }
        }
    }
    if (e.key === 'A') keys.A = true;
    if (e.key === 'ArrowRight') keys.ArrowRight = true;
});

window.addEventListener('keyup', function(e) {
    if (e.code === 'Space') keys.Space = false;
    if (e.key === 'A') keys.A = false;
    if (e.key === 'ArrowRight') keys.ArrowRight = false;
});

function createParticleEffect() {
    // Create particles in a burst
    for (let i = 0; i < 30; i++) {
        particles.push(new Particle(
            player.x + player.size / 2,
            player.y + player.size / 2
        ));
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    particles.forEach(particle => particle.draw(ctx));
}

function updatePlayer() {
    // Horizontal movement
    if (keys.ArrowLeft) {
        player.velocityX = -player.speed;
    } else if (keys.ArrowRight) {
        player.velocityX = player.speed;
    } else {
        player.velocityX *= GROUND_FRICTION;
    }

    // Apply gravity
    player.velocityY += GRAVITY;

    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Ground collision
    if (player.y + player.size > ground.y) {
        player.y = ground.y - player.size;
        player.velocityY = 0;
        player.jumpCount = 0; // Reset jump count when touching ground
    }

    // Wall collision
    if (player.x < 0) {
        player.x = 0;
        player.velocityX = 0;
    }
    if (player.x + player.size > canvas.width) {
        player.x = canvas.width - player.size;
        player.velocityX = 0;
    }
}

function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the ground
    ctx.fillStyle = ground.color;
    ctx.fillRect(0, ground.y, canvas.width, canvas.height - ground.y);
    
    // Draw particles
    drawParticles();
    
    // Draw the player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

// Game loop
function gameLoop() {
    updatePlayer();
    updateParticles();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

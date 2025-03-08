// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Physics constants
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const GROUND_FRICTION = 0.8;

// Powerup box
const powerup = {
    x: Math.random() * (canvas.width - 20),
    y: -20,
    size: 20,
    color: '#ffff00',
    speed: 1,
    active: true,
    respawnTime: 3000 // 3 seconds
};

// Particle system
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 2;
        this.speedX = Math.random() * 8 - 4;
        this.speedY = Math.random() * 8 - 4;
        this.life = 1.0;
        this.color = `hsl(${Math.random() * 60 + 200}, 100%, 50%)`;
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
    color: '#00f',
    defaultColor: '#00f',
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    jumpCount: 0,
    maxJumps: 2,
    colorTimer: null
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
    a: false,
    d: false,
    Space: false
};

// Event listeners for key presses
window.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !keys.Space) {
        keys.Space = true;
        if (player.jumpCount < player.maxJumps) {
            player.velocityY = JUMP_FORCE;
            player.jumpCount++;
            
            if (player.jumpCount === 2) {
                createParticleEffect();
            }
        }
    }
    if (e.key.toLowerCase() === 'a') keys.a = true;
    if (e.key.toLowerCase() === 'd') keys.d = true;
});

window.addEventListener('keyup', function(e) {
    if (e.code === 'Space') keys.Space = false;
    if (e.key.toLowerCase() === 'a') keys.a = false;
    if (e.key.toLowerCase() === 'd') keys.d = false;
});

function createParticleEffect() {
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

function resetPowerup() {
    powerup.x = Math.random() * (canvas.width - powerup.size);
    powerup.y = -powerup.size;
    powerup.active = true;
}

function updatePowerup() {
    if (powerup.active) {
        powerup.y += powerup.speed;

        // Check for collision with player
        if (player.x < powerup.x + powerup.size &&
            player.x + player.size > powerup.x &&
            player.y < powerup.y + powerup.size &&
            player.y + player.size > powerup.y) {
            
            // Collect powerup
            powerup.active = false;
            player.color = '#ff0000'; // Change to red
            
            // Clear existing timer if there is one
            if (player.colorTimer) {
                clearTimeout(player.colorTimer);
            }
            
            // Set timer to revert color after 5 seconds
            player.colorTimer = setTimeout(() => {
                player.color = player.defaultColor;
                setTimeout(resetPowerup, powerup.respawnTime);
            }, 5000);
        }

        // Reset if powerup falls below ground
        if (powerup.y > canvas.height) {
            resetPowerup();
        }
    }
}

function updatePlayer() {
    if (keys.a) {
        player.velocityX = -player.speed;
    } else if (keys.d) {
        player.velocityX = player.speed;
    } else {
        player.velocityX *= GROUND_FRICTION;
    }

    player.velocityY += GRAVITY;
    player.x += player.velocityX;
    player.y += player.velocityY;

    if (player.y + player.size > ground.y) {
        player.y = ground.y - player.size;
        player.velocityY = 0;
        player.jumpCount = 0;
    }

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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the ground
    ctx.fillStyle = ground.color;
    ctx.fillRect(0, ground.y, canvas.width, canvas.height - ground.y);
    
    // Draw powerup
    if (powerup.active) {
        ctx.fillStyle = powerup.color;
        ctx.fillRect(powerup.x, powerup.y, powerup.size, powerup.size);
    }
    
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
    updatePowerup();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

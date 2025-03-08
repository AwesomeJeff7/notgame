// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Physics constants
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const GROUND_FRICTION = 0.8;

// Player properties
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 30,
    speed: 5,
    color: '#00f',
    velocityX: 0,
    velocityY: 0,
    isJumping: false
};

// Platform (ground)
const ground = {
    y: canvas.height - 50,
    color: '#333'
};

// Keep track of which keys are currently pressed
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
};

// Event listeners for key presses
window.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        keys.Space = true;
        // Only jump if we're on the ground
        if (!player.isJumping) {
            player.velocityY = JUMP_FORCE;
            player.isJumping = true;
        }
    }
    if (e.key === 'ArrowLeft') keys.ArrowLeft = true;
    if (e.key === 'ArrowRight') keys.ArrowRight = true;
});

window.addEventListener('keyup', function(e) {
    if (e.code === 'Space') keys.Space = false;
    if (e.key === 'ArrowLeft') keys.ArrowLeft = false;
    if (e.key === 'ArrowRight') keys.ArrowRight = false;
});

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
        player.isJumping = false;
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
    
    // Draw the player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

// Game loop
function gameLoop() {
    updatePlayer();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

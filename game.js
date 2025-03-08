// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player properties
const player = {
    x: canvas.width / 2,  // Start in the middle of the screen
    y: canvas.height / 2, // Start in the middle of the screen
    size: 30,            // Size of the square
    speed: 5,            // Movement speed
    color: '#00f'        // Blue color
};

// Keep track of which keys are currently pressed
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Event listeners for key presses
window.addEventListener('keydown', function(e) {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});

window.addEventListener('keyup', function(e) {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

// Game loop
function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update player position based on key presses
    if (keys.ArrowUp && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < canvas.height - player.size) {
        player.y += player.speed;
    }
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < canvas.width - player.size) {
        player.x += player.speed;
    }
    
    // Draw the player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
    
    // Continue the game loop
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

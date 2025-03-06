var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

var foodItems = [];
var gameStarted = false;
var gameOver = false;
var score = 0;
var maxFoodItems = 12;

var foodImage = new Image();
foodImage.src = "images2/apple.png";

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");

    placeFood();
    document.getElementById("startButton").addEventListener("click", startGame);
    document.addEventListener("keyup", changeDirection);

    const restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", restartGame);
}

function startGame() {
    gameStarted = true;
    gameOver = false;
    score = 0;
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    foodItems = [];
    document.getElementById("startButton").style.display = "none";
    placeFood();
    update();
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    }
    else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function update() {
    if (!gameStarted || gameOver) return;

    setTimeout(update, 100);

    context.fillStyle = "yellowgreen";
    context.fillRect(0, 0, board.width, board.height);

    drawGrid();

    for (let i = 0; i < foodItems.length; i++) {
        context.drawImage(foodImage, foodItems[i].x, foodItems[i].y, blockSize, blockSize);
    }

    for (let i = 0; i < foodItems.length; i++) {
        if (snakeX == foodItems[i].x && snakeY == foodItems[i].y) {
            snakeBody.push([foodItems[i].x, foodItems[i].y]);
            score++;
            foodItems.splice(i, 1);
            placeFood();
            if (foodItems.length < maxFoodItems) {
                placeFood();
            }
            break;
        }
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle = "teal";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    if (snakeX < 0 || snakeX >= cols * blockSize || snakeY < 0 || snakeY >= rows * blockSize) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
            break;
        }
    }

    if (gameOver) {
        document.getElementById("game-over-container").style.display = "block";
        document.getElementById("restartButton").style.display = "block";
    }

    document.getElementById("score-title").textContent = "Score: " + score;
}

function drawGrid() {
    context.strokeStyle = "white";
    context.lineWidth = 1;

    for (let i = 0; i <= cols; i++) {
        context.beginPath();
        context.moveTo(i * blockSize, 0);
        context.lineTo(i * blockSize, board.height);
        context.stroke();
    }

    for (let i = 0; i <= rows; i++) {
        context.beginPath();
        context.moveTo(0, i * blockSize);
        context.lineTo(board.width, i * blockSize);
        context.stroke();
    }
}

function placeFood() {
    let newFood = {
        x: Math.floor(Math.random() * cols) * blockSize,
        y: Math.floor(Math.random() * rows) * blockSize
    };


    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeBody[i][0] == newFood.x && snakeBody[i][1] == newFood.y) {
            return placeFood();
        }
    }

    foodItems.push(newFood);
}

function restartGame() {
    gameOver = false;
    score = 0;
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    foodItems = [];
    placeFood();
    document.getElementById("game-over-container").style.display = "none";
    document.getElementById("restartButton").style.display = "none";
    update();
}

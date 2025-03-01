let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

let playerWidth = 10;
let playerHeight = 50;
let playerVelocityY = 0;

let player1Score = 0;
let player2Score = 0;

let player1 = {
    x : 10,
    y : boardHeight/2,
    width : playerWidth,
    height : playerHeight,
    velocityY : playerVelocityY
}

let player2 = {
    x : boardWidth - playerWidth - 10,
    y : boardHeight/2,
    width : playerWidth,
    height : playerHeight,
    velocityY : playerVelocityY
}

let ballWidth = 10;
let ballHeight = 10;
let ball = {
    x : boardWidth/2,
    y : boardHeight/2,
    width : ballWidth,
    height : ballHeight,
    velocityX : 2,
    velocityY : 3
}

let gameStarted = false;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    const startButton = document.getElementById("startButton");
    startButton.addEventListener("click", startGame);

    const restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", startGame);

    drawTextOnImage("images/start.png", "Start", 20, 100, 50);

    context.fillStyle = "white";
    context.fillRect(player1.x, player1.y, player1.width, player1.height);

    requestAnimationFrame(update);
    document.addEventListener("keyup", movePlayer);
}

function drawTextOnImage(imageSrc, text, fontSize, width, height) {
    const img = new Image();
    img.src = imageSrc;
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(text, width / 2, height / 2);
        const dataURL = canvas.toDataURL();
        document.getElementById('startButtonImage').src = dataURL;
    }
}

function startGame() {
    gameStarted = true;
    gameOver = false;
    player1Score = 0;
    player2Score = 0;
    document.getElementById("startButton").style.display = "none";
    document.getElementById("game-over-container").style.display = "none";
    document.getElementById("restartButton").style.display = "none";
    resetGame(1);
    requestAnimationFrame(update);
}

function update() {
    if (!gameStarted || gameOver) return;
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    let nextPlayer1Y = player1.y + player1.velocityY;
    if (!outOfBounds(nextPlayer1Y)) {
        player1.y = nextPlayer1Y;
    }
    context.fillStyle = "white";
    context.fillRect(player1.x, player1.y, player1.width, player1.height);

    let cpuSpeed = 3;
    let mistakeChance = 0.1;

    let targetY = ball.y - player2.height / 2;

    if (Math.random() > mistakeChance) {
        if (player2.y < targetY) {
            player2.velocityY = Math.min(cpuSpeed, player2.velocityY + 1);
        } else if (player2.y > targetY) {
            player2.velocityY = Math.max(-cpuSpeed, player2.velocityY - 1);
        } else {
            player2.velocityY = 0;
        }
    } else {
        if (Math.random() > 0.5) {
            player2.velocityY = cpuSpeed;
        } else {
            player2.velocityY = -cpuSpeed;
        }
    }

    let nextPlayer2Y = player2.y + player2.velocityY;
    if (!outOfBounds(nextPlayer2Y)) {
        player2.y = nextPlayer2Y;
    }
    context.fillRect(player2.x, player2.y, player2.width, player2.height);

    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    if (ball.y <= 0 || (ball.y + ball.height >= boardHeight)) {
        ball.velocityY *= -1;
    }

    if (detectCollision(ball, player1) || detectCollision(ball, player2)) {
        ball.velocityX *= -1;
    }

    if (ball.x < 0) {
        player2Score++;
        resetGame(1);
    } else if (ball.x + ballWidth > boardWidth) {
        player1Score++;
        resetGame(-1);
    }

    context.font = "45px Arial";
    context.fillText(player1Score, boardWidth / 5, 45);
    context.fillText(player2Score, boardWidth * 4 / 5 - 45, 45);

    if (player2Score >= 3) {
        gameOver = true;
        showGameOver();
    }
}

function showGameOver() {
    document.getElementById("game-over-container").style.display = "block";
    document.getElementById("restartButton").style.display = "block";
}

function outOfBounds(yPosition) {
    return (yPosition < 0 || yPosition + playerHeight > boardHeight);
}

function movePlayer(e) {
    if (e.code == "ArrowUp") {
        player1.velocityY = -3;
    }
    else if (e.code == "ArrowDown") {
        player1.velocityY = 3;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function resetGame(direction) {
    ball = {
        x : boardWidth / 2,
        y : boardHeight / 2,
        width : ballWidth,
        height : ballHeight,
        velocityX : direction * 2,
        velocityY : 3
    };
}

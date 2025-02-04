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

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    const startButton = document.getElementById("startButton");
    startButton.addEventListener("click", startGame);

    context.fillStyle = "palevioletred"
    context.fillRect(player1.x, player1.y, player1.width, player1.height);

    requestAnimationFrame(update);
    document.addEventListener("keyup", movePlayer);

}

function startGame() {
    gameStarted = true;
    document.getElementById("startButton").style.display = "none";
    requestAnimationFrame(update);
}

function update() {
    if (!gameStarted) return;
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    let nextPlayer1Y = player1.y + player1.velocityY;
    if (!outOfBounds(nextPlayer1Y)) {
        player1.y = nextPlayer1Y;
    }
    context.fillStyle = "palevioletred";
    context.fillRect(player1.x, player1.y, player1.width, player1.height);

    let cpuSpeed = 3;
    let mistakeChance = 0.2;

    let targetY = ball.y - player2.height / 2;


    if (Math.random() > mistakeChance) {

        if (player2.y < targetY - 5) {
            player2.velocityY = cpuSpeed;
        } else if (player2.y > targetY + 5) {
            player2.velocityY = -cpuSpeed;
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

    if (detectCollision(ball, player1)) {
        ball.velocityX = Math.abs(ball.velocityX);
    } else if (detectCollision(ball, player2)) {
        ball.velocityX = -Math.abs(ball.velocityX);
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

    for (let i = 10; i < board.height; i += 25) {
        context.fillRect(board.width / 2 - 10, i, 5, 5);
    }
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
    else if (e.code == "KeyW") {
        player2.velocityY = -3;
    }
    else if (e.code == "KeyS") {
        player2.velocityY = 3;
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
        velocityX : direction * (2 + Math.random() * 2),
        velocityY : (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 2) 
    };
}
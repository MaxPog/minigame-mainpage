var board = [];
var rows = 8;
var columns = 8;

var minesCount = 10;
var minesLocation = [];

var tilesClicked = 0;
var flagEnabled = false;

var gameOver = false;

window.onload = function () {
    startGame();
}

function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);

    updateSmiley("neutral");

    setMines();

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}

function resetGame() {
    gameOver = false;
    tilesClicked = 0;
    minesLocation = [];
    flagEnabled = false;
    
    document.getElementById("mines-count").innerText = minesCount;

    const board = document.getElementById("board");
    board.innerHTML = "";
    
    setMines();
    startGame();

    updateSmiley("neutral");
}


function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgrey";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgrey";
    }
} 



function clickTile() {
    if(gameOver || this.classList.contains("tile-clicked")) {
        return;
    }
    
    let tile = this;
    
    if (flagEnabled) {
        if (tile.innerHTML === "") {
            let flagImg = document.createElement("img");
            flagImg.src = "MINESWEEPER/images/flag.png";
            flagImg.alt = "Flag";
            flagImg.width = 35;
            flagImg.height = 35;
            tile.appendChild(flagImg);
        } else if (tile.children.length > 0) {
            tile.innerHTML = "";
        }
        return;
    }

    if (minesLocation.includes(tile.id)) {
        alert("GAME OVER");
        gameOver = true;
        updateSmiley("lose");
        revealMines();
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt (coords[0]);
    let c = parseInt (coords[1]);
    checkMine(r, c);
}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                let mineImg = document.createElement("img");
                mineImg.src = "MINESWEEPER/images/mine.png";
                mineImg.alt = "Mine";
                mineImg.width = 35;
                mineImg.height = 35;
                tile.appendChild(mineImg);
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")){
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    minesFound += checkTile(r-1, c-1);
    minesFound += checkTile(r-1, c);
    minesFound += checkTile(r-1, c+1);

    minesFound += checkTile(r, c-1);
    minesFound += checkTile(r, c+1);

    minesFound += checkTile(r+1, c-1);
    minesFound += checkTile(r+1, c);
    minesFound += checkTile(r+1, c+1);

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        checkMine(r-1, c-1);
        checkMine(r-1, c);
        checkMine(r-1, c+1);

        checkMine(r, c-1);
        checkMine(r, c+1);

        checkMine(r+1, c-1);
        checkMine(r+1, c);
        checkMine(r+1, c+1);

    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
        updateSmiley("win");
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}



function updateSmiley(state) {
    const smiley = document.getElementById("smiley");

    if (state === "neutral") {
        smiley.src = "MINESWEEPER/images/neutral.png";
    } else if (state === "click") {
        smiley.src = "MINESWEEPER/images/surprised.png";
    } else if (state === "win") {
        smiley.src = "MINESWEEPER/images/cool.png";
    } else if (state === "lose") {
        smiley.src = "MINESWEEPER/images/lost.png";
    }
}

window.onload = function () {
    startGame();
};
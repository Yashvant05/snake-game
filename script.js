const board = document.querySelector(".board");

const startButton = document.querySelector(".start-btn");
const modal = document.querySelector(".modal");

const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");

const restartButton = document.querySelector(".btn-restart");

const highScoreElement = document.querySelector(".high-score");
const scoreElement = document.querySelector(".score");
const timeElement = document.querySelector(".time");

const blockSize = 50;

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = 0;

highScoreElement.innerText = highScore;

const cols = Math.floor(board.clientWidth / blockSize);
const rows = Math.floor(board.clientHeight / blockSize);

const blocks = {};
let snake = [{ x: 1, y: 3 }];
let direction = "right";
let intervalID = null;
let timerIntervalID = null;
let food = generateFood();

function generateFood() {
    let pos;
    do {
        pos = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols),
        };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
}

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

function render() {
    let head = { ...snake[0] };

    if (direction === "left") head.y--;
    if (direction === "right") head.y++;
    if (direction === "up") head.x--;
    if (direction === "down") head.x++;

    // Wall collision
    if (
        head.x < 0 ||
        head.x >= rows ||
        head.y < 0 ||
        head.y >= cols ||
        snake.some(seg => seg.x === head.x && seg.y === head.y)
    ) {
        endGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.innerText = score;

        if (score > highScore) {
            highScore = score;
            highScoreElement.innerText = highScore;
            localStorage.setItem("highScore", highScore);
        }

        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = generateFood();
    } else {
        const tail = snake.pop();
        blocks[`${tail.x}-${tail.y}`].classList.remove("fill");
    }

    blocks[`${food.x}-${food.y}`].classList.add("food");
    blocks[`${head.x}-${head.y}`].classList.add("fill");
}

function startGame() {
    modal.style.display = "none";
    startGameModal.style.display = "flex";
    gameOverModal.style.display = "none";

    intervalID = setInterval(render, 300);
    timerIntervalID = setInterval(() => {
        time++;
        const min = String(Math.floor(time / 60)).padStart(2, "0");
        const sec = String(time % 60).padStart(2, "0");
        timeElement.innerText = `${min}:${sec}`;
    }, 1000);
}

function endGame() {
    clearInterval(intervalID);
    clearInterval(timerIntervalID);
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
}

function restartGame() {
    clearInterval(intervalID);
    clearInterval(timerIntervalID);

    Object.values(blocks).forEach(b => b.classList.remove("fill", "food"));

    score = 0;
    time = 0;
    direction = "right";
    snake = [{ x: 1, y: 3 }];
    food = generateFood();

    scoreElement.innerText = score;
    timeElement.innerText = "00:00";

    startGame();
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

addEventListener("keydown", e => {
    const opposites = {
        up: "down",
        down: "up",
        left: "right",
        right: "left",
    };

    const keyMap = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
    };

    const newDir = keyMap[e.key];
    if (newDir && opposites[newDir] !== direction) {
        direction = newDir;
    }
});

const board = document.querySelector(".board");
const blockHeight = 50
const blockWidth = 50

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

const blocks = []
const snake = [{
    x: 1, y: 3
}]

let direction = 'right'



for(let row = 0; row < rows; row++){
    for(let col = 0; col < cols; col++){
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        blocks[ `${row}-${col}` ] = block
    }
}

function render(){

    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.add("fill")
    })
}

setInterval(() => {

    let head = mnull

    if (direction === "left"){
        head = {x: snake[0].x, y: snake[0].y - 1}
    } else if(direction === "right"){
        head = {x: snake[0].x, y: snake[0].y + 1}
    } else if(direction === "down"){
        head = {x: snake[0].x + 1, y: snake[0].y}
    } else if(direction === "up"){
        head = {x: snake[0].x - 1, y: snake[0].y}
    }

    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })

    // snake.unshift(head)
    // snake.pop()

    render()
}, 450);
//Game Const
let direction = { x: 0, y: 0 };
const foodSound = new Audio('/assets/food.mp3');
const gameOverSound = new Audio('/assets/gameover.mp3');
const moveSound = new Audio('assets/move.mp3');
const music = new Audio('assets/music.mp3');
let speed = 2;
let lastPaintTime = 0;

//Game Functions
function main(curtime) {
    window.requestAnimationFrame(main);
    console.log(curtime);
    if((curtime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = curtime;
    gameEngine();
    
}

function gameEngine(){
    // Part 1: Updating the Snake Array
    // Part 2: Render the Snake and Food
}






//Game Logic
window.requestAnimationFrame(main);
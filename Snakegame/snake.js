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
    if((curtime - lastPaintTime)/1000 < 1/speed);
    console.log(curtime);
}







//Game Logic
window.requestAnimationFrame(main);
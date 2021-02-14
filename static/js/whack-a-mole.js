const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;
canvas.style.backgroundColor = 'green';

class Hammer {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    draw() {
        c.beginPath();
        let rect = canvas.getBoundingClientRect(); 
        this.x = event.clientX - rect.left; 
        this.y = event.clientY - rect.top;
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        c.fillStyle = '#4a3600';
        c.fill();
    }
    remove(){
        c.beginPath();
        c.clearRect(this.x-this.radius, this.y-this.radius, 2*this.radius, 2*this.radius);
    }
}

class Mole{
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    draw() {
        c.beginPath();
        let rect = canvas.getBoundingClientRect(); 
        this.x = event.clientX - rect.left; 
        this.y = event.clientY - rect.top;
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        c.fillStyle = '#4a3600';
        c.fill();
    }
    remove(){
        c.beginPath();
        c.clearRect(this.x-this.radius, this.y-this.radius, 2*this.radius, 2*this.radius);
    }
}

const hammer = new Hammer(0, 0, 20);
canvas.addEventListener('click', ()=>{
    hammer.draw();
    setInterval(() => {  hammer.remove(); }, 700);
})

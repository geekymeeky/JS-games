
var start;
var clicked;
window.onload=appear;

function disappear(){
document.getElementById("box").style.display="none";
clicked=Date.now();
var reaction=(clicked-start)/1000;
document.getElementById("click").innerHTML="Your Reaction Time: " + reaction + " seconds!";
var randomDelay=((Math.random()*4))*1000;
setTimeout(appear,randomDelay);

}


function appear(){

var randomTop=Math.random()*300;
var randomLeft=Math.random()*600;
var randomRight=Math.random()*400;
var randomHeight=Math.random()*200+30;
var randomWidth=Math.random()*200+30;
var randomColor="#"+((1<<24)*Math.random()|0).toString(16);
var randomCurve=Math.random();

if (randomCurve<0.5){
document.getElementById("box").style.borderRadius="25%";
}
else{
document.getElementById("box").style.borderRadius="0%";
}


start=Date.now();
document.getElementById("box").style.display="block";
document.getElementById("box").style.top=randomTop;
document.getElementById("box").style.left=randomLeft;
document.getElementById("box").style.right=randomRight;
document.getElementById("box").style.height=randomHeight;
document.getElementById("box").style.width=randomWidth;
document.getElementById("box").style.backgroundColor=randomColor;
}
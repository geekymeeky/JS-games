console.log('index-script.js linked!');

var winHeight = 0;
var winWidth = 0;
var $frog = null;

$(function() {
  $frog = $('.frog-character').eq(0);
  winHeight = window.innerHeight;
  winWidth = window.innerWidth;

  moveFrog();
  setInterval(moveFrog, 3000);
});

function moveFrog() {
  var leftOffset = Math.floor(Math.random() * (winWidth - $frog.height()));
  var topOffset = Math.floor(Math.random() * (winHeight - $frog.width()));
  $frog.animate({
    left: leftOffset,
    top: topOffset,
    }, 3000);
}

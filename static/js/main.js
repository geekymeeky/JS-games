function myfunction() {
    requestAnimationFrame(myfunction);
    var elem = document.getElementById('pop');
    var r;
    elem.style.transitionDuration = "200ms";
    r = (Math.floor(Math.random() * 16777215)+500).toString(16);
    elem.style.color = "#" + r;
}

myfunction();
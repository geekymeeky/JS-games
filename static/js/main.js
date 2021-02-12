function myfunction() {
    var elem = document.getElementById('pop');
    var r;
    elem.style.transition = "2s";
    r = Math.floor(Math.random() * 16777215).toString(16);
    elem.style.color = "#" + r;
}

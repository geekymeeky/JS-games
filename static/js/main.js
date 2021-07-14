function myfunction() {
    requestAnimationFrame(myfunction);
    var elem = document.getElementById('pop');
    var r;
    elem.style.transitionDuration = "200ms";
    r = (Math.floor(Math.random() * 16777215)+500).toString(16);
    elem.style.color = "#" + r;
}

myfunction();


function toggle_light_mode() {
    var app = document.getElementsByTagName("HTML")[0];
    var nav = document.getElementById("dm");
    if (localStorage.lightMode == "dark") {
      localStorage.lightMode = "light";
      app.setAttribute("light-mode", "light");
      nav.classList.remove("dark-theme");
    } else {
      nav.classList.add("dark-theme");
      localStorage.lightMode = "dark";
      app.setAttribute("light-mode", "dark");
    }
  }
  
  
  window.addEventListener("storage", function () {
    if (localStorage.lightMode == "dark") {
      app.setAttribute("light-mode", "dark");
    } else {
      app.setAttribute("light-mode", "light");
    }
  }, false);

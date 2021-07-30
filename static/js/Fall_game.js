var character = document.getElementById("character");
var game = document.getElementById("game");
var interval;
var both = 0;
var counter = 0;
var currentBlocks = [];

/* To move the ball left */
function moveleft(){
    var left = 
    parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    /* setting a new left position */
    if(left>0){/* so that ball don't pass the left side of grid*/
        character.style.left = left - 2 + "px";
    }
}

/* To move the ball right */
function moveright(){
    var left = 
    parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    /* setting a new right position */
    if(left<380){/* so that ball don't pass the right side of grid*/
        character.style.left = left + 2 + "px"
    }
}

document.addEventListener("keydown", event =>{
    if(both === 0){
        both++ ;
        if(event.key === "ArrowLeft"){
            interval = setInterval(moveleft, 1);
        }
        if(event.key === "ArrowRight"){
            interval = setInterval(moveright, 1);
        }
    }
});

document.addEventListener("keyup", event =>{
    clearInterval(interval);
    both = 0;
});

var blocks = setInterval(function(){
    document.getElementById("score").innerHTML = counter-5
    /*To keep track of last created block and hole*/
    var blockLast = document.getElementById("block"+(counter-1)); 
    var holeLast = document.getElementById("hole"+(counter-1)); 

    if(counter>0){
        var blockLastTop = parseInt(window.getComputedStyle(blockLast).getPropertyValue("top"));
        var holeLastTop = parseInt(window.getComputedStyle(holeLast).getPropertyValue("top"));
    }
    /*we add block and holes only if condn satisfies*/
    if(blockLastTop<400 || counter==0){
        /* Creating two elements*/
        var block = document.createElement("div");
        var hole = document.createElement("div");
        /* adding class to style them */
        block.setAttribute("class","block");
        hole.setAttribute("class","hole");
        /* adding id to acess them using js */
        block.setAttribute("id","block"+counter);
        hole.setAttribute("id","hole"+counter);

        block.style.top = blockLastTop + 100 + "px";
        hole.style.top = holeLastTop + 100 + "px";

        var random = Math.floor(Math.random() * 360);
        hole.style.left = random + "px";
        game.appendChild(block);
        game.appendChild(hole);
        currentBlocks.push(counter);
        counter++;
    }
    var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    var characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    var drop = 0;
    /*If ball goes above the page => game over*/
    if(characterTop <= 0){
        alert("Game over. Score: "+(counter-7));
        clearInterval(blocks);
        location.reload();
    }
    for(i=0;i<currentBlocks.length;i++){
        let current = currentBlocks[i];
        let ihole = document.getElementById("hole"+current);
        let iblock =  document.getElementById("block"+current);
        let iblockTop = parseFloat(window.getComputedStyle(iblock).getPropertyValue("top"));
        let iholeLeft = parseFloat(window.getComputedStyle(ihole).getPropertyValue("left"));
        ihole.style.top = iblockTop - 0.55 + "px";
        iblock.style.top = iblockTop - 0.55 + "px";
        if(iblockTop < -20){
            currentBlocks.shift();
            iblock.remove();
            ihole.remove();
        }
        if(iblockTop-20 < characterTop && iblockTop > characterTop){
            drop++; /*If character is on top of a block*/
            if(iholeLeft <= characterLeft && iholeLeft+20 >= characterLeft){
                drop = 0; /* If you're currently over a hole */
            }
        }
    }
    if(drop==0){
        if(characterTop < 480){
            character.style.top = characterTop + 2 + "px"; /*Make ball drop*/
        }
    }else{
        character.style.top = characterTop - 0.5 + "px";/*Make ball go up */
    }
},1);
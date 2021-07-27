document.addEventListener('DOMContentLoaded' ,() =>{
    const grid = document.querySelector('.game')
    const scoreDisplay = document.getElementById('score')
    const width = 28 //28 * 28  = 784 squares 
    let score = 0

    const layout = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
        4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
        1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
        1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
        1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
        1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
        1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
        1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
      ]

      /*Here => 
      0: food
      1: wall
      2: enemy
      3: energy
      4: empty */
      
    const squares = []

    // Drawing the grid
    function createGrid(){
          for(let i=0;i<layout.length;i++){
                // Creating a div for all 780 blocks
                const EachSq = document.createElement('div')
                // Putting the created div in our grid
                grid.appendChild(EachSq)
                squares.push(EachSq)

                /* Adding layout to the board
                   we check with each digit (0 to 4) and if equals 
                   we go in our new squares array find the same item
                   and add the class name corresponding to it*/
                if(layout[i] === 0){
                    squares[i].classList.add('food')
                } else if(layout[i]  === 1){
                    squares[i].classList.add('wall')
                } else if(layout[i]  === 2){
                    squares[i].classList.add('enemy')
                } else if (layout[i] === 3){
                    squares[i].classList.add('energy')
                }
          }
    }
    createGrid()

    // Starting positin of the Pac Man 
    let index = 492
    // We will add the class of PacMan to the 430th index of squares
    squares[index].classList.add('pac-man')

    // Moving the PacMan
    function movePacMan(e){
      var music = document.querySelector('audio')
      music.play()
      squares[index].classList.remove('pac-man')
      // Moving the PacMan with arrow keys
      switch(e.keyCode){
        // Making PacMan move left
        case 37:
            if(
                index % width !== 0 &&
                !squares[index -1].classList.contains('wall') &&
                !squares[index -1].classList.contains('enemy')
            )
            index -= 1
            // Right to Left
            if (squares[index -1] === squares[363]) {
                index = 391
            }
            break
        // Making PacMan move up
        case 38:
            if(
                index - width >= 0 &&
                !squares[index -width].classList.contains('wall') &&
                !squares[index -width].classList.contains('enemy')
            ) 
            index -= width
            break
        // Making PacMan move right
        case 39:
            if(
                index % width < width - 1 &&
                !squares[index +1].classList.contains('wall') &&
                !squares[index +1].classList.contains('enemy')
            )
            index += 1
            // Left to right
            if (squares[index +1] === squares[392]) {
                index = 364
            }
            break
        // Making PacMan move down
        case 40:
            if (
                index + width < width * width && // Not pass the board
                !squares[index +width].classList.contains('wall') // Cannot pass through wall
                        && 
                !squares[index +width].classList.contains('enemy') // Cannot pass through ghost
            )
            index += width
            break
        }   
    squares[index].classList.add('pac-man')
    if(e.keyCode === 40){document.querySelector('.pac-man').style.transform = "rotate(90deg)"};
    if(e.keyCode === 38){document.querySelector('.pac-man').style.transform = "rotate(-90deg)"};
    if(e.keyCode === 37){document.querySelector('.pac-man').style.transform = "scaleX(-1)"};
    eaten()
    powerPelletEaten()
    checkForGameOver()
    checkForWin()
    }
    document.addEventListener('keyup', movePacMan)

    function eaten(){
        if (squares[index].classList.contains('food')){
            score++
            scoreDisplay.innerHTML = score
            squares[index].classList.remove('food')
        }
    }
    
    //what happens when you eat a power-pellet
    function powerPelletEaten() {
        if (squares[index].classList.contains('energy')) {
        score +=10
        ghosts.forEach(ghost => ghost.isScared = true)
        setTimeout(unScareGhosts, 10000)
        squares[index].classList.remove('energy')
        }
    }

    //make the ghosts stop flashing
    function unScareGhosts() {
        ghosts.forEach(ghost => ghost.isScared = false)
    }

    // Create our enemies
    class Ghost {
        constructor(className, startIndex, speed) {
          this.className = className
          this.startIndex = startIndex
          this.speed = speed
          this.currentIndex = startIndex
          this.isScared = false
          this.timerId = NaN
        }
      }
    
      //all my ghosts
      ghosts = [
        new Ghost('blinky', 348, 250),
        new Ghost('pinky', 376, 400),
        new Ghost('inky', 351, 300),
        new Ghost('clyde', 379, 500)
        ]

        //draw my ghosts onto the grid
        ghosts.forEach(ghost => {
            squares[ghost.currentIndex].classList.add(ghost.className)
            squares[ghost.currentIndex].classList.add('ghost')
            })

        //move the Ghosts randomly
        ghosts.forEach(ghost => moveGhost(ghost))

        function moveGhost(ghost) {
            const directions =  [-1, +1, width, -width]
            let direction = directions[Math.floor(Math.random() * directions.length)]

            ghost.timerId = setInterval(function() {
            //if the next squre your ghost is going to go to does not have a ghost and does not have a wall
            if  (!squares[ghost.currentIndex + direction].classList.contains('ghost') &&
                !squares[ghost.currentIndex + direction].classList.contains('wall') ) {
                //remove the ghosts classes
                squares[ghost.currentIndex].classList.remove(ghost.className)
                squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')
                //move into that space
                ghost.currentIndex += direction
                squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
            //else find a new random direction ot go in
            } else direction = directions[Math.floor(Math.random() * directions.length)]

            //if the ghost is currently scared
            if (ghost.isScared) {
                squares[ghost.currentIndex].classList.add('scared-ghost')
            }

            //if the ghost is currently scared and pacman is on it
            if(ghost.isScared && squares[ghost.currentIndex].classList.contains('pac-man')) {
                squares[ghost.currentIndex].classList.remove(ghost.className, 'ghost', 'scared-ghost')
                ghost.currentIndex = ghost.startIndex
                score +=100
                squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
            }
            checkForGameOver()
            }, ghost.speed)
        }

        //check for a game over
        function checkForGameOver() {
            if (squares[index].classList.contains('ghost') &&
            !squares[index].classList.contains('scared-ghost')) {
            ghosts.forEach(ghost => clearInterval(ghost.timerId))
            document.removeEventListener('keyup', movePacMan)
            setTimeout(function(){ alert("Game Over"); }, 500)
            }
        }

        //check for a win - more is when this score is reached
        function checkForWin() {
            if (score === 274) {
            ghosts.forEach(ghost => clearInterval(ghost.timerId))
            document.removeEventListener('keyup', movePacMan)
            setTimeout(function(){ alert("You have WON!"); }, 500)
            }
        }
    
})


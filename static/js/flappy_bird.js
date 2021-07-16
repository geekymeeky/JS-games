/* We wait for all our html to load before reading our js */
document.addEventListener('DOMContentLoaded', () => {
    const bird = document.querySelector('.bird')
    const game = document.querySelector('.game')

    // Moving bird to bottomish center of sky
    let birdLeft = 220
    let birdBottom = 100
    let gravity = 2
    let gap = 450
    let isgameover = false
    var score = 0

    function startGame(){
        document.getElementById("score").innerHTML = "Your Score = "+score.toFixed(0)
        birdBottom -= gravity
        // Bird distance form top = 220px
        bird.style.bottom = birdBottom + 'px'
        // Bird distance form left = 100px
        bird.style.left = birdLeft + 'px'
    
    }
    let gameTime =  setInterval(startGame,20)

    function control(e){
        if(e.keyCode === 13){
            jump()
        }
    }
    function jump(){
        // To prevent bird going pass the top most 
        if (birdBottom<500){ birdBottom += 50}

        bird.style.bottom = birdBottom + 'px'
        console.log(birdBottom)
    }
    document.addEventListener('keyup',control)


    function pillars(){
        let obstacleLeft = 500
        // Making the obstacle of random height
        let randomHeight = Math.random() * 60 // Random ni. generated from 1 to 60(here)
        let obstacleBottom = randomHeight

        // Creating element div called obstacle in js
        const obstacle = document.createElement('div')
        obstacle.classList.add('obstacle')
        // Creating element div called topObstacle in js
        const topObstacle = document.createElement('div')
        topObstacle.classList.add('topObstacle')
        // Putting this newly created div inside game div
        if (!isgameover){
            game.appendChild(obstacle)
            game.appendChild(topObstacle)
            
        }
        obstacle.style.left = obstacleLeft + 'px'
        obstacle.style.bottom = obstacleBottom + 'px'

        topObstacle.style.left = obstacleLeft + 'px'
        topObstacle.style.bottom = obstacleBottom + gap + 'px'
        
        // To move the pillar form right to left
        function moveObstacle(){
            obstacleLeft -= 2
            score += 0.1
            obstacle.style.left = obstacleLeft + 'px'
            topObstacle.style.left = obstacleLeft + 'px'

            // If pillar pass the left most i.e '0', it is removed
            if(obstacleLeft === -50){
                clearInterval(time) // We stop the time interval 
                game.removeChild(obstacle)
                game.removeChild(topObstacle)
            }
            // If bird reaches the bottom of sky grid
            if( obstacleLeft>200 && obstacleLeft<280 && birdLeft === 220 && (birdBottom<obstacleBottom+153 
                || birdBottom>obstacleBottom + gap -200 )|| birdBottom === 0){
                    score = 0
                    gameOver()
                    // We also stop the pillar at the time form moving
                    clearInterval(time)
            }
        }
        // New pillar generated, each after 3 sec of diff sizes 
        if(!isgameover){setTimeout(pillars,3000)}
        let time = setInterval(moveObstacle,20)
    }
    pillars()

    function gameOver(){
        clearInterval(gameTime) // We stop the Interval for game 
        if(confirm("Oopss! game over, Press enter to try again")){
            location.reload();
        }
        isgameover = true
        document.removeEventListener('keyup',control)
    }

})
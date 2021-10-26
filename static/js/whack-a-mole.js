const score = document.querySelector('.score span') //within score, within span we're keeping point records
const holes = document.querySelectorAll('.hole') //all the 9 holes, All -> coz many holes
const playb = document.querySelector('.buttons .play')
const stopb = document.querySelector('.buttons .stop')
const cursor = document.querySelector('.cursor img')

//positioning the hammer img with cursor

window.addEventListener('mousemove', (event) => {
  //whenever mouse is moved in the screen this func runs,
  //console.log(event)     //from console we get pageX and pageY (in pixels)
  cursor.style.top = event.pageY + 'px' //PageY --> position of cursor from the top of the window
  cursor.style.left = event.pageX + 'px' //pageX --> position of cursor from the left of the window

  window.addEventListener('click', () => {
    //whenever we click with the hammer img there will be some animnation
    cursor.style.animation = 'hit 0.1s ease' ///now define the animation we just created (hit) in css
    setTimeout(() => {
      //the hammer bends only once, to make it multiple time we use this function and remove the animation after 0.1sec
      cursor.style.removeProperty('animation')
    }, 100)
  })
})

//handling the play button

playb.addEventListener('click', () => {
  playb.style.display = 'none' //once you click on play button it dissapears
  stopb.style.display = 'inline-block' //and stop button is diplayed on screen

  //start the game

  let hole
  let points = 0

  const startGame = setInterval(() => {
    //after every 0.7 sec for infinite no. of times until we stop it
    //selecting random holes to display the mole in that
    const a = Math.floor(Math.random() * 9) //for each hole
    hole = holes[a]

    //creating the img tag
    let image = document.createElement('img') //creating image object
    image.setAttribute('src', '../static/images/whack-a-mole/mole.png') //giving attribute name and location
    image.setAttribute('class', 'mole') //give image a class named mole

    setTimeout(() => {
      //removing the mole image once displayed
      hole.removeChild(image)
    }, 800)

    //append and remove child timing should be different

    //inserting the image in selected random hole
    hole.appendChild(image)
  }, 1000)

  //setting the points
  window.addEventListener('click', (event) => {
    if (event.target == hole) score.innerText = ++points // if we click on the random hole no. 'hole' it will increase the point value
  })

  //handling the stop button

  stopb.addEventListener('click', () => {
    clearInterval(startGame) //on clicking the stop button, it stops infinite startGame loop

    playb.style.display = 'inline-block' //play button is diplayed on screen
    stopb.style.display = 'none' //once you click on stop button it dissapears
    score.innerText = 0
  })
})

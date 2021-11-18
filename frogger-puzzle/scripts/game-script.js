// console.log('game-script.js linked!');
$(function() {
  // console.log('jQuery works!');
  // get all the parameters passed over from the index page; currently only need nickname
  getAllParameters();
  // get important elements and cache them
  $window = $(window);
  $mainContainer = $('.main-container').eq(0);
  $body = $('body').eq(0);
  $startSquare = $('.start').eq(0);

  // get and cache some more HTML elements
  $nickname = $('#nickname').eq(0);
  $level = $('#level').eq(0);
  $lives = $('#lives').eq(0);
  $winCount = $('#win-count').eq(0);
  $time = $('#time').eq(0);

  // set nickname paragraph using value gotten from the query string
  $nickname.text('nickname: ' + userName);

  // call the setupGame function
  setupGame();
  // call the playGame function
  playGame();
});

// this function simply sets the data paragraphs to the current play status
function showData() {
  $level.text('level: ' + curLevel);
  $lives.text('lives: ' + lives);
  $winCount.text('wins: ' + winCount);
  $time.text('time elapsed: ' + timer + ' seconds');
}

// this function generates the initial sprites that will be on the screen at the beginning of the round
function setupGame() {
  $window.on('keydown', checkKey);
  for (var i = 0; i < multiplier * maxTrucks; i++) {
    generateTruck('rand');
    numTrucks++;
  }
  for (var i = 0; i < multiplier * maxLogs; i++) {
    generateLog('rand');
    numLogs++;
  }
  // start a 'timer' using a setInterval call
  timerID = setInterval(function() {
    timer++;
  }, 1000);
}

// this function starts the gameplay by simply calling setInterval on important functions
function playGame() {
  moveTrucksID = setInterval(moveTrucks, speed);
  moveLogsID = setInterval(moveLogs, speed);
  checkTrucksID = setInterval(checkTrucks, speed);
  checkLogsID = setInterval(checkLogs, speed);
  checkFroggerID = setInterval(checkFrogger, 10);
  showDataID = setInterval(showData, 100);
}

// checks the current position of the frogger element to determine if the frogger has gone where
// it shouldn't or if it reached the finish line
function checkFrogger() {
  $frogger = $('#frogger');
    if ($frogger.attr('data-isallowed') == 'no') {
      doLoss();
    }
    if ($frogger.attr('class').includes('finish')){
      doWin();
    }
}

// gets all the parameters passed in to this page via the query string
function getAllParameters() {
  // get and parse the url
  var fullURL = window.location.href;
  // if there is no query string, simply exit gracefully
  if (!fullURL.includes('?')) {
    return;
  }
  var queryString = fullURL.split('?')[1];
  // split query string into an array of key-value pair strings
  var paramsAndVals = queryString.split('&');
  for (var i = 0; i < (paramsAndVals.length); i++) {
    var thisPair = paramsAndVals[i].split('=');
    // we only want the nickname, but we need to loop through all paramsAndVals
    // in case the query string was tampered with
    if (thisPair[0] == 'nickname') {
      userName = thisPair[1];
    }
  }
}

// simple utility function that loops through our array of truck Sprite objects and calls their move method
function moveTrucks() {
  for (var i = 0; i < allTrucks.length; i++) {
    allTrucks[i].move();
  }
}

// loops through our array of truck Sprite objects and deletes the objects that went off the board
// also responsible for generating new trucks when there aren't enough
function checkTrucks() {
  for (var i = 0; i < allTrucks.length; i++) {
    if (allTrucks[i].offBoard) {
      // remove it from the array
      allTrucks.splice(i, 1);
      numTrucks--;
    }
  }
  // loop through the difference between the number of sprites that we currently have and the desired amount
  // as determined by 1.5 times the maximum
  for (var i = numTrucks; i < (1.5 * multiplier * maxTrucks); i++) {
    generateTruck('ordered');
    numTrucks++;
  }
}

// simple utility function that loops through our array of log Sprite objects and calls their move method
function moveLogs() {
  for (var i = 0; i < allLogs.length; i++) {
    allLogs[i].move();
  }
}

// loops through our array of log Sprite objects and deletes the objects that went off the board
// also responsible for generating new logs when there aren't enough
function checkLogs() {
  for (var i = 0; i < allLogs.length; i++) {
    if (allLogs[i].offBoard) {
      // remove it from the array
      allLogs.splice(i, 1);
      numLogs--;
    }
  }
  // loop through the difference between the number of sprites that we currently have and the desired amount
  // as determined by 1.5 times the maximum
  for (var i = numLogs; i < (1.5 * multiplier * maxLogs); i++) {
    generateLog('ordered');
    numLogs++;
  }
}

// takes in a reference to a sprite type along with a string value determining whether we want a new sprite randomly
// placed on the screen or placed outside of the screen, then creates a new sprite type object using with the given
// creation method, then creates a new sprite object with the newly created type object, and returns the new sprite object
function generateSprite(spriteType, randOrOrdered) {
  var typeObj = new spriteType(randOrOrdered);
  var sprite = new Sprite(typeObj);
  sprite.type.parent = sprite;
  sprite.offBoard = sprite.isOffBoard();
  return sprite;
}

// determines if a new sprite type is allowed to be placed on the screen where it was randomly generated by checking
// the locations of all the other existing sprites of the same type
// takes in a sprite object and an array of objects of that sprite's type
function isValidPosition(sprite, allSprites) {
  // new sprite must be at least one div away from existing sprites on all sides
  var notAllowedRange = sprite.type.spriteLength + 1;
  for (var i = 0; i < allSprites.length; i++) {
    // get the difference of position of the new sprite's right column and that of the current existing one
    var diff = Math.abs(sprite.type.rightColNum - allSprites[i].type.rightColNum);
    // if the new one is within the allowed range and it's in the same row
    if (diff < notAllowedRange  && sprite.type.cellNum == allSprites[i].type.cellNum) {
      // this sprite is not allowed to be placed here
      return false;
    }
  }
  return true;
}

// function that is responsible for creating a new truck sprite object and ensuring its proper position
// takes one argument - a string value that denotes the creation type, random or ordered, of the truck
function generateTruck(randOrOrdered) {
  var thisTruck = generateSprite(Truck, randOrOrdered);
  var allGood = true;
  var count = 0;
  // check to see if the new truck sprite object is in a valid position
  // the allGood flag is just to exit the loop if the creation of 5 trucks didn't yield a valid position
  while (!isValidPosition(thisTruck, allTrucks) && allGood) {
    // do it all over again
    thisTruck = generateSprite(Truck, randOrOrdered);
    // keep track of how many times we created 'bad' trucks
    count++;
    // if we made 5 bad trucks
    if (count >= 5) {
      // get out
      allGood = false;
    }
  }
  // if we succesfully created a truck
  if (allGood) {
    // loop through the div elements it occupies
    for (var i = 0; i < thisTruck.cellsTakenUp.length; i++) {
      // if the current div exists; necessary for trucks created with the creation type of 'ordered'
      if (thisTruck.cellsTakenUp[i]){
        // set the div's isallowed attribute to whatever the truck type allows for
        thisTruck.cellsTakenUp[i].dataset.isallowed = thisTruck.type.canHoldFrogger;
        // add the truck's class to the div
        var curClass = thisTruck.cellsTakenUp[i].getAttribute('class');
        thisTruck.cellsTakenUp[i].setAttribute('class', (curClass + ' ' + thisTruck.type.typeClass));
      }
    }
    // add our new truck sprite to the array of all truck sprites
    allTrucks.push(thisTruck);
  }
}

// function that is responsible for creating a new log sprite object and ensuring its proper position
// takes one argument - a string value that denotes the creation type, random or ordered, of the log
function generateLog(randOrOrdered) {
  var thisLog = generateSprite(Log, randOrOrdered);
  var allGood = true;
  var count = 0;
  // check to see if the new log sprite object is in a valid position
  // the allGood flag is just to exit the loop if the creation of 5 logs didn't yield a valid position
  while (!isValidPosition(thisLog, allLogs) && allGood) {
    thisLog = generateSprite(Log, randOrOrdered);
    count++;
    // if we made 5 bad logs
    if (count >= 5) {
      // get out
      allGood = false;
    }
  }
  // if we succesfully created a log
  if (allGood) {
    // loop through the div elements it occupies
    for (var i = 0; i < thisLog.cellsTakenUp.length; i++) {
      // if the current div exists; necessary for logs created with the creation type of 'ordered'
      if (thisLog.cellsTakenUp[i]){
        // set the div's isallowed attribute to whatever the log type allows for
        thisLog.cellsTakenUp[i].dataset.isallowed = thisLog.type.canHoldFrogger;
        // add the log's class to the div
        var curClass = thisLog.cellsTakenUp[i].getAttribute('class');
        thisLog.cellsTakenUp[i].setAttribute('class', (curClass + ' ' + thisLog.type.typeClass));
      }
    }
    // add our new log sprite to the array of all log sprites
    allLogs.push(thisLog);
  }
}

// event handler for keypress. responsible for calling the proper functions to move the frogger div around
  function checkKey(e) {
    switch(e.key) {
      case 'ArrowRight':
        moveFroggerRight();
        break;
      case 'ArrowUp':
        moveFroggerUp();
        break;
      case 'ArrowLeft':
        moveFroggerLeft();
        break;
      case 'ArrowDown':
        moveFroggerDown();
        break;
      // easter egg time! pressing the 1 key 'pauses' the timer and truck movement/generation
      case '1':
        clearInterval(moveTrucksID);
        clearInterval(checkTrucksID);
        clearInterval(timerID);
        break;
      // pressing the 2 key 'pauses' the timer and log movement/generation
      case '2':
        clearInterval(moveLogsID);
        clearInterval(checkLogsID);
        clearInterval(timerID);
        break;
    }
  }

  // function that is called when the user moves the frogger to an area that it shouldn't be in
  function doLoss() {
    // user lost a life
    lives--;
    // change the containing element's CSS proerties to reflect a loss
    $mainContainer.css('border-color', 'white');
    $body.css('background', 'darkred');
    // disable the keydown event handler
    $(window).off('keydown', checkKey);
    // stop checking frogger's status
    clearInterval(checkFroggerID);
    // remove the frogger id from the current div so that we can reset it
    $('#frogger').attr('id', '');
    // do this all after one second
    setTimeout(function() {
      // move the frogger back to the beginning of the board
      $startSquare.attr('id', 'frogger');
      // turn on the keydown handler again
      $window.on('keydown', checkKey);
      // reset the containing elements' CSS
      $mainContainer.css('border-color', '');
      $body.css('background', '');
      // start checking frogger's status again
      checkFroggerID = setInterval(checkFrogger, 10);
    }, 1000);
    // if the user exhausted all their lives call the restartGame function to start over from the first level
    if (lives == 0) {
      displayLossPopup();
    }
  }

  // function that is called when the user succesfully moves the frogger to the finish zone
  function doWin() {
    winCount++;
    // add the frogger class to the div that the user landed on, so they know not to go there again
    var oldClass = $frogger.attr('class');
    var newClass = oldClass + ' frogger';
    $frogger.attr('class', newClass);
    // remove the frogger id from the div that the user landed on
    $frogger.attr('id', '');
    // start the user over again
    $startSquare.attr('id', 'frogger');
    // if the user got the frog to the end zone as many times as necessary to beat the level
    if (winCount == winsNeeded) {
      // throw some confetti on the screen
      $('.overlay').eq(0).css('background', 'url(assets/images/confetti.gif)');
      // move the user to the next level
      displayWinPopup();
    }
  }

  // needs work!!!
  function displayLossPopup() {
    // remove keydown event listener
    $(window).off('keydown', checkKey);
    // stop all running functions
    clearInterval(moveTrucksID);
    clearInterval(checkTrucksID);
    clearInterval(moveLogsID);
    clearInterval(checkLogsID);
    clearInterval(timerID);

    // hide the board's grid
    $mainContainer.children().hide();
    // show the winning popup div and add it to the main container, fading it in for effect
    var $popup = $('.popup-loss').eq(0);
    // set the popup's children's text fields
    $('#loss-popup-level').text(curLevel + '!');
    // add click event listener to popup's button
    $('#start-over').eq(0).on('click', restartGame);
    $mainContainer.append($popup);
    $popup.fadeIn(1500);
    // change flex property to vertically align the popup
    $mainContainer.css('align-items', 'center');
  }

  function restartGame() {
    clearAllCells();
    numTrucks = 0;
    numLogs = 0;
    allTrucks = [];
    allLogs = [];
    curLevel = 0;
    winCount = 0;
    timer = 0;
    multiplier = 1;
    speed = 1000;
    setupGame();
    playGame();
    var $popup = $('.popup-loss').eq(0);
    $body.append($popup);
    $popup.hide(100);
    $mainContainer.css('align-items', '');
    $mainContainer.children().show();
  }

  // needs work!!!
  function displayWinPopup() {
    // remove keydown event listener
    $(window).off('keydown', checkKey);
    // stop all running functions
    clearInterval(moveTrucksID);
    clearInterval(checkTrucksID);
    clearInterval(moveLogsID);
    clearInterval(checkLogsID);
    clearInterval(timerID);
    clearInterval(checkFroggerID);

    // hide the board's grid
    $mainContainer.children().hide();
    // show the winning popup div and add it to the main container, fading it in for effect
    var $popup = $('.popup-win').eq(0);
    // set the popup's children's text fields
    $('#win-popup-level').text(curLevel + '!');
    // add click event listener to popup's button
    $('#next-round').eq(0).on('click', advanceLevel);
    $mainContainer.append($popup);
    $popup.fadeIn(1500);
    // change flex property to vertically align the popup
    $mainContainer.css('align-items', 'center');
  }

  function advanceLevel() {
    clearAllCells();
    numTrucks = 0;
    numLogs = 0;
    allTrucks = [];
    allLogs = [];
    curLevel++;
    winCount = 0;
    timer = 0;
    (multiplier > 0.1) ? multiplier -= .1:multiplier = .1;
    (speed > 100) ? speed -= 100:speed = 100;
    setupGame();
    playGame();
    var $popup = $('.popup-win').eq(0);
    $body.append($popup);
    $popup.hide(100);
    $mainContainer.css('align-items', '');
    $mainContainer.children().show();
    // hide the confetti
    $('.overlay').eq(0).css('background', '');
  }

  // function that first queries the DOM for all elements with a class of cell, then loops through them all and removes
  // special classes
  function clearAllCells() {
    var $allCells = $('.cell');
    for (var i = 0; i < $allCells.length; i++) {
      var oldClass = $allCells[i].getAttribute('class');
      if (oldClass.includes('truck')){
        var newClass = oldClass.replace(' truck', '');
        $allCells[i].setAttribute('class', newClass);
      }
      if (oldClass.includes('log')){
        var newClass = oldClass.replace(' log', '');
        $allCells[i].setAttribute('class', newClass);
      }
      if (oldClass.includes('frogger')){
        var newClass = oldClass.replace(' frogger', '');
        $allCells[i].setAttribute('class', newClass);
      }
      if (oldClass.includes('street')) {
        $allCells[i].dataset.isallowed = 'yes';
      }
      if (oldClass.includes('river')) {
        $allCells[i].dataset.isallowed = 'no';
      }
    }
  }

  // function that actually moves the frogger id to the next div
  // takes in two arguments, representing the colum and cell of the next div so that we can look it up in the DOM
  function moveFrogger(nextCol, nextCell) {
    // build our column and row classes
    var nextColClass = '.column-' + nextCol;
    var nextCellClass = 'cell-' + nextCell;
    // do the lookup. nextCell - 1 because eq uses a zero based index
    var $nextEl = $(nextColClass).children().eq(nextCell-1);
    // check the validity of the next cell's position
    if ($nextEl.data('isallowed') == 'no' || $nextEl.attr('class').includes('frogger')) {
      doLoss();
      return;
    }
    // if it's a valid spot move the id
    $frogger.removeAttr('id');
    $nextEl.attr('id', 'frogger');
  }

  // helper function to get the column number of an element
  // note that this function only works if the column number class is the first class that has a dash in it
  function getCurrentColumn() {
    return (parseInt($frogger.parent().attr('class').split('-')[1]));
  }
  // helper function to get the row number of an element
  // note that this function only works if the cell number class is the first class that has a dash in it
  function getCurrentCell() {
    return (parseInt($frogger.attr('class').split('-')[1]));
  }

  // function that determines what the next element's coordinates should be if the user moved right
  // checks for the edge of the board and protects the user by just not doing anything if they moved off the board
  // calls the moveFrogger function with the computed coordinates for the next element
  function moveFroggerRight() {
    var curCol = getCurrentColumn();;
    var curCell = getCurrentCell();
    if (curCol == gridSize) {
      return;
    }
    var nextCol = curCol + 1;
    var nextCell = curCell;
    moveFrogger(nextCol, nextCell);
  }

  // function that determines what the next element's coordinates should be if the user moved left
  // checks for the edge of the board and protects the user by just not doing anything if they moved off the board
  // calls the moveFrogger function with the computed coordinates for the next element
  function moveFroggerLeft() {
    var curCol = getCurrentColumn();;
    var curCell = getCurrentCell();
    if (curCol == 1) {
      return;
    }
    var nextCol = curCol - 1;
    var nextCell = curCell;
    moveFrogger(nextCol, nextCell);
  }

  // function that determines what the next element's coordinates should be if the user moved up
  // checks for the edge of the board and protects the user by just not doing anything if they moved off the board
  // calls the moveFrogger function with the computed coordinates for the next element
  function moveFroggerUp() {
    var curCol = getCurrentColumn();;
    var curCell = getCurrentCell();
    if (curCell == 1) {
      return;
    }
    var nextCol = curCol;
    var nextCell = curCell - 1;
    moveFrogger(nextCol, nextCell);
  }

  // function that determines what the next element's coordinates should be if the user moved down
  // checks for the edge of the board and protects the user by just not doing anything if they moved off the board
  // calls the moveFrogger function with the computed coordinates for the next element
  function moveFroggerDown() {
    var curCol = getCurrentColumn();;
    var curCell = getCurrentCell();
    if (curCell == gridSize) {
      return;
    }
    var nextCol = curCol;
    var nextCell = curCell + 1;
    moveFrogger(nextCol, nextCell);
  }


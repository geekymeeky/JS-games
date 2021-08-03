// the sprite class is used mostly as a generic container for the individual type classes that we have,
// and is used to provide something of an abstraction layer to the movement and generation of the type
// objects. this class mostly contains methods to maintain a sprite in its lifecycle during the runtime
// of the game, and is responsible for moving and tracking a sprite object.

class Sprite {
  // takes in an object of the individual type class and stores a reference to it
  constructor(type) {
    this.type = type;
    this.cellsTakenUp = this.getCellElems();
    this.offBoard = false;
  }

  // this method is responsible for moving a sprite of any type by one cell, then updating the sprite's
  // properties in accordance with its movement
  move() {
    // if the sprite has no next cell and no trailing cell on the board and the sprite has already moved
    if (!this.type.$nextCell && !this.type.$trailingCell && !this.type.firstMove) {
      // then it's time to delete the sprite, so we set its offBoard property so that a later method can remove it
      this.offBoard = true;
    }
    // swapCells method does the actual moving of the sprite's divs
    this.swapCells();
    // updateObject method sets the new column numbers of the sprite, then...
    this.updateObject();
    // ...we update the cellsTakenUp array to hold the new divs
    this.cellsTakenUp = this.getCellElems();
    // also set the firstMove property to false, because the sprite just went through a move
    this.type.firstMove = false;
  }

  // simple method that just determines the new columns in which the sprite is bound
  updateObject() {
    // check for the direction that the sprite is moving in first
    if (this.type.direction == 'neg') {
      this.type.rightColNum--;
    }
    if (this.type.direction == 'pos') {
      this.type.rightColNum++;
    }
    this.type.leftColNum = this.type.rightColNum - this.type.spriteLength;
  }

  // this is where the real work of the move method takes place. this method checks for existence of
  // three important elements, and takes action appropriately
  swapCells() {
    // first we loop through the sprite's divs and check if any of them have a frogger id; i.e. frogger is 'on' them
    var $cellWithFrogger = null;
    var $nextCellForFrogger = null;
    for (var i = 0; i < this.cellsTakenUp.length; i++) {
      // checks existence of the current element, since it can be null
      var id = this.cellsTakenUp[i] ? this.cellsTakenUp[i].getAttribute('id'):null;
      // checks if the element has an id and if it contains 'frogger'
      if (id && id.includes('frogger')) {
        // if it does, store the element in a variable to be utilized later
        $cellWithFrogger = this.cellsTakenUp[i];
        // determine the next place the frogger should be moved based on the sprite's motion
        if (this.type.direction == 'neg') {
          $nextCellForFrogger = this.cellsTakenUp[i - 1];
        }
        if (this.type.direction == 'pos') {
          $nextCellForFrogger = this.cellsTakenUp[i + 1];
        }
      }
    }

    // nice variables to shorten the code
    var $next = this.type.$nextCell;
    var $remove = this.type.$trailingCell;
    var $leading = this.type.$leadingCell;

    // does the sprite have a target destination? does it have at least one div on the board?
    if (!$next && !$leading && !$remove) {
      // if it doesn't, then it does not exist on the playing field
      this.offBoard = true;
    // does the sprite have at least a trailing div on the board, even if it doesn't have a destination?
    } else if ((!$next && !$leading && $remove) || (!$next && $leading && $remove)) {
      // if it does, then we want to remove the trailing div, since the sprite is almost off the board
      this.offBoard = false;
      // remove the type's class from the current div
      var nextClass = $remove.getAttribute('class');
      var newClass = nextClass.replace((' ' + this.type.typeClass), '');
      $remove.setAttribute('class', newClass);
      // flip the isallowed attribute to the opposite of what it was
      $remove.dataset.isallowed = this.type.canBePlacedOn;
    // does the sprite have a destination even if it's missing a first and/or last div?
    } else if (($next && !$leading && !$remove) || ($next && $leading && !$remove)) {
      // if it does, then we want to add a new trailing div, since the sprite is just getting on the board
      this.offBoard = false;
      // add the type's class to the new div
      var nextClass = $next.getAttribute('class');
      $next.setAttribute('class', (nextClass + ' ' + this.type.typeClass));
      // set the isallowed attribute to what the type says it should be
      $next.dataset.isallowed = this.type.canHoldFrogger;
    // do all the sprites elements exist? aka is the sprite entirely on the board and not approaching the board's end?
    } else if ($next && $leading && $remove) {
      this.offBoard = false;
      // do a full move
      // get rid of remove
      var nextClass = $remove.getAttribute('class');
      var newClass = nextClass.replace((' ' + this.type.typeClass), '');
      $remove.setAttribute('class', newClass);
      $remove.dataset.isallowed = this.type.canBePlacedOn;
      // move leading to next
      var nextClass = $next.getAttribute('class');
      $next.setAttribute('class', (nextClass + ' ' + this.type.typeClass));
      $next.dataset.isallowed = this.type.canHoldFrogger;
    }

    // is the frogger on the current sprite and does it have somewhere to go?
    if ($cellWithFrogger && $nextCellForFrogger) {
      // if so, move it to the next one
      $cellWithFrogger.setAttribute('id', '');
      $nextCellForFrogger.setAttribute('id', 'frogger');
    }
    // the last if statement allows the frogger to be moved with the sprite, so that it will be moved with, for example,
    // the log that it's on. it's important to note two things here:
    // 1) if the frog reaches the end of the board while on a log, it will slip off the log into the river when the log
    //    disappears, 'killing' the frog
    // 2) if, by some miracle, the user manages to get the frog on a truck, it will still move with the truck because of
    //    the way we determined that the frog is there
  }

  // function that queries the DOM for the sprite's current bounding columns and rows and returns the appropriate cells
  // in an array. note that we don't check for existence of the cells here, because we're relying on other methods to do so.
  getCellElems() {
    // store all the elements in the row into an array to be traversed later
    var $allCells = $(('.cell-' + this.type.cellNum)).toArray();
    var toReturn = [];
    var dir = this.type.direction;
    var left = this.type.leftColNum;
    var right = this.type.rightColNum
    // loop through the aforementioned array and take only the elements within the bounding columns
    for (var i = (left); i < right; i++){
      toReturn.push($allCells[i]);
    }
    if (dir == 'neg') {
      this.type.$leadingCell = $allCells[left];
      this.type.$trailingCell = $allCells[right - 1];
      this.type.$nextCell = $allCells[left - 1];
    }
    if (dir == 'pos') {
      this.type.$leadingCell = $allCells[right - 1];
      this.type.$trailingCell = $allCells[left];
      this.type.$nextCell = $allCells[right];
    }
    return toReturn;
  }

  // utility method to get the status of the type object so that we can store it in the parent sprite's object
  isOffBoard() {
    return this.type.offBoard;
  }

}

// the truck class is designed to only store data about a truck type, and contains no methods beyond the constructor.
// the constructor accepts a creation type string so that we can generate the appropriate column numbers for the sprite
class Truck {
  constructor(randOrOrdered) {
    this.creationType = randOrOrdered;
    // canBePlacedOn indicates the type of cell that the sprite is supposed to go on, and is used to reset a div when
    // the sprite moves off of it
    this.canBePlacedOn = 'yes';
    // canHoldFrogger denotes whether or not a collision between a sprite and frogger is 'fatal' to frogger
    this.canHoldFrogger = 'no';
    // CSS class that every div a sprite rests on should have (just for styling)
    this.typeClass = 'truck';
    this.firstMove = false;
    this.spriteLength = 3;
    // generate a random number between 10 and 16 (inclusive) to denote a row number
    this.cellNum = getRandom(7, 10);
    // even row numbers move left; odds move right
    if (this.cellNum % 2 == 0) {
      this.direction = 'neg';
    } else {
      this.direction = 'pos';
    }
    if (randOrOrdered == 'rand') {
      this.rightColNum = getRandom(14, 4);
      // sprite starts off on the board
      this.offBoard = false;
    }
    if (randOrOrdered == 'ordered') {
      this.firstMove = true;
      // starts off off the board
      this.offBoard = true;
      if (this.direction == 'neg'){
        // non random, left moving sprite, so the first cell is the rightmost one on the board
        // right column number is 1 + spriteLength divs away from the board
        this.rightColNum = gridSize + 1 + this.spriteLength;
        this.$nextCell = $('.cell-' + (gridSize)).eq(this.cellNum);
      }
      if (this.direction == 'pos') {
        // non random, right moving sprite, so the first cell is the leftmost one on the board
        // right column number is 0 divs away from the board
        this.rightColNum = 0;
        this.$nextCell = $('.cell-1').eq(this.cellNum);
      }
    }
    // calculate the left column number based on the determined right column number
    this.leftColNum = this.rightColNum - this.spriteLength;
  }
}

// the log class is designed to only store data about a log type, and contains no methods beyond the constructor.
// the constructor accepts a creation type string so that we can generate the appropriate column numbers for the sprite
class Log {
  constructor(randOrOrdered) {
    this.creationType = randOrOrdered;
    // canBePlacedOn indicates the type of cell that the sprite is supposed to go on, and is used to reset a div when
    // the sprite moves off of it
    this.canBePlacedOn = 'no';
    // canHoldFrogger denotes whether or not a collision between a sprite and frogger is 'fatal' to frogger
    this.canHoldFrogger = 'yes';
    // CSS class that every div a sprite rests on should have (just for styling)
    this.typeClass = 'log';
    this.firstMove = false;
    this.spriteLength = 4;
    // generate a random number between 2 and 8 (inclusive) to denote a row number
    this.cellNum = getRandom(7, 2);
    // even row numbers move left; odds move right
    if (this.cellNum % 2 == 0) {
      this.direction = 'neg';
    } else {
      this.direction = 'pos';
    }

    if (randOrOrdered == 'rand') {
      this.rightColNum = getRandom(14, 4);
      // sprite starts off on the board
      this.offBoard = false;
    }
    if (randOrOrdered == 'ordered') {
      this.firstMove = true;
      // starts off off the board
      this.offBoard = true;
      if (this.direction == 'neg') {
        // non random, left moving sprite, so the first cell is the rightmost one on the board
        // right column number is 1 + spriteLength divs away from the board
        this.rightColNum = gridSize + 1 + this.spriteLength;
        this.$nextCell = $('.cell-' + (gridSize)).eq(this.cellNum);
      }
      if (this.direction == 'pos') {
        // non random, right moving sprite, so the first cell is the leftmost one on the board
        // right column number is 0 divs away from the board
        this.rightColNum = 0;
        this.$nextCell = $('.cell-1').eq(this.cellNum);
      }
    }
    // calculate the left column number based on the determined right column number
    this.leftColNum = this.rightColNum - this.spriteLength;
  }
}

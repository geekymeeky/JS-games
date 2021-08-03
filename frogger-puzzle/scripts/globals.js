var gridSize = 17;
var timer = 0;
var winsNeeded = 5;
var winCount = 0;
var lives = 3;
var userName = null;
var curLevel = 1;
var multiplier = 1;
var speed = 1000;

// references to important HTML elements
var $mainContainer = null;
var $body = null;
var $window = null;
var $startSquare = null;

// some less important HTML elements
var $nickname = null;
var $level = null;
var $lives = null;
var $winCount = null;
var $time = null;

// global variable to hold the current frogger element
var $frogger = null;

// variables to hold current state of trucks
var numTrucks = 0;
var maxTrucks = 10;
var allTrucks = [];

// variables to hold current state of logs
var numLogs = 0;
var maxLogs = 30;
var allLogs = [];

// ID's from setInterval calls
var timerID = null;
var moveTrucksID = null;
var checkTrucksID = null;
var moveLogsID = null;
var checkLogsID = null;
var checkFroggerID = null;
var showDataID = null;

// utility functions

// returns a random number within the given range and starting at the given offset
function getRandom(range, offset) {
  return (Math.floor((Math.random() * range) + offset));
}

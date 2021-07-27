// game parameters
const delay_computer = 0.5; // seconds for the computer to take its turn
const delay_end = 2; // seconds until a new game starts
const FPS = 30; // frames per second
const grid_size = 5; // number of rows (and columns)
const height = 550; // pixels

// derived dimensions
const width = height * 0.9;
const cell = width / (grid_size + 2); // size of cells (as well as left and right margin)
const stroke = cell / 12; // stroke width
const dot = stroke; // dot radius
const margin = height - (grid_size + 1) * cell; // top margin for score, names, etc.

// colours
const color_board = "cornsilk";
const color_border = "wheat";
const color_computer = "crimson";
const color_computer_lit = "lightpink";
const color_dot = "sienna";
const color_player = "royalblue";
const color_player_lit = "lightsteelblue";
const color_tie = "black";

// text
const text_computer = "Computer";
const text_computer_sml = "Comp";
const text_player = "Player";
const text_player_sml = "Play";
const text_size_cell = cell / 3;
const text_size_top = margin / 6;
const text_tie = "DRAW!";
const text_win = "WINS!";

// definitions
const Side = {
    bottom: 0,
    left: 1,
    right: 2,
    top: 3
}

// set up the game canvas
var canv = document.createElement("canvas");
canv.height = height;
canv.width = width;
document.body.appendChild(canv);
var canvRect = canv.getBoundingClientRect();

// set up the context
var ctx = canv.getContext("2d");
ctx.lineWidth = stroke;
ctx.textAlign = "center";
ctx.textBaseline = "middle";

// game variables
var currentCells, playersTurn, squares;
var scoreComp, scorePlay;
var timeComp, timeEnd;

// start a new game
newGame();

// event handlers
canv.addEventListener("mousemove", highlightGrid);
canv.addEventListener("click", click);

// set up the game loop
setInterval(loop, 1000 / FPS);

function loop() {
    drawBoard();
    drawSquares();
    drawGrid();
    drawScores();
    goComputer();
}

function click(/** @type {MouseEvent} */ ev) {
    if (!playersTurn || timeEnd > 0) {
        return;
    }
    selectSide();
}

function drawBoard() {
    ctx.fillStyle = color_board;
    ctx.strokeStyle = color_border;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeRect(stroke / 2, stroke / 2, width - stroke, height - stroke);
}

function drawDot(x, y) {
    ctx.fillStyle = color_dot;
    ctx.beginPath();
    ctx.arc(x, y, dot, 0, Math.PI * 2);
    ctx.fill();
}

function drawGrid() {
    for (let i = 0; i < grid_size + 1; i++) {
        for (let j = 0; j < grid_size + 1; j++) {
            drawDot(getGridX(j), getGridY(i));
        }
    }
}

function drawLine(x0, y0, x1, y1, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

function drawScores() {
    let colComp = playersTurn ? color_computer_lit : color_computer;
    let colPlay = playersTurn ? color_player : color_player_lit;
    drawText(text_player, width * 0.25, margin * 0.25, colPlay, text_size_top);
    drawText(scorePlay, width * 0.25, margin * 0.6, colPlay, text_size_top * 2);
    drawText(text_computer, width * 0.75, margin * 0.25, colComp, text_size_top);
    drawText(scoreComp, width * 0.75, margin * 0.6, colComp, text_size_top * 2);

    // game over text
    if (timeEnd > 0) {
        timeEnd--;

        // handle a tie
        if (scoreComp == scorePlay) {
            drawText(text_tie, width * 0.5, margin * 0.6, color_tie, text_size_top);
        } else {
            let playerWins = scorePlay > scoreComp;
            let color = playerWins ? color_player : color_computer;
            let text = playerWins ? text_player : text_computer;
            drawText(text, width * 0.5, margin * 0.5, color, text_size_top);
            drawText(text_win, width * 0.5, margin * 0.7, color, text_size_top);
        }

        // new game
        if (timeEnd == 0) {
            newGame();
        }
    }
}

function drawSquares() {
    for (let row of squares) {
        for (let square of row) {
            square.drawSides();
            square.drawFill();
        }
    }
}

function drawText(text, x, y, color, size) {
    ctx.fillStyle = color;
    ctx.font = size + "px dejavu sans mono";
    ctx.fillText(text, x, y);
}

function getColor(player, light) {
    if (player) {
        return light ? color_player_lit : color_player;
    } else {
        return light ? color_computer_lit : color_computer;
    }
}

function getText(player, small) {
    if (player) {
        return small ? text_player_sml : text_player;
    } else {
        return small ? text_computer_sml : text_computer;
    }
}

function getGridX(col) {
    return cell * (col + 1);
}

function getGridY(row) {
    return margin + cell * row;
}

function getValidNeighbourSides(row, col) {
    let sides = [];
    let square = squares[row][col];

    // check left
    if (!square.sideLeft.selected) {
        if (col == 0 || squares[row][col - 1].numSelected < 2) {
            sides.push(Side.left);
        }
    }

    // check right
    if (!square.sideRight.selected) {
        if (col == squares[0].length - 1 || squares[row][col + 1].numSelected < 2) {
            sides.push(Side.right);
        }
    }

    // check top
    if (!square.sideTop.selected) {
        if (row == 0 || squares[row - 1][col].numSelected < 2) {
            sides.push(Side.top);
        }
    }

    // check bottom
    if (!square.sideBot.selected) {
        if (row == squares.length - 1 || squares[row + 1][col].numSelected < 2) {
            sides.push(Side.bottom);
        }
    }

    return sides;
}

function goComputer() {

    if (playersTurn || timeEnd > 0) {
        return;
    }

    // count down till computer makes a selection
    if (timeComp > 0) {
        timeComp--;
        if (timeComp == 0) {
            selectSide();
        }
        return;
    }

    // set up the options array
    let options = [];
    options[0] = [];
    options[1] = [];
    options[2] = [];

    // first priority - select a square that has 3 sides completed
    // next priority - select a square that has 0 or 1 sides completed
    // final priority - select a square that has 2 sides completed
    for (let i = 0; i < squares.length; i++) {
        for (let j = 0; j < squares[0].length; j++) {
            switch (squares[i][j].numSelected) {
                case 3: // first priority
                    options[0].push({square: squares[i][j], sides: []});
                    break;
                case 0: // second priority
                case 1:
                    let sides = getValidNeighbourSides(i, j);
                    let priority = sides.length > 0 ? 1 : 2;
                    options[priority].push({square: squares[i][j], sides: sides});
                    break;
                case 2: // third priority
                    options[2].push({square: squares[i][j], sides: []});
                    break;
            }
        }
    }

    // randomly choose a square in priority order
    let option;
    if (options[0].length > 0) {
        option = options[0][Math.floor(Math.random() * options[0].length)];
    } else if (options[1].length > 0) {
        option = options[1][Math.floor(Math.random() * options[1].length)];
    } else if (options[2].length > 0) {
        option = options[2][Math.floor(Math.random() * options[2].length)];
    }

    // randomly choose a valid side
    let side = null;
    if (option.sides.length > 0) {
        side = option.sides[Math.floor(Math.random() * option.sides.length)];
    }

    // get the square's coordinates
    let coords = option.square.getFreeSideCoords(side);
    highlightSide(coords.x, coords.y);

    // set up delay
    timeComp = Math.ceil(delay_computer * FPS);
}

function highlightGrid(/** @type {MouseEvent} */ ev) {
    if (!playersTurn || timeEnd > 0) {
        return;
    }

    // get mouse position relative to the canvas
    let x = ev.clientX - canvRect.left;
    let y = ev.clientY - canvRect.top;

    // highlight the square's side
    highlightSide(x, y);
}

function highlightSide(x, y) {

    // clear previous highlighting
    for (let row of squares) {
        for (let square of row) {
            square.highlight = null;
        }
    }

    // check each cell
    let rows = squares.length;
    let cols = squares[0].length;
    currentCells = [];
    OUTER: for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (squares[i][j].contains(x, y)) {

                // highlight current
                let side = squares[i][j].highlightSide(x, y);
                if (side != null) {
                    currentCells.push({row: i, col: j});
                }

                // determine neighbour
                let row = i, col = j, highlight, neighbour = true;
                if (side == Side.left && j > 0) {
                    col = j - 1;
                    highlight = Side.right;
                } else if (side == Side.right && j < cols - 1) {
                    col = j + 1;
                    highlight = Side.left;
                } else if (side == Side.top && i > 0) {
                    row = i - 1;
                    highlight = Side.bottom;
                } else if (side == Side.bottom && i < rows - 1) {
                    row = i + 1;
                    highlight = Side.top;
                } else {
                    neighbour = false;
                }

                // highlight neighbour
                if (neighbour) {
                    squares[row][col].highlight = highlight;
                    currentCells.push({row: row, col: col});
                }

                // no need to continue
                break OUTER;
            }
        }
    }
}

function newGame() {
    currentCells = [];
    playersTurn = Math.random() >= 0.5;
    scoreComp = 0;
    scorePlay = 0;
    timeEnd = 0;

    // set up the squares
    squares = [];
    for (let i = 0; i < grid_size; i++) {
        squares[i] = [];
        for (let j = 0; j < grid_size; j++) {
            squares[i][j] = new Square(getGridX(j), getGridY(i), cell, cell);
        }
    }
}

function selectSide() {
    if (currentCells == null || currentCells.length == 0) {
        return;
    }

    // select the side(s)
    let filledSquare = false;
    for (let cell of currentCells) {
        if (squares[cell.row][cell.col].selectSide()) {
            filledSquare = true;
        }
    }
    currentCells = [];

    // check for winner
    if (filledSquare) {
        if (scorePlay + scoreComp == grid_size * grid_size) {
            // game over
            timeEnd = Math.ceil(delay_end * FPS);
        }
    } else {
        // next player's turn
        playersTurn = !playersTurn;
    }
}

// create the Square object constructor
function Square(x, y, w, h) {
    this.w = w;
    this.h = h;
    this.bottom = y + h;
    this.left = x;
    this.right = x + w;
    this.top = y;
    this.highlight = null;
    this.numSelected = 0;
    this.owner = null;
    this.sideBot = {owner: null, selected: false};
    this.sideLeft = {owner: null, selected: false};
    this.sideRight = {owner: null, selected: false};
    this.sideTop = {owner: null, selected: false};

    this.contains = function(x, y) {
        return x >= this.left && x < this.right && y >= this.top && y < this.bottom;
    }

    this.drawFill = function() {
        if (this.owner == null) {
            return;
        }

        // light background
        ctx.fillStyle = getColor(this.owner, true);
        ctx.fillRect(
            this.left + stroke, this.top + stroke,
            this.w - stroke * 2, this.h - stroke * 2
        );

        // owner text
        drawText(
            getText(this.owner, true),
            this.left + this.w / 2,
            this.top + this.h / 2,
            getColor(this.owner, false),
            text_size_cell
        );
    }

    this.drawSide = function(side, color) {
        switch(side) {
            case Side.bottom:
                drawLine(this.left, this.bottom, this.right, this.bottom, color);
                break;
            case Side.left:
                drawLine(this.left, this.top, this.left, this.bottom, color);
                break;
            case Side.right:
                drawLine(this.right, this.top, this.right, this.bottom, color);
                break;
            case Side.top:
                drawLine(this.left, this.top, this.right, this.top, color);
                break;
        }
    }

    this.drawSides = function() {

        // highlighting
        if (this.highlight != null) {
            this.drawSide(this.highlight, getColor(playersTurn, true));
        }

        // selected sides
        if (this.sideBot.selected) {
            this.drawSide(Side.bottom, getColor(this.sideBot.owner, false));
        }
        if (this.sideLeft.selected) {
            this.drawSide(Side.left, getColor(this.sideLeft.owner, false));
        }
        if (this.sideRight.selected) {
            this.drawSide(Side.right, getColor(this.sideRight.owner, false));
        }
        if (this.sideTop.selected) {
            this.drawSide(Side.top, getColor(this.sideTop.owner, false));
        }
    }
    
    // return a random free side's coordinates
    this.getFreeSideCoords = function(side) {
        
        // valid coordinates of each side
        let coordsBot = {x: this.left + this.w / 2, y: this.bottom - 1};
        let coordsLeft = {x: this.left, y: this.top + this.h / 2};
        let coordsRight = {x: this.right - 1, y: this.top + this.h / 2};
        let coordsTop = {x: this.left + this.w / 2, y: this.top};

        // get coordinates of given side
        let coords = null;
        switch (side) {
            case Side.bottom:
                coords = coordsBot;
                break;
            case Side.left:
                coords = coordsLeft;
                break;
            case Side.right:
                coords = coordsRight;
                break;
            case Side.top:
                coords = coordsTop;
                break;
        }

        // return requested side's coordinates
        if (coords != null) {
            return coords;
        }

        // otherwise choose a random free side
        let freeCoords = [];
        if (!this.sideBot.selected) {
            freeCoords.push(coordsBot);
        }
        if (!this.sideLeft.selected) {
            freeCoords.push(coordsLeft);
        }
        if (!this.sideRight.selected) {
            freeCoords.push(coordsRight);
        }
        if (!this.sideTop.selected) {
            freeCoords.push(coordsTop);
        }
        return freeCoords[Math.floor(Math.random() * freeCoords.length)];
    }

    this.highlightSide = function(x, y) {

        // calculate the distances to each side
        let dBot = this.bottom - y;
        let dLeft = x - this.left;
        let dRight = this.right - x;
        let dTop = y - this.top;

        // determine closest value
        let dClosest = Math.min(dBot, dLeft, dRight, dTop);

        // highlight the closest if not already selected
        if (dClosest == dBot && !this.sideBot.selected) {
            this.highlight = Side.bottom;
        } else if (dClosest == dLeft && !this.sideLeft.selected) {
            this.highlight = Side.left;
        } else if (dClosest == dRight && !this.sideRight.selected) {
            this.highlight = Side.right;
        } else if (dClosest == dTop && !this.sideTop.selected) {
            this.highlight = Side.top;
        }

        // return the highlighted side
        return this.highlight;
    }

    this.selectSide = function() {
        if (this.highlight == null) {
            return;
        }

        // select the highlighted side
        switch (this.highlight) {
            case Side.bottom:
                this.sideBot.owner = playersTurn;
                this.sideBot.selected = true;
                break;
            case Side.left:
                this.sideLeft.owner = playersTurn;
                this.sideLeft.selected = true;
                break;
            case Side.right:
                this.sideRight.owner = playersTurn;
                this.sideRight.selected = true;
                break;
            case Side.top:
                this.sideTop.owner = playersTurn;
                this.sideTop.selected = true;
                break;
        }
        this.highlight = null;

        // increase the number of selected
        this.numSelected++;
        if (this.numSelected == 4) {
            this.owner = playersTurn;

            // increment score
            if (playersTurn) {
                scorePlay++;
            } else {
                scoreComp++;
            }

            // filled
            return true;
        }

        // not filled
        return false;
    }
}
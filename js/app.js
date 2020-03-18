'use strict';

/*MODEL*/

//Board game { minesAroundCount: number , isShown: boolean, isMine: boolean, isMarked:  boolean}
var gBoard;

/* This is an object by which the board size is set (in this case: 4*4), and how many mines to put */
var gLevel = { SIZE: 4, MINES: 2 };
var gMinesCount;


/* This is an object in which you can keep and update the current game state: 
 *   isOn – boolean, when true we let the user play 
 *   shownCount: how many cells are shown 
 *   markedCount: how many cells are marked (with a flag)
 *   secsPassed: how many seconds passed */
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 };

/*DOM*/
const MINE = '*'
const MARK = '#'
const EMPTY = ''

/*GLOBAL VARIABLES*/
var gIsGameStarted = false

/*function*/
//called when page loads
function initGame() {
    gGame.isOn = true
    gIsGameStarted = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gBoard = buildBoard()
    renderBoard(gBoard)
}

//Builds the board Set mines at random locations Call setMinesNegsCount() Return the created board
function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i].push(cell)
        }//END FOR
    }//END FOR

    return board
}//END FUNCTION - buildBoard

//Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        var row = board[i]
        for (var j = 0; j < row.length; j++) {
            if (row[j].isMine) continue
            var pos = { i, j }
            row[j].minesAroundCount = getMinesAroundCount(pos, board)
        }
    }
}
function getMinesAroundCount(pos, board) {
    var minesCount = 0
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= board.length) continue
            if (j === pos.j && i === pos.i) continue
            var cell = board[i][j]
            if (cell.isMine) minesCount++
        }
    }
    return minesCount
}

//Render the board as a <table> to the page
function renderBoard(board) {
    var elBoard = document.querySelector('.board-game')
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>\n`
        var row = board[i]
        for (var j = 0; j < row.length; j++) {
            var cell = board[i][j]
            var nameClass = 'class="cell-' + i + '-' + j + '"'

            strHTML += `\t<td ${nameClass}  onclick="cellClicked(this, ${i}, ${j})"  oncontextmenu="cellMarked(this,${i}, ${j}, event)">`
            if (cell.isMine && cell.isShown) {
                strHTML += MINE
            }
            else if (cell.minesAroundCount > 0 && cell.isShown) {
                strHTML += cell.minesAroundCount
            }
            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }
    elBoard.innerHTML = strHTML

}

//Called when a cell (td) is clicked
function cellClicked(elCell, iLoc, jLoc) {
    if (!gGame.isOn) return

    var cell = gBoard[iLoc][jLoc]

    if (cell.isMarked || cell.isShown) return

    if (!gIsGameStarted) {
        gBoard[iLoc][jLoc].isShown = true
        startGame()
        expandShown(gBoard, elCell, iLoc, jLoc)
    } else if (cell.isMine) {
        openCell(gBoard, elCell, iLoc, jLoc)
        elCell.innerText = MINE
        gameOver('Game Over!!')
    } else {
        expandShown(gBoard, elCell, iLoc, jLoc)
        if (checkGameOver()) gameOver('Victory!!')
    }
}

/* Called on right click to mark a cell (suspected to be a mine) 
Search the web(and implement) how to hide the context menu on right click */
function cellMarked(elCell, iLoc, jLoc, e) {
    e.preventDefault()//Cancel context-menu 
    if (!gGame.isOn) return

    var cell = gBoard[iLoc][jLoc]
    if (cell.isShown) return

    else if (cell.isMarked) {
        elCell.innerText = EMPTY
        gGame.markedCount--

    } else {
        elCell.innerText = MARK
        gGame.markedCount++
    }
    gBoard[iLoc][jLoc].isShown = false
    if (checkGameOver()) gameOver('Victory!!')
}

//Game ends when all mines are marked and all the other cells are shown
function checkGameOver() {
    var cellsBoardCount = gLevel.SIZE ** 2
    return (gGame.shownCount + gGame.markedCount === cellsBoardCount)

}
function gameOver(mess) {
    console.log(mess)
    gGame.isOn = false
}

/**When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors.
 * NOTE: start with a basic implementation that only opens the non - mine 1st degree neighbors 
 * BONUS: if you have the time later, try to work more like the real algorithm
 * (see description at the Bonuses section below) */
function expandShown(board, elCell, i, j) {
    openCell(board, elCell, i, j)
    var cell = board[i][j]
    if (cell.minesAroundCount === 0) {
        openEmptyNegsCell(board, i, j)

    } else {
        elCell.innerText = board[i][j].minesAroundCount
        // return
    }
}

function setRandomMines(board) {
    var emptyPlaces = getEmptyPlaces(board)
    for (var count = 0; count < gLevel.MINES; count++) {
        var idx = getRandomInteger(0, emptyPlaces.length - 1)

        var place = emptyPlaces.splice(idx, 1)
        place = place[0]
        board[place.i][place.j].isMine = true
    }
}


function startGame() {
    gIsGameStarted = true
    setRandomMines(gBoard)
    setMinesNegsCount(gBoard)
}


function openEmptyNegsCell(board, iLoc, jLoc) {
    for (var i = iLoc - 1; i <= iLoc + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = jLoc - 1; j <= jLoc + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === iLoc && j === jLoc) continue
            var cell = board[i][j]
            if (!cell.isShown && !cell.isMine) {
                //Gets the element in coordinates i and j
                var elclass = 'cell-' + i + '-' + j
                var elCurrCell = document.querySelector('.' + elclass)
                openCell(board, elCurrCell, i, j)
            }//END IF
        }//END FOR
    }//END FOR
}//END function 'openEmptyNegsCell()'

function openCell(board, elCell, iLco, jLoc) {
    board[iLco][jLoc].isShown = true//Show the cell
    elCell.classList.add('shown')
    gGame.shownCount++
}

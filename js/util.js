
//returns random number between min to max
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

//Returns the empty places of the game board  in array
function getEmptyPlaces(board) {
    var emptyPlaces = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j]
            if (!cell.isShown && !cell.isMine && !cell.isMarked) {
                if (gStartLoc.i !== i && gStartLoc.j !== j) {
                    emptyPlaces.push({ i, j })
                }
            }
        }//END FOR
    }//END FOR
    return emptyPlaces
}

/** get element of cell by position (object {i, j})*/
function getElCellByPos(pos) {
    var elNameclass = '.cell-' + pos.i + '-' + pos.j//Name class of the element
    return document.querySelector(elNameclass)
}

/* Get milliseconds - time and returns string of time by the format 00:00 (mm:ss) */
function milToFormatTime(time) {
    var s = Math.floor((time / 1000) % 60)//seconds
    var m = Math.floor(time / (1000 * 60))//minutes
    //Add '0' before the number if is one-digit number
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    return m + ":" + s;
}//End milToFormatTime function

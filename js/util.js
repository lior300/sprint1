
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
                emptyPlaces.push({ i, j })
            }
        }//END FOR
    }//END FOR
    return emptyPlaces
}


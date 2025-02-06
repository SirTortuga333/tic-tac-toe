const gameBoard = (function(){

    // The board is a 1D array orderer like this
    // 0 1 2
    // 3 4 5
    // 6 7 8
    const board = [];

    for (let i = 0; i < 9; i++) {
        board.push(cell());
    }

    console.log(board)
    
    function markCell(cell, player){

        // Invalid move on already marked cell
        if(board[cell].getMark() !== ' ') return;

        board[cell].getClaimed(player);

    }

    // Print board to console
    function printBoard(){
        console.log(board[0].getMark(),'|', board[1].getMark(),'|', board[2].getMark());
        console.log(board[3].getMark(),'|', board[4].getMark(),'|', board[5].getMark());
        console.log(board[6].getMark(),'|', board[7].getMark(),'|', board[8].getMark());
    }
    
    return {printBoard, markCell}
})();

function cell(){
    let mark = ' ';

    function getClaimed(player){
        mark = player;
    }

    function getMark(){
        return mark;
    }

    return {getClaimed, getMark};
}

const gameController = (function(playerOneName = "Player One", playerTwoName = "Player Two"){

    const players = [
        {
            name: playerOneName,
            mark: 'X'
        },{
            name: playerTwoName,
            mark: 'O'
        }
    ]

    let activePlayer = players[0];
    
    function switchPlayerTurn(){
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    function getActivePlayer(){
        return activePlayer;
    }

    function printNewRound(){
        gameBoard.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    function playRound(cell){

        // Logic for sanitize user's input (number and 0-8)

        console.log(`${getActivePlayer().name} claimed cell ${cell}`);
        gameBoard.markCell(cell, getActivePlayer().mark);


        // Winning logic

        switchPlayerTurn();
        printNewRound();
    }


    // Initial print
    printNewRound();

    return {playRound}
})();
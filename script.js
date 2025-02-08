const gameBoard = (function(){

    // The board is a 1D array orderer like this
    // 0 1 2
    // 3 4 5
    // 6 7 8
    const board = [];

    for (let i = 0; i < 9; i++) {
        board.push(cell());
    }
    
    function markCell(cell, player){

        // Invalid move on already marked cell
        if(board[cell].getMark() !== ' ') return true;

        board[cell].getClaimed(player);
        return false;
    }

    // Print board to console
    function printBoard(){
        console.log(board[0].getMark(),'|', board[1].getMark(),'|', board[2].getMark());
        console.log(board[3].getMark(),'|', board[4].getMark(),'|', board[5].getMark());
        console.log(board[6].getMark(),'|', board[7].getMark(),'|', board[8].getMark());
    }
    
    function getBoard(){
        return board;
    }

    return {printBoard, markCell, getBoard}
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

const screenController = (function(doc){
    const gameContainer = doc.querySelector('.game-container');
    const messageDisplay = doc.querySelector('.player-turn');

    function displayActivePlayer(player){
        messageDisplay.textContent = `${player}'s turn.`;
    }

    function displayGameBoard(){

        // delete previous buttons
        const previousBoard = gameContainer.querySelectorAll('*');
        previousBoard.forEach(element => {
            gameContainer.removeChild(element);
        });

        // Create new buttons
        for (let index = 0; index < gameBoard.getBoard().length; index++) {
            const cellButton = doc.createElement('button');
            cellButton.dataset.index = index;
            console.log(gameBoard.getBoard()[index].getMark())
            cellButton.textContent = gameBoard.getBoard()[index].getMark();

            // Only empty cells are claimable
            if(cellButton.textContent === ' '){
                cellButton.addEventListener('click', playerClaimCell);
            }

            gameContainer.appendChild(cellButton);
        }
    }   

    displayGameBoard()
    return {displayActivePlayer, displayGameBoard}

})(document);

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

    // Save all winning combinations
    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]

    function checkWin(){
        // We loop all combinations, deconstruct them and check if the active player did a winning move
        for (let index = 0; index < winningCombinations.length; index++) {
            const [a,b,c] = winningCombinations[index];
            if (
                gameBoard.getBoard()[a].getMark() === getActivePlayer().mark &&
                gameBoard.getBoard()[b].getMark() === getActivePlayer().mark &&
                gameBoard.getBoard()[c].getMark() === getActivePlayer().mark
            ){
                screenController.displayGameBoard();
                return true
            }
        }
        return false
    
    }

    // we loop through all the board to check every tile is mark
    function checkTie(){
        screenController.displayGameBoard();
        return gameBoard.getBoard().every((cell) => cell.getMark() !== ' ');
    }

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
        if(typeof(cell) !== 'number' || (cell < 0 && cell > 8)){
            console.log(`Input must be a number between 0 - 8.`);
            return;
        }

        console.log(`${getActivePlayer().name} claimed cell ${cell}`);
        // Loop to check if player tries to claim a claimed cell
        let invalidMove = gameBoard.markCell(cell, getActivePlayer().mark);
        while (invalidMove) {
            console.log(`${cell} is already claimed, please select another cell.`);
            return false;
        }

        // Winning logic
        if(checkWin()){
            printNewRound();
            console.log(`${getActivePlayer().name} has won! Game Over.`);
            return false;
        }
        if(checkTie()){
            printNewRound();
            console.log('The board is full, the game is a tie! Nobody Wins.');
            return false;
        }

        switchPlayerTurn();
        printNewRound();
        screenController.displayGameBoard();
        screenController.displayActivePlayer(getActivePlayer().name);
    }

    // Initial print
    printNewRound();
    screenController.displayGameBoard();
    screenController.displayActivePlayer(getActivePlayer().name);

    return {playRound, printNewRound, getActivePlayer}
})();

// Function for Event listeners on Cell Buttons
function playerClaimCell(e){
    // It only needs gameController.playRound
    gameController.playRound(parseInt(e.target.dataset.index))
}
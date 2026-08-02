/*
The Odin Project - JavaScript Course 
Tic Tac Toe Assignment

Lorenzo Cane
*/

/*********************************************************************************
*********************************************************************************/
// MODULES

/* Player Module
Create player and store infos
*/
const Player = (name, marker) =>{
    return {name, marker};
};

//-------------------------------------------------------------------------------
/* Game Board Module
Store board status and manage cells
*/

const GameBoard = (() =>{
    // Visualize board
    const board = [ "","","",
                    "","","",
                    "","",""
    ];

    // Board management
    const getBoard = () => board;
    //Check if board is full
    const isFull = () => board.every((cell) => cell !== "");
    // Reset
    const resetBoard = () => board.fill("");

    // Cells management
    const getCell = (index) => board[index];

    const setCell = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };


    return { getBoard, isFull, resetBoard, getCell, setCell};
})();


//-------------------------------------------------------------------------------
/* Game Controller Module
Game flow, turns and win
*/

const GameController = (() => {
    // Std conditions
    let currentPlayer = 0;
    let gameOver = false;

    //Winning conditions:
    const winningCond = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6],            // diagonals
    ];
    
    // Create Players
    const players = [
        Player("Player 1", "X"),
        Player("Player 2", "O")
    ];

    //Playing

    const getCurrentPlayer = () => players[currentPlayer];

    const switchPlayer = () => {
        currentPlayer = currentPlayer === 0 ? 1 : 0;
    };

    const checkWin = () => {
        const board = GameBoard.getBoard();
        for (const cond of winningCond) {
            const [a,b,c] = cond;
            if (board[a] && board[a] === board[b] && board[a] === board[c]){
                return {winner : getCurrentPlayer(), cond};
            }
        }
        return null;
    };

    const playRound = (index) => {
        if (gameOver) return null;

        const placed = GameBoard.setCell(index, getCurrentPlayer().marker);
        if (!placed) return null;

        //Check winner and draw after placing a marker
        const result = checkWin();

        if (result) {
            gameOver = true;
            return {type: "win", player: result.winner, condition: result.cond};
        }

        if (GameBoard.isFull()) {
            gameOver = true;
            return {type: "tie"};
        }

        //switch turn
        switchPlayer();
        return {type: "continue", nextPlayer: getCurrentPlayer()};
    };

    const restartGame = () => {
        GameBoard.resetBoard();
        currentPlayer = 0;
        gameOver = false;
    };

    const isGameOver = () => gameOver;

    return { getCurrentPlayer, playRound, restartGame, isGameOver};   

})();

//-------------------------------------------------------------------------------
/* Display Control Module
DOM control
*/


const DisplayController = (() => {
    const boardContainer = document.getElementById("board");
    const display = document.getElementById("status");
    const restartBtn = document.getElementById("restartBtn");

    const renderBoard = () =>  {
        boardContainer.innerHTML = "";

        const board = GameBoard.getBoard();
        board.forEach((marker, index) => {
            //create cell into the board
            const cell = document.createElement("button");
            cell.classList.add("cellBtn");
            cell.dataset.index = index;
            cell.textContent = marker;

            if (marker === "X") cell.classList.add("markerX");
            if (marker === "O") cell.classList.add("markerO");

            cell.addEventListener("click", cellClick);
            boardContainer.appendChild(cell);
        });
    };

    // Status update
    const updateStatus = (message) =>  {
        display.textContent = message;
    };

    // Winning combos 
    const highlightCombo = (cond) => {
        const cells = boardContainer.querySelectorAll(".cell");
        cond.forEach((index) => {
            cells[index].classList.add("winning");
        })
    };

    //Cell selection
    const cellClick = (e) => {
        const index = parseInt(e.target.dataset.index);
        const result = GameController.playRound(index);

        if (!result) return;
        
        renderBoard();

        if (result.type === "win") {
            updateStatus(`${result.player.name} (${result.player.marker}) wins!`);
            highlightCombo(result.condition);

        } else if (result.type === "tie") {
            updateStatus("Game Tied!");
    
        } else {
            updateStatus(`${result.nextPlayer.name} (${result.nextPlayer.marker}), is now your turn!`)
        }
    };

    // Results

    const handleRestart = () => {
        GameController.restartGame();
        renderBoard();
        updateStatus(`${GameController.getCurrentPlayer().name}'s turn (${GameController.getCurrentPlayer().marker})`);

    };

    // Init Game
    const init = () => {
        restartBtn.addEventListener("click", handleRestart);
        renderBoard();
        updateStatus(`${GameController.getCurrentPlayer().name}'s turn (${GameController.getCurrentPlayer().marker})`);
    }


    init();

    return { renderBoard, updateStatus};
})();

const Gameboard = (() => {
    let board = [
                 ["", "", ""],
                 ["", "", ""],
                 ["", "", ""]
                ]

    const placeToken = (index, token) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        if (board[row][col] === "") {
            board[row][col] = token;
            return true
        } else {
            return false;
        }
    };

    const getBoard = () => board;

    const resetBoard = () => {
        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                board[i][j] = ""
            }
        }
    }

    return {
        placeToken,
        getBoard,
        resetBoard
    }
})()

const Player = (name, token) => {
    return {
        name,
        token
    }
}

const Controller = (() => {
    const player1 = Player("Player 1", "X")
    const player2 = Player("Player 2", "O")

    const players = [player1, player2]

    let filledCells = 0;

    let activePlayer = players[0]

    const switchTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const getWinner = (token) => {
        const winningPlayer = players.find(player => player.token === token);
        return winningPlayer ? winningPlayer.name : null;
    }

    const checkWinner = (board) => {
        for (let i = 0; i < 3; i++){
            if (board[i][0] == board[i][1] && 
                board[i][2] == board[i][1] &&
                board[i][0] !== ""){
                    return getWinner(board[i][0])
            }

            if (board[0][i] == board[1][i] &&
                board[1][i] == board[2][i] &&
                board[0][i] !== ""){
                    return getWinner(board[0][1])
            }

        }

        if ((board[0][0] == board[1][1] &&
            board[1][1] == board[2][2] &&
            board[0][0] !== "") ||
            (board[0][2] == board[1][1] &&
             board[1][1] == board[2][0] &&
             board[1][1] !== "")){
                return getWinner(board[1][1])
            }

        return null;
            
    }
        
    const resetGame = () => {
        Gameboard.resetBoard()
        activePlayer = players[0]
        filledCells = 0
    }



    const playRound = (index) => {
        let placed = Gameboard.placeToken(index, activePlayer.token)
        let winner = checkWinner(Gameboard.getBoard())
        filledCells++;
        if (filledCells === 9){
            alert("Draw")
        }
        if (placed){
            switchTurn()
        }
        if (winner != null){
            ScreenController.showWinnerMessage(winner);
            resetGame()
        }
    }

    return {
        playRound,
        getActivePlayer,
        resetGame
        
    }
})()


const ScreenController = (() => {
    const cells = document.querySelectorAll(".cell")
    const board = Gameboard.getBoard()
    const isTurn = document.querySelector(".turn")
    const resetButton = document.getElementById("reset")

    const setIsTurn = () => {
        isTurn.textContent = `${Controller.getActivePlayer().name}'s turn`;
    }

    const showWinnerMessage = (winner) => {
        const winnerMessage = document.getElementById("winner-message");
        const winningPlayer = document.getElementById("winning-player");
        winningPlayer.textContent = winner;
        winnerMessage.showModal()
        triggerConfetti();
        setTimeout(() => {
            winnerMessage.close()
        }, 2000)
    }

    const updateCells = () => {
        for (let i = 0; i < cells.length; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            cells[i].textContent = board[row][col];
        }
    };

    const triggerConfetti = () => {
        document.getElementById("confetti-holder").style.display = "block";
        const confettiSettings = {
            target: "confetti-holder", 
            max: 180,
            size: 1, 
            animate: true, 
            respawn: true, 
            props: ['circle', 'square', 'triangle', 'line'], 
            colors: [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]], 
            clock: 25, 
            interval: null, 
            rotate: false, 
            start_from_edge: true, // Should confettis spawn at the top/bottom of the screen?
            width: window.innerWidth, // Canvas width (as int, in px)
            height: window.innerHeight // Canvas height (as int, in px)
        };

        const confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
        setTimeout(() => {
            document.getElementById("confetti-holder").style.display = "none";
        }, 2000)
    }

    const addEventListeners = () => {
        for (const cell of cells) { 
            cell.addEventListener("click", () => {
                const cellKey = parseInt(cell.getAttribute("data-key"));
                Controller.playRound(cellKey)
                setIsTurn()
                updateCells()
            })
                
        }

        resetButton.addEventListener("click", () => {
            Controller.resetGame()
            updateCells()
            setIsTurn()
        })
    }

    return {
        addEventListeners,
        showWinnerMessage
    }
})()

ScreenController.addEventListeners()


// Gameboard module
const Gameboard = (() => {
    const BOARD_SIZE = 3;
    let _board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(""));

    const placeToken = (index, token) => {
        const row = Math.floor(index / BOARD_SIZE);
        const col = index % BOARD_SIZE;
        if (_board[row][col] === "") {
            _board[row][col] = token;
            return true;
        } else {
            return false;
        }
    };

    const getBoard = () => _board;

    const resetBoard = () => { 
        for (let i = 0; i < BOARD_SIZE; i++){
            for (let j = 0; j < BOARD_SIZE; j++){
                _board[i][j] = "" } 
        } 
    }

    return {
        placeToken,
        getBoard,
        resetBoard,
    };
})();

// Player factory function
const Player = (name, token) => ({ name, token });

// Controller module
const Controller = (() => {
    const BOARD_SIZE = 3;
    const TOTAL_CELLS = BOARD_SIZE ** 2;
    let player1;
    let player2;
    let players = [player1, player2];
    let filledCells = 0;
    let _activePlayer;

    const switchTurn = () => {
        _activePlayer = _activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => _activePlayer;

    const getWinner = (token) => {
        const winningPlayer = players.find((player) => player.token === token);
        return winningPlayer ? winningPlayer.name : null;
    };

    const checkWinner = (board) => {
        for (let i = 0; i < BOARD_SIZE; i++) {
            if (
                board[i][0] == board[i][1] &&
                board[i][2] == board[i][1] &&
                board[i][0] !== ""
            ) {
                return getWinner(board[0][0]);
            }

            if (
                board[0][i] == board[1][i] &&
                board[1][i] == board[2][i] &&
                board[0][i] !== ""
            ) {
                return getWinner(board[0][1]);
            }
        }

        if (
            (board[0][0] == board[1][1] &&
                board[1][1] == board[2][2] &&
                board[0][0] !== "") ||
            (board[0][2] == board[1][1] &&
                board[1][1] == board[2][0] &&
                board[1][1] !== "")
        ) {
            return getWinner(board[1][1]);
        }

        return null;
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        _activePlayer = players[0];
        filledCells = 0;
        ScreenController.updateAllCells();
    };

    const initializePlayers = () => {
        const player1Name = document.getElementById("player1-name").value || "Player 1";
        const player2Name = document.getElementById("player2-name").value || "Player 2";
        player1 = Player(player1Name, "X");
        player2 = Player(player2Name, "O");
        players = [player1, player2];
        _activePlayer = players[0];
    };

    const playRound = (index) => {
        const placed = Gameboard.placeToken(index, _activePlayer.token);
        const winner = checkWinner(Gameboard.getBoard());
        filledCells++;
        if (placed) {
            switchTurn();
        }
        if (winner != null) {
            ScreenController.showWinnerMessage(winner);
            resetGame();
            return;
        }
        if (filledCells === TOTAL_CELLS) {
            alert("Draw");
            resetGame();
        }
    };

    return {
        playRound,
        getActivePlayer,
        resetGame,
        initializePlayers,
    };
})();

// ScreenController module
const ScreenController = (() => {
    const canvas = document.querySelector("canvas");
    const cells = document.querySelectorAll(".cell");
    const isTurn = document.querySelector(".turn");
    const board = Gameboard.getBoard();

    const setIsTurn = () => {
        isTurn.textContent = `${Controller.getActivePlayer().name}'s turn`;
    };

    const showWinnerMessage = (winner) => {
        const winnerMessage = document.getElementById("winner-message");
        const winningPlayer = document.getElementById("winning-player");
        winningPlayer.textContent = winner;
        winnerMessage.showModal();
        triggerConfetti();
        setTimeout(() => {
            winnerMessage.close();
        }, 2000);
    };

    const updateCell = (index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        cells[index].textContent = board[row][col];
    };

    const updateAllCells = () => {
        for (let i = 0; i < cells.length; i++) {
            updateCell(i);
        }
    };

    const triggerConfetti = () => {
        canvas.style.display = "block";
        const confettiSettings = {
            target: "confetti-holder",
            max: 180,
            size: 1,
            animate: true,
            respawn: true,
            props: ["circle", "square", "triangle", "line"],
            colors: [
                [165, 104, 246],
                [230, 61, 135],
                [0, 199, 228],
                [253, 214, 126],
            ],
            clock: 25,
            interval: null,
            rotate: false,
            start_from_edge: true,
            width: window.innerWidth,
            height: window.innerHeight,
        };

        const confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
        setTimeout(() => {
            canvas.style.display = "none";
        }, 2000);
    };

    const addEventListeners = () => {
        const resetButton = document.getElementById("reset");
        const startGameBtn = document.getElementById("start-game");
        const playerNames = document.querySelector(".player-names");
        const desc = document.querySelector(".desc");
        const container = document.querySelector(".container");

        container.addEventListener("click", (event) => {
            if (event.target.classList.contains("cell")) {
                const cell = event.target;
                const cellKey = parseInt(cell.getAttribute("data-key"));
                Controller.playRound(cellKey);
                setIsTurn();
                updateCell(cellKey);
            }
        });

        resetButton.addEventListener("click", () => {
            Controller.resetGame();
            setIsTurn();
        });

        startGameBtn.addEventListener("click", () => {
            Controller.initializePlayers();
            setIsTurn();
            playerNames.style.display = "none";
            container.style.display = "grid";
            desc.style.display = "block";
        });
    };

    return {
        addEventListeners,
        showWinnerMessage,
        updateAllCells,
    };
})();

ScreenController.addEventListeners();
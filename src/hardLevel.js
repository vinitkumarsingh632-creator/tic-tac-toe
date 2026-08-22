const grids = document.querySelectorAll(".gridParent div");
const gridParent = document.querySelector(".gridParent");
const decisionPanel = document.getElementById("decisionPanel");
const message = document.getElementById("message");

document.getElementById("restartBtn").addEventListener("click", () => {
    location.reload();
});

const winningCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let move = Math.random() > 0.5 ? "user" : "bot";

if (move === "user") {
    showPanel("Your turn! Make your move");
}

function showPanel(text) {
    message.textContent = text;
    decisionPanel.style.display = "flex";
}

function getBoard() {
    const board = [];

    grids.forEach(grid => {
        board.push(grid.textContent.trim());
    });

    return board;
}

function availableMoves(board) {
    const moves = [];

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            moves.push(i);
        }
    }

    return moves;
}

function checkWinner(board) {
    for (const [a, b, c] of winningCombination) {
        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            return board[a];
        }
    }

    return null;
}

function checkDraw(board) {
    return availableMoves(board).length === 0;
}

function minimax(board, isBotTurn) {
    const winner = checkWinner(board);

    if (winner === "O") return 1;
    if (winner === "X") return -1;
    if (checkDraw(board)) return 0;

    if (isBotTurn) {
        let bestScore = -Infinity;

        for (const move of availableMoves(board)) {
            board[move] = "O";

            const score = minimax(board, false);

            board[move] = "";

            bestScore = Math.max(bestScore, score);
        }

        return bestScore;
    }

    let bestScore = Infinity;

    for (const move of availableMoves(board)) {
        board[move] = "X";

        const score = minimax(board, true);

        board[move] = "";

        bestScore = Math.min(bestScore, score);
    }

    return bestScore;
}

function findBestMove() {
    const board = getBoard();

    let bestScore = -Infinity;
    let bestMove = null;

    for (const move of availableMoves(board)) {
        board[move] = "O";

        const score = minimax(board, false);

        board[move] = "";

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    return bestMove;
}

function makeBotMove() {
    const bestMove = findBestMove();

    if (bestMove === null) return;

    grids[bestMove].textContent = "O";
    grids[bestMove].style.color = 'red'

    const board = getBoard();

    if (checkWinner(board) === "O") {
        showPanel("O win");
        gridParent.removeEventListener("click", clickHandler);
        return;
    }

    if (checkDraw(board)) {
        showPanel("Draw");
        gridParent.removeEventListener("click", clickHandler);
        return;
    }

    move = "user";
    showPanel("Your turn! Make your move");
}

function clickHandler(event) {
    if (move !== "user") return;

    const target = event.target;
    const userMove = Number(target.className);
    const board = getBoard();

    if (board[userMove] !== "") {
        showPanel("Already Filled");
        return;
    }

    grids[userMove].textContent = "X";
    grids[userMove].style.color = 'green'

    const updatedBoard = getBoard();

    if (checkWinner(updatedBoard) === "X") {
        showPanel("X win");
        gridParent.removeEventListener("click", clickHandler);
        return;
    }

    if (checkDraw(updatedBoard)) {
        showPanel("Draw");
        gridParent.removeEventListener("click", clickHandler);
        return;
    }

    move = "bot";

    setTimeout(makeBotMove, 1000);
}

if (move === "bot") {
    setTimeout(makeBotMove, 1000);
}

gridParent.addEventListener("click", clickHandler);
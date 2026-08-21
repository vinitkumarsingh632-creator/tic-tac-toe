const grids = document.querySelectorAll(".gridParent div");
const gridParent = document.querySelector(".gridParent");
const decisionPanel = document.getElementById("decisionPanel");
const message = document.getElementById("message");
let move = Math.random() > 0.5 ? "user" : "bot";
if (move == 'user'){
    showPanel('Your First Move')
}
let gameOver = false;



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

function availableMoves() {
    const moves = [];

    grids.forEach((grid, index) => {
        if (grid.textContent.trim() === "") {
            moves.push(index);
        }
    });

    return moves;
}

function checkWinner() {
    for (const combination of winningCombination) {
        const [a, b, c] = combination;

        const first = grids[a].textContent.trim();

        if (
            first !== "" &&
            first === grids[b].textContent.trim() &&
            first === grids[c].textContent.trim()
        ) {
            return first === "X" ? "X Win" : "O Win";
        }
    }

    return null;
}

function showPanel(text) {
    message.textContent = text;
    decisionPanel.style.display = "flex";
}

function checkGameState() {
    const winner = checkWinner();

    if (winner !== null) {
        gameOver = true;
        showPanel(winner);
        gridParent.removeEventListener("click", handleClick);
        return true;
    }

    if (availableMoves().length === 0) {
        gameOver = true;
        showPanel("Draw");
        gridParent.removeEventListener("click", handleClick);
        return true;
    }

    return false;
}

function makeBotMove() {
    if (gameOver) {
        return;
    }

    const moves = availableMoves();

    if (moves.length === 0) {
        checkGameState();
        return;
    }

    const randomIndex = Math.floor(Math.random() * moves.length);
    const position = moves[randomIndex];

    grids[position].textContent = "O";

    if (checkGameState()) {
        return;
    }

    move = "user";
}

function handleClick(event) {
    if (gameOver || move !== "user") {
        return;
    }

    const target = event.target;

    if (!target.matches(".gridParent div")) {
        return;
    }

    if (target.textContent.trim() !== "") {
        showPanel("Already Filled");
        return;
    }

    target.textContent = "X";

    if (checkGameState()) {
        return;
    }

    move = "bot";

    setTimeout(() => {
        makeBotMove();
    }, 1000);
}

gridParent.addEventListener("click", handleClick);

if (move === "bot") {
    makeBotMove();
}
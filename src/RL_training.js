const Q = {};

const alpha = 0.5;   // learning rate
const gamma = 0.9;   // discount factor
const epsilon = 0.2; // exploration


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


function checkAvailableMoves(board) {
    const availableMoves = [];

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            availableMoves.push(i);
        }
    }

    return availableMoves;
}


function checkWinner(board) {
    const xMoves = [];
    const oMoves = [];

    for (let i = 0; i < 9; i++) {
        if (board[i] === "X") {
            xMoves.push(i);
        }
        else if (board[i] === "O") {
            oMoves.push(i);
        }
    }

    for (let i = 0; i < winningCombination.length; i++) {

        if (winningCombination[i].every(position =>
            xMoves.includes(position)
        )) {
            return "X Win";
        }

        if (winningCombination[i].every(position =>
            oMoves.includes(position)
        )) {
            return "O Win";
        }
    }

    return false;
}


function checkDraw(board) {
    return checkAvailableMoves(board).length === 0;
}


// Convert board into a unique state
function getState(board) {
    return JSON.stringify(board);
}


// Initialize a state in Q-table
function initializeState(state, board) {

    if (!Q[state]) {

        Q[state] = {};

        const availableMoves = checkAvailableMoves(board);

        for (const action of availableMoves) {
            Q[state][action] = 0;
        }
    }
}


// Get action with highest Q-value
function getBestAction(state) {

    const actions = Object.keys(Q[state]);

    return Number(
        actions.reduce((best, current) => {

            return Q[state][current] > Q[state][best]
                ? current
                : best;

        })
    );
}


let episodes = 0;

while (episodes < 200) {

    const board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    let previousState = null;
    let previousAction = null;
    let previousReward = 0;


    while (true) {

        // =====================================
        // X RANDOM MOVE
        // =====================================

        const availableMoves = checkAvailableMoves(board);

        const randomIndex =
            Math.floor(Math.random() * availableMoves.length);

        const xAction = availableMoves[randomIndex];

        board[xAction] = "X";


        // =====================================
        // X WINS
        // =====================================

        if (checkWinner(board) === "X Win") {

            if (previousState !== null) {

                const oldQ =
                    Q[previousState][previousAction];

                const reward = -100;

                const futureQ = 0;

                Q[previousState][previousAction] =
                    oldQ +
                    alpha * (
                        reward +
                        gamma * futureQ -
                        oldQ
                    );
            }

            break;
        }


        // =====================================
        // DRAW AFTER X
        // =====================================

        if (checkDraw(board)) {

            if (previousState !== null) {

                const oldQ =
                    Q[previousState][previousAction];

                const reward = 0;

                const futureQ = 0;

                Q[previousState][previousAction] =
                    oldQ +
                    alpha * (
                        reward +
                        gamma * futureQ -
                        oldQ
                    );
            }

            break;
        }


        // =====================================
        // CURRENT STATE FOR O
        // =====================================

        const state = getState(board);


        // =====================================
        // INITIALIZE Q[state]
        // =====================================

        initializeState(state, board);


        // =====================================
        // UPDATE PREVIOUS O ACTION
        // =====================================

        if (previousState !== null) {

            const futureQ =
                Math.max(
                    ...Object.values(Q[state])
                );

            const oldQ =
                Q[previousState][previousAction];

            Q[previousState][previousAction] =
                oldQ +
                alpha * (
                    previousReward +
                    gamma * futureQ -
                    oldQ
                );
        }


        // =====================================
        // EPSILON-GREEDY
        // =====================================

        let action;

        if (Math.random() < epsilon) {

            // -----------------------------
            // EXPLORE
            // -----------------------------

            const moves =
                checkAvailableMoves(board);

            const randomIndex =
                Math.floor(Math.random() * moves.length);

            action = moves[randomIndex];

        }
        else {

            // -----------------------------
            // EXPLOIT
            // -----------------------------

            action = getBestAction(state);
        }


        // =====================================
        // SAVE CURRENT DECISION
        // =====================================

        previousState = state;
        previousAction = action;


        // =====================================
        // O MOVES
        // =====================================

        board[action] = "O";


        // =====================================
        // O WINS
        // =====================================

        if (checkWinner(board) === "O Win") {

            const reward = 100;

            const oldQ =
                Q[state][action];

            const futureQ = 0;

            Q[state][action] =
                oldQ +
                alpha * (
                    reward +
                    gamma * futureQ -
                    oldQ
                );

            break;
        }


        // =====================================
        // DRAW AFTER O
        // =====================================

        if (checkDraw(board)) {

            const reward = 0;

            const oldQ =
                Q[state][action];

            const futureQ = 0;

            Q[state][action] =
                oldQ +
                alpha * (
                    reward +
                    gamma * futureQ -
                    oldQ
                );

            break;
        }

        previousReward = -5;
    }


    episodes++;
}


console.log(Q);
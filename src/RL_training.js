import fs from "fs";

const Q = {};

const alpha = 0.5;
const gamma = 0.9;
const epsilon = 0.2;

const episodes = 50000;

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
    const moves = [];

    for (let i = 0; i < 9; i++) {
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
    return checkAvailableMoves(board).length === 0;
}

function getState(board) {
    return JSON.stringify(board);
}

function initializeState(state, board) {
    if (Q[state]) return;

    Q[state] = {};

    for (const action of checkAvailableMoves(board)) {
        Q[state][action] = 0;
    }
}

function getRandomAction(board) {
    const moves = checkAvailableMoves(board);

    if (moves.length === 0) {
        return null;
    }

    return moves[
        Math.floor(Math.random() * moves.length)
    ];
}

function getBestAction(state) {
    const actions = Object.keys(Q[state]);

    let bestValue = -Infinity;
    let bestActions = [];

    for (const action of actions) {

        const value = Q[state][action];

        if (value > bestValue) {
            bestValue = value;
            bestActions = [Number(action)];
        }
        else if (value === bestValue) {
            bestActions.push(Number(action));
        }
    }

    return bestActions[
        Math.floor(Math.random() * bestActions.length)
    ];
}

function getAction(state, board) {

    if (Math.random() < epsilon) {
        return getRandomAction(board);
    }

    return getBestAction(state);
}

function getFutureQ(state) {

    const values = Object.values(Q[state]);

    if (values.length === 0) {
        return 0;
    }

    return Math.max(...values);
}

function updateQ(state, action, reward, futureQ) {

    const oldQ = Q[state][action];

    Q[state][action] =
        oldQ +
        alpha * (
            reward +
            gamma * futureQ -
            oldQ
        );
}

for (let episode = 0; episode < episodes; episode++) {

    const board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    let firstPlayer =
        Math.random() < 0.5 ? "X" : "O";

    if (firstPlayer === "O") {

        const oFirstAction = getRandomAction(board);

        board[oFirstAction] = "O";

        if (checkDraw(board)) {
            continue;
        }

        const xFirstResponse = getRandomAction(board);

        board[xFirstResponse] = "X";

        if (checkWinner(board) === "X" || checkDraw(board)) {
            continue;
        }

    } else {

        const xFirstAction = getRandomAction(board);

        board[xFirstAction] = "X";

        if (checkDraw(board)) {
            continue;
        }
    }

    while (true) {

        const state = getState(board);

        initializeState(state, board);

        const action = getAction(state, board);

        if (action === null) {
            break;
        }

        board[action] = "O";

        if (checkWinner(board) === "O") {

            updateQ(
                state,
                action,
                100,
                0
            );

            break;
        }

        if (checkDraw(board)) {

            updateQ(
                state,
                action,
                0,
                0
            );

            break;
        }

        const xAction = getRandomAction(board);

        board[xAction] = "X";

        if (checkWinner(board) === "X") {

            updateQ(
                state,
                action,
                -100,
                0
            );

            break;
        }

        if (checkDraw(board)) {

            updateQ(
                state,
                action,
                0,
                0
            );

            break;
        }

        const nextState = getState(board);

        initializeState(nextState, board);

        const futureQ = getFutureQ(nextState);

        updateQ(
            state,
            action,
            0,
            futureQ
        );
    }
}

const output = `
export const data = ${JSON.stringify(Q, null, 4)};
`;

fs.writeFileSync(
    "./RL_data.js",
    output
);

console.log("Training complete.");
console.log("Episodes:", episodes);
console.log("States:", Object.keys(Q).length);
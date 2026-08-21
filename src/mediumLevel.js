const { default: Lut3DNode } = require("three/examples/jsm/tsl/display/Lut3DNode.js");
const { computeMorphedAttributes } = require("three/examples/jsm/utils/BufferGeometryUtils.js");

const grids = document.querySelectorAll(".gridParent div");
const gridParent = document.querySelector(".gridParent");
const decisionPanel = document.getElementById("decisionPanel");
const message = document.getElementById("message");

let move = Math.random() > 0.5 ? 'user':'bot'

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

const center = 4
const corner = [0,2,6,8]

function availableMoves () {
    const avlMoves = []
    grids.forEach(e=>{
        let trimmed = e.textContent.trim()
        if(trimmed == "") avlMoves.push(e.className)
    })
return avlMoves
}


function checkWinner () {
    for(let combination of winningCombination){
        const [a ,b ,c] = combination
        let first = grids[a].textContent.trim()
        if(
            first != "" && first == grids[b].textContent.trim() && first == grids[c].textContent.trim()
        ){
            return first == "X"? 'X win':'Y win'
        }
    }
    return null

}

function showPanel(text) {
    message.textContent = text;
    decisionPanel.style.display = "flex";
}

function winningMove () {
    let X = []
    let Y = []
    let avlMoves = []
    let count = 0
    for(let items of grids){
         if(items.textContent.trim() == "X") X.push(count)
         else if (items.textContent.trim() == 'Y') Y.push(count)
         else avlMoves.push(count)
        count++
    }
    
}

function makeBotMove () {

}
const grids = document.querySelectorAll(".gridParent div");
let move = null
const decisionPanel = document.getElementById('decisionPanel')

const firstMove = Math.random()
if(firstMove > 0.5){
    move = 'user'
    console.log('User Move')
    // alert('User Move')
}
else{
    move = 'bot'
    console.log('Bot\'s Move')
}

// Available Moves

const winningCombination = [
    [1,2,3],[4,5,6],[7,8,9],
    [1,4,7],[2,5,8],[3,6,9],
    [1,5,9],[3,5,7]
]
function availableMoves() {
  const avlMoves = [];
  for (let moves of grids) {
    if (moves.textContent == ""){
        avlMoves.push(moves.className);
    }
  }
  return avlMoves;
}

function checkWinner() {
    let X = [];
    let O = [];

    for (let items of grids) {
        if (items.textContent === "X") {
            X.push(Number(items.className));
        }
        else if (items.textContent === "O") {
            O.push(Number(items.className));
        }
    }

    for (let combination of winningCombination) {

        if (combination.every(position => X.includes(position))) {
            return "X Win";
        }

        if (combination.every(position => O.includes(position))) {
            return "O Win";
        }
    }

    return null;
}

// Adding Click Event
if(move == 'bot'){
    const avlMoves = availableMoves()
    const botMove = Math.floor(Math.random() * avlMoves.length)
    const moves = grids[Math.max(avlMoves[botMove] - 1, 0)].textContent = 'O'
    move = 'user'
}

function checkDraw () {
  const avlMoves = availableMoves()
  if(avlMoves.length == 0) return 'draw'
}
const gridParent = document.getElementsByClassName("gridParent")[0];
const clickListener = gridParent.addEventListener("click", (event) => {
  const target = event.target;
  console.log(move)
  if(move == 'user'){
    console.log('User')
    const avlMoves = availableMoves()
    const avl = avlMoves.includes(target.className)
    if(!avl) {
      alert('Already filled')
      return;
    }
     target.textContent = "X";
        move = "bot";

     if(checkWinner() == 'X Win'){
      decisionPanel.style.display = 'block'
      removeEventListener('click',clickListener)
      return
     }
    setTimeout(()=>{
         const avlMoves = availableMoves()
    const botMove = Math.floor(Math.random() * avlMoves.length)
    console.log(avlMoves)
    console.log(botMove)
    const moves = grids[Math.max(avlMoves[botMove] - 1,0)].textContent = 'O'
    move = 'user'
    },1000)
  }
});







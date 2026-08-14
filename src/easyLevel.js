const grids = document.querySelectorAll(".gridParent div");
let move = null

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

// Adding Click Event
if(move == 'bot'){
    const avlMoves = availableMoves()
    const botMove = Math.floor(Math.random() * avlMoves.length)
    const moves = grids[botMove].textContent = 'O'
    move = 'user'
}
const gridParent = document.getElementsByClassName("gridParent")[0];
gridParent.addEventListener("click", (event) => {
  const target = event.target;
  console.log(move)
  if(move == 'user'){
    console.log('User')
    const avlMoves = availableMoves()
    if(avlMoves.includes(target.className)){
         target.textContent = 'X';
     move = 'bot'
    }
    else{
        alert('Already Filled')
    }
    setTimeout(()=>{
         const avlMoves = availableMoves()
    const botMove = Math.floor(Math.random() * avlMoves.length)
    console.log(avlMoves)
    console.log(botMove)
    const moves = grids[botMove].textContent = 'O'
    move = 'user'
    },1000)
  }
});







// Get references to HTML elements
const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");

// Game state
let cells = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;

// Winning combinations
const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// Render the board
function renderBoard() {
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.className = "w-20 h-20 bg-gray-200 text-2xl font-bold flex items-center justify-center border-2 border-gray-500 cursor-pointer hover:bg-gray-300";
    cellDiv.textContent = cell;
    cellDiv.addEventListener("click", () => handleMove(index));
    board.appendChild(cellDiv);
  });
}

// Handle a move
function handleMove(index) {
  if (!gameActive || cells[index]) return;

  cells[index] = currentPlayer;
  renderBoard();

  if (checkWinner()) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
  } else if (cells.every(cell => cell)) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

// Check for a winner
function checkWinner() {
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
  });
}

// Reset the game
resetBtn.addEventListener("click", () => {
  cells = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  renderBoard();
});

// Initial render
renderBoard();
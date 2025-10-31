// Get references to HTML elements
const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");

// Game state
let cells = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let winningPattern = []; // stores winning cell indices

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
    const isWinningCell = winningPattern.includes(index);
    cellDiv.className = `
      w-20 h-20 text-2xl font-bold flex items-center justify-center
      border-2 border-gray-500 cursor-pointer transition-colors duration-150
      ${isWinningCell ? 'bg-green-300' : 'bg-gray-200 hover:bg-gray-300'}
    `;
    cellDiv.textContent = cell;
    cellDiv.addEventListener("click", () => handleMove(index));
    board.appendChild(cellDiv);
  });
}

// Handle a move
function handleMove(index) {
  if (!gameActive || cells[index]) return;

  cells[index] = currentPlayer;

  const tickSound = document.getElementById("tick-sound");
  if (tickSound) {
    tickSound.currentTime = 0;
    tickSound.play();
  }

  winningPattern = getWinningPattern();
  renderBoard();

  if (winningPattern.length) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    launchConfetti();
  } else if (cells.every(cell => cell)) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}


// Check for a winner and return winning pattern
function getWinningPattern() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return pattern;
    }
  }
  return [];
}

// Launch confetti
function launchConfetti() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
  const winSound = document.getElementById("win-sound");
  if (winSound) {
    winSound.currentTime = 0;
    winSound.play();
  }
}

// Reset the game
resetBtn.addEventListener("click", () => {
  cells = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  winningPattern = [];
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  renderBoard();
});

// Initial render
renderBoard();
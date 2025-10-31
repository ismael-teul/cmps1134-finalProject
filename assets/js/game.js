// Get references to HTML elements
const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const updateNamesBtn = document.getElementById("update-names");

// Player name inputs
const playerXInput = document.getElementById("playerX");
const playerOInput = document.getElementById("playerO");

// Game state
let cells = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let winningPattern = [];
let playerXName = "Player X";
let playerOName = "Player O";
let scoreX = 0;
let scoreO = 0;
let roundsPlayed = 0;

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
    const winnerName = currentPlayer === "X" ? playerXName : playerOName;
    statusText.textContent = `${winnerName} wins this round!`;
    gameActive = false;
    launchConfetti();

    if (currentPlayer === "X") {
      scoreX++;
      document.getElementById("scoreX").textContent = `${playerXName}: ${scoreX}`;
    } else {
      scoreO++;
      document.getElementById("scoreO").textContent = `${playerOName}: ${scoreO}`;
    }

    roundsPlayed++;

    if (scoreX === 2 || scoreO === 2) {
      const matchWinner = scoreX > scoreO ? playerXName : playerOName;
      setTimeout(() => {
        statusText.textContent = `${matchWinner} wins the match!`;
        resetMatch();
      }, 500);
    } else if (roundsPlayed === 3) {
      const matchWinner = scoreX > scoreO ? playerXName : scoreO > scoreX ? playerOName : "No one";
      setTimeout(() => {
        statusText.textContent = `${matchWinner} wins the match!`;
        resetMatch();
      }, 500);
    }

  } else if (cells.every(cell => cell)) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    roundsPlayed++;

    if (roundsPlayed === 3) {
      const matchWinner = scoreX > scoreO ? playerXName : scoreO > scoreX ? playerOName : "No one";
      setTimeout(() => {
        statusText.textContent = `${matchWinner} wins the match!`;
        resetMatch();
      }, 500);
    }
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    const nextName = currentPlayer === "X" ? playerXName : playerOName;
    statusText.textContent = `${nextName}'s turn`;
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

// Reset the game (single round)
function resetGame() {
  const inputX = playerXInput.value.trim();
  const inputO = playerOInput.value.trim();
  playerXName = inputX || "Player X";
  playerOName = inputO || "Player O";

  cells = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  winningPattern = [];
  statusText.textContent = `${playerXName}'s turn`;
  document.getElementById("scoreX").textContent = `${playerXName}: ${scoreX}`;
  document.getElementById("scoreO").textContent = `${playerOName}: ${scoreO}`;
  renderBoard();
}

// Reset the full match
function resetMatch() {
  scoreX = 0;
  scoreO = 0;
  roundsPlayed = 0;
  resetGame();
}

// Button listeners
resetBtn.addEventListener("click", resetGame);

updateNamesBtn.addEventListener("click", () => {
  const inputX = playerXInput.value.trim();
  const inputO = playerOInput.value.trim();
  playerXName = inputX || "Player X";
  playerOName = inputO || "Player O";

  document.getElementById("scoreX").textContent = `${playerXName}: ${scoreX}`;
  document.getElementById("scoreO").textContent = `${playerOName}: ${scoreO}`;

  const nextName = currentPlayer === "X" ? playerXName : playerOName;
  statusText.textContent = `${nextName}'s turn`;
});

// Initial render
renderBoard();
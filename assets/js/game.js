// Get references to HTML elements
const board = document.getElementById("board");
const statusText = document.getElementById("status");
const timerDisplay = document.getElementById("timer");
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

// Timer state
let timerInterval;
let timeLeft = 10;

// Winning combinations
const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// Render the board
function renderBoard() {
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    const isWinningCell = winningPattern.includes(index);

    // Always apply the base .cell class
    cellDiv.classList.add(
      "cell",
      "text-2xl",
      "font-bold",
      "flex",
      "items-center",
      "justify-center",
      "cursor-pointer",
      "transition-colors",
      "duration-150"
    );

    // Apply neon blue border
    cellDiv.classList.add("border-2", "border-blue-500");

    // Apply background color
    if (isWinningCell) {
      cellDiv.classList.add("winning"); // Let CSS handle .winning style
    } else {
      cellDiv.classList.add("bg-black", "hover:bg-gray-800");
    }

    cellDiv.textContent = cell;
    cellDiv.addEventListener("click", () => handleMove(index));
    board.appendChild(cellDiv);
  });
}

// Start or reset the turn timer
function startTurnTimer() {
  clearInterval(timerInterval);
  timeLeft = 10;
  timerDisplay.textContent = `Time left: ${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      statusText.textContent = `${currentPlayer === "X" ? playerXName : playerOName} forfeits turn!`;
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      const nextName = currentPlayer === "X" ? playerXName : playerOName;
      statusText.textContent = `${nextName}'s turn`;
      startTurnTimer();
    }
  }, 1000);
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
    clearInterval(timerInterval);
    launchConfetti();

    if (currentPlayer === "X") {
      scoreX++;
    } else {
      scoreO++;
    }

    updateScoreIcons();

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
    } else {
      // Match not over — reset board for next round
      setTimeout(() => {
        cells = Array(9).fill("");
        currentPlayer = "X";
        gameActive = true;
        winningPattern = [];
        statusText.textContent = `${currentPlayer === "X" ? playerXName : playerOName}'s turn`;
        renderBoard();
        startTurnTimer();
        console.log("Calling renderBoard()");
      }, 4000);
    }
  } else if (cells.every(cell => cell)) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    clearInterval(timerInterval);
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
    startTurnTimer();
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
  updateScoreIcons();
  renderBoard();
  startTurnTimer();
}

// Reset the full match
function resetMatch() {
  const banner = document.getElementById("match-winner-banner");
  const matchWinner = scoreX > scoreO ? playerXName : scoreO > scoreX ? playerOName : "No one";

  // Set banner text and animate in
  banner.textContent = `${matchWinner} wins the match!`;
  banner.classList.remove("hidden");
  banner.classList.add("scale-100", "opacity-100");

  setTimeout(() => {
    // Animate out and hide
    banner.classList.remove("scale-100", "opacity-100");
    banner.classList.add("hidden");

    // Reset match state
    scoreX = 0;
    scoreO = 0;
    roundsPlayed = 0;
    cells = Array(9).fill("");
    currentPlayer = "X";
    gameActive = true;
    winningPattern = [];

    updateScoreIcons();
    renderBoard();
    startTurnTimer();

    statusText.textContent = `${playerXName}'s turn`;
  }, 5000);
}

// Button listeners
resetBtn.addEventListener("click", resetGame);

updateNamesBtn.addEventListener("click", () => {
  const inputX = playerXInput.value.trim();
  const inputO = playerOInput.value.trim();
  playerXName = inputX || "Player X";
  playerOName = inputO || "Player O";

  updateScoreIcons();


  const nextName = currentPlayer === "X" ? playerXName : playerOName;
  statusText.textContent = `${nextName}'s turn`;
});

// Initial render
renderBoard();
startTurnTimer();

// Background music trigger (0.5 second after load or refresh)
window.addEventListener("load", () => {
  const bgMusic = document.getElementById("bg-music");
  if (bgMusic) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    setTimeout(() => {
      bgMusic.volume = 0.3;
      bgMusic.play().catch(() => {
        console.warn("Autoplay blocked. User interaction may be required.");
      });
    }, 500);
  }
});

function updateScoreIcons() {
  const scoreIconsX = document.getElementById("score-icons-x");
  const scoreIconsO = document.getElementById("score-icons-o");

  scoreIconsX.innerHTML = "";
  scoreIconsO.innerHTML = "";

  for (let i = 0; i < scoreX; i++) {
    const star = document.createElement("span");
    star.textContent = "★";
    star.style.color = "#00bfff";
    star.style.fontSize = "1.5rem";
    scoreIconsX.appendChild(star);
  }

  for (let i = 0; i < scoreO; i++) {
    const star = document.createElement("span");
    star.textContent = "★";
    star.style.color = "#00bfff";
    star.style.fontSize = "1.5rem";
    scoreIconsO.appendChild(star);
  }
}
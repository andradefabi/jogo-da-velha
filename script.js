const cells = document.querySelectorAll('.cell');
const turnIndicator = document.getElementById('turnIndicator');
const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const winModal = document.getElementById('winModal');
const winnerText = document.getElementById('winnerText');
const restartBtn = document.getElementById('restartBtn');
const gameModeSelection = document.getElementById('gameModeSelection');
const vsPlayerBtn = document.getElementById('vsPlayerBtn');
const vsBotBtn = document.getElementById('vsBotBtn');

let isXTurn = true;
let board = Array(9).fill(null);
let gameActive = true;
let vsBot = false; // Modo de jogo contra o robô

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
  [0, 4, 8], [2, 4, 6]             // Diagonais
];

// Função para o robô fazer uma jogada
function botPlay() {
  let availableCells = [];
  board.forEach((cell, index) => {
    if (!cell) availableCells.push(index);
  });

  if (availableCells.length > 0) {
    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    makeMove(randomIndex, false);
  }
}

// Escolhe o modo de jogo
vsPlayerBtn.addEventListener('click', () => startGame(false));
vsBotBtn.addEventListener('click', () => startGame(true));

// Inicia o jogo no modo selecionado
function startGame(isBot) {
  vsBot = isBot;
  gameModeSelection.style.display = 'none';
  turnIndicator.style.display = 'block';
  document.querySelector('.board').style.display = 'grid';
}

// Troca de turno
function switchTurn() {
  isXTurn = !isXTurn;
  turnIndicator.textContent = `Vez do jogador: ${isXTurn ? 'X' : 'O'}`;
  turnIndicator.classList.toggle('turn-x');
  turnIndicator.classList.toggle('turn-o');

  if (vsBot && !isXTurn) {
    setTimeout(botPlay, 500); // Pequena pausa antes do robô jogar
  }
}

// Verifica vencedor
function checkWinner() {
  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes(null) ? null : 'Empate';
}

// Mostra modal de vitória
function showWinner(winner) {
  winnerText.textContent = winner === 'Empate' ? "É um empate!" : `${winner} venceu!`;
  winModal.style.display = 'flex';
  playWinSound();
}

// Reinicia o jogo
function restartGame() {
  board.fill(null);
  cells.forEach(cell => {
    cell.classList.remove('x', 'o');
    cell.textContent = '';
  });
  winModal.style.display = 'none';
  gameActive = true;
  isXTurn = true;
  turnIndicator.textContent = "Vez do jogador: X";
  turnIndicator.classList.add('turn-x');
  turnIndicator.classList.remove('turn-o');
}

// Adiciona som de clique
function playClickSound() {
  clickSound.play();
}

// Adiciona som de vitória
function playWinSound() {
  winSound.play();
}

// Função principal para fazer uma jogada
function makeMove(index, playerClick = true) {
  if (board[index] || !gameActive) return;

  board[index] = isXTurn ? 'X' : 'O';
  cells[index].classList.add(isXTurn ? 'x' : 'o');
  cells[index].textContent = isXTurn ? 'X' : 'O';

  playClickSound();

  const winner = checkWinner();
  if (winner) {
    gameActive = false;
    showWinner(winner);
  } else {
    switchTurn();
  }
}

// Lógica principal do jogo
cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const index = cell.getAttribute('data-index');
    if (vsBot && !isXTurn) return; // Bloqueia a jogada do jogador quando é a vez do robô
    makeMove(index);
  });
});

restartBtn.addEventListener('click', restartGame);

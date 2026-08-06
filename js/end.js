/**
 * End screen: winner announcement, final score and confetti.
 */

/** Placement of the nine confetti images, taken from the design. */
const CONFETTI = [
  { w: 140, h: 92.43, x: 0, y: 0, t: 'rotate(-50.03deg)' },
  { w: 155.26, h: 202.37, x: 1, y: 121, t: 'matrix(-0.96, 0.28, 0.28, 0.96, 0, 0)' },
  { w: 243.4, h: 190.28, x: 114, y: 32, t: 'rotate(17.69deg)' },
  { w: 114.57, h: 202.37, x: 341, y: 77, t: 'matrix(-0.98, -0.22, -0.22, 0.98, 0, 0)' },
  { w: 243.4, h: 190.28, x: 468, y: 28, t: 'matrix(0.97, -0.23, -0.23, -0.97, 0, 0)' },
  { w: 155.26, h: 202.37, x: 721, y: 34, t: 'rotate(97.13deg)' },
  { w: 89.89, h: 121.09, x: 882.53, y: 157.78, t: 'matrix(0.28, -0.96, -0.96, -0.28, 0, 0)' },
  { w: 114.57, h: 202.37, x: 918, y: 0, t: 'matrix(0.8, -0.6, -0.6, -0.8, 0, 0)' },
  { w: 155.26, h: 202.37, x: 1028, y: 46, t: 'rotate(16.34deg)' }
];

/**
 * Shows the game over screen with the final score. After a short pause it
 * hands over to the winner screen; a click skips the wait.
 * @returns {void}
 */
function showGameOver() {
  document.getElementById('over-score-blue').textContent = String(state.scores.blue);
  document.getElementById('over-score-orange').textContent = String(state.scores.orange);
  showScreen('gameover');
  state.timer = window.setTimeout(showEndScreen, OVER_DELAY);
}

/**
 * Fills and shows the winner screen for the finished round.
 * @returns {void}
 */
function showEndScreen() {
  window.clearTimeout(state.timer);
  const winner = getWinner();
  renderConfetti(winner !== 'draw');
  renderWinner(winner);
  document.getElementById('end-score-blue').textContent = String(state.scores.blue);
  document.getElementById('end-score-orange').textContent = String(state.scores.orange);
  showScreen('end');
}

/**
 * Writes the winner headline and colours trophy and name accordingly.
 * @param {string} winner - 'blue', 'orange' or 'draw'.
 * @returns {void}
 */
function renderWinner(winner) {
  const stack = document.getElementById('end-winner');
  const isDraw = winner === 'draw';
  document.getElementById('end-lead').textContent = isDraw ? 'No winner this time' : 'The winner is';
  stack.textContent = isDraw ? "IT'S A DRAW" : winner.toUpperCase() + ' PLAYER';
  document.getElementById('end-trophy').hidden = isDraw;
  const color = isDraw ? 'var(--accent)' : 'var(--' + winner + ')';
  document.getElementById('screen-end').style.setProperty('--winner-color', color);
}

/**
 * Builds or clears the confetti strip above the headline.
 * @param {boolean} visible - True to show confetti, false to clear it.
 * @returns {void}
 */
function renderConfetti(visible) {
  const strip = document.getElementById('confetti');
  strip.innerHTML = '';
  if (!visible) return;
  CONFETTI.forEach((piece) => strip.appendChild(createConfetti(piece)));
}

/**
 * Creates one positioned confetti image.
 * @param {{w: number, h: number, x: number, y: number, t: string}} piece - Placement data.
 * @returns {HTMLImageElement} The positioned image element.
 */
function createConfetti(piece) {
  const image = document.createElement('img');
  image.src = './assets/confetti.png';
  image.alt = '';
  image.style.width = piece.w + 'px';
  image.style.height = piece.h + 'px';
  image.style.left = piece.x + 'px';
  image.style.top = piece.y + 'px';
  image.style.transform = piece.t;
  image.addEventListener('error', () => image.remove());
  return image;
}

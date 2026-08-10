/**
 * End screen: winner announcement, final score and confetti.
 */

import { BREAKPOINT, OVER_DELAY, publicUrl } from './config';
import { byId } from './dom';
import { showScreen } from './screens';
import { getWinner, state } from './state';
import type { ConfettiPiece, Winner } from './types';

/** Placement of the nine confetti images, taken from the design. */
const CONFETTI: readonly ConfettiPiece[] = [
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

/** The long confetti strip used from the widescreen breakpoint up. */
const CONFETTI_WIDE: readonly ConfettiPiece[] = [
  { w: 243.4, h: 190.28, x: 1105, y: 32, t: 'rotate(17.69deg)' },
  { w: 243.4, h: 190.28, x: 106, y: 13, t: 'rotate(17.69deg)' },
  { w: 243.4, h: 190.28, x: 2307, y: 9, t: 'rotate(17.69deg)' },
  { w: 243.4, h: 190.28, x: 1459, y: 28, t: 'matrix(0.97, -0.23, -0.23, -0.97, 0, 0)' },
  { w: 243.4, h: 190.28, x: 405, y: 28, t: 'matrix(0.97, -0.23, -0.23, -0.97, 0, 0)' },
  { w: 243.4, h: 190.28, x: 2665, y: 33, t: 'matrix(0.97, -0.23, -0.23, -0.97, 0, 0)' },
  { w: 114.57, h: 202.37, x: 1909, y: 0, t: 'matrix(0.8, -0.6, -0.6, -0.8, 0, 0)' },
  { w: 114.57, h: 202.37, x: 882, y: 0, t: 'matrix(0.8, -0.6, -0.6, -0.8, 0, 0)' },
  { w: 114.57, h: 202.37, x: 1332, y: 77, t: 'matrix(-0.98, -0.22, -0.22, 0.98, 0, 0)' },
  { w: 114.57, h: 202.37, x: 2479.13, y: 28.69, t: 'matrix(-0.14, 0.99, 0.99, 0.14, 0, 0)' },
  { w: 155.26, h: 202.37, x: 1712, y: 34, t: 'rotate(97.13deg)' },
  { w: 155.26, h: 202.37, x: 685, y: 34, t: 'rotate(97.13deg)' },
  { w: 155.26, h: 130.99, x: 2879.71, y: 32.33, t: 'rotate(49.23deg)' },
  { w: 155.26, h: 202.37, x: -35, y: 121, t: 'matrix(-0.96, 0.28, 0.28, 0.96, 0, 0)' },
  { w: 155.26, h: 202.37, x: 2945, y: 74, t: 'rotate(16.34deg)' },
  { w: 155.26, h: 202.37, x: 2169, y: 121, t: 'matrix(-0.96, 0.28, 0.28, 0.96, 0, 0)' },
  { w: 140, h: 92.43, x: 991, y: 0, t: 'rotate(-50.03deg)' },
  { w: 140, h: 92.43, x: -36, y: 0, t: 'rotate(-50.03deg)' },
  { w: 140, h: 92.43, x: 2168, y: 0, t: 'rotate(-50.03deg)' },
  { w: 155.26, h: 202.37, x: 2019, y: 46, t: 'rotate(16.34deg)' },
  { w: 89.89, h: 121.09, x: 1873.53, y: 157.78, t: 'matrix(0.28, -0.96, -0.96, -0.28, 0, 0)' },
  { w: 89.89, h: 121.09, x: 846.53, y: 157.78, t: 'matrix(0.28, -0.96, -0.96, -0.28, 0, 0)' }
];

/** Width of the desktop and the widescreen confetti strip. */
const CONFETTI_WIDTH = 1234;
const CONFETTI_WIDE_WIDTH = 3216;

/**
 * Shows the game over screen with the final score. After a short pause it
 * hands over to the winner screen; a click skips the wait.
 * @returns {void}
 */
export function showGameOver(): void {
  byId('over-score-blue').textContent = String(state.scores.blue);
  byId('over-score-orange').textContent = String(state.scores.orange);
  showScreen('gameover');
  state.timer = window.setTimeout(showEndScreen, OVER_DELAY);
}

/**
 * Fills and shows the winner screen for the finished round.
 * @returns {void}
 */
export function showEndScreen(): void {
  if (state.timer !== null) window.clearTimeout(state.timer);
  const winner = getWinner();
  renderWinner(winner);
  showScreen('end');
  renderConfetti(winner !== 'draw' && state.theme === 'codevibes');
}

/**
 * Writes the winner headline and colours trophy and name accordingly.
 * @param winner - The winning player, or 'draw'.
 * @returns {void}
 */
function renderWinner(winner: Winner): void {
  const isDraw = winner === 'draw';
  const name = winner.charAt(0).toUpperCase() + winner.slice(1);
  byId('end-lead').textContent = isDraw ? "It's a" : 'The winner is';
  byId('end-winner').textContent = isDraw ? 'Draw' : `${name} Player`;
  byId('btn-home').textContent = state.theme === 'codevibes' ? 'Back to start' : 'Home';
  const screen = byId('screen-end');
  screen.classList.toggle('is-draw', isDraw);
  screen.style.setProperty('--winner-color', isDraw ? 'var(--win-draw-ink)' : `var(--${winner})`);
}

/**
 * Builds or clears the confetti strip above the headline. From the widescreen
 * breakpoint up the longer strip from the design is used; both are centred.
 * @param visible - True to show confetti, false to clear it.
 * @returns {void}
 */
export function renderConfetti(visible: boolean): void {
  const strip = byId('confetti');
  strip.innerHTML = '';
  if (!visible) return;
  const wide = strip.offsetWidth > BREAKPOINT;
  const pieces = wide ? CONFETTI_WIDE : CONFETTI;
  const width = wide ? CONFETTI_WIDE_WIDTH : CONFETTI_WIDTH;
  const shift = (strip.offsetWidth - width) / 2;
  pieces.forEach((piece) => strip.appendChild(createConfetti(piece, shift)));
}

/**
 * Creates one positioned confetti image.
 * @param piece - Placement data from the design.
 * @param shift - Horizontal offset that centres the strip.
 * @returns The positioned image element.
 */
function createConfetti(piece: ConfettiPiece, shift: number): HTMLImageElement {
  const image = document.createElement('img');
  image.src = publicUrl('assets/confetti.png');
  image.alt = '';
  image.style.width = `${piece.w}px`;
  image.style.height = `${piece.h}px`;
  image.style.left = `${piece.x + shift}px`;
  image.style.top = `${piece.y}px`;
  image.style.transform = piece.t;
  image.addEventListener('error', () => image.remove());
  return image;
}

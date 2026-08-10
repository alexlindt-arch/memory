/**
 * Round logic: flipping cards, scoring pairs and switching turns.
 */

import { buildDeck, refreshCard, renderBoard } from './board';
import { END_DELAY, HIDE_DELAY, getTheme } from './config';
import { byId } from './dom';
import { showGameOver } from './end';
import { showScreen } from './screens';
import { resetRound, state } from './state';

/**
 * Starts a fresh round with the current settings and shows the board.
 * The size is picked on the settings screen, and the start button stays
 * disabled until it is – so it can only be missing if we are called too early.
 * @returns {void}
 */
export function startGame(): void {
  if (state.size === null) return;
  resetRound();
  state.cards = buildDeck(getTheme(state.theme), state.size);
  document.body.dataset.size = String(state.size);
  renderBoard(getTheme(state.theme), flipCard);
  updateScoreboard();
  showScreen('game');
}

/**
 * Handles a click on a card.
 * @param index - Position of the clicked card inside the deck.
 * @returns {void}
 */
export function flipCard(index: number): void {
  const card = state.cards[index];
  if (state.locked || card.open || card.matched) return;
  card.open = true;
  refreshCard(index);
  if (state.firstIndex === null) {
    state.firstIndex = index;
    return;
  }
  resolvePair(state.firstIndex, index);
}

/**
 * Compares the two open cards and reacts to hit or miss.
 * @param firstIndex - Index of the first open card.
 * @param secondIndex - Index of the second open card.
 * @returns {void}
 */
function resolvePair(firstIndex: number, secondIndex: number): void {
  state.firstIndex = null;
  if (state.cards[firstIndex].face === state.cards[secondIndex].face) {
    scorePair(firstIndex, secondIndex);
    return;
  }
  state.locked = true;
  state.timer = window.setTimeout(() => hidePair(firstIndex, secondIndex), HIDE_DELAY);
}

/**
 * Marks a matching pair, awards a point and checks for the end of the round.
 * @param firstIndex - Index of the first card.
 * @param secondIndex - Index of the second card.
 * @returns {void}
 */
function scorePair(firstIndex: number, secondIndex: number): void {
  [firstIndex, secondIndex].forEach((index) => {
    state.cards[index].matched = true;
    refreshCard(index);
  });
  state.scores[state.turn] += 1;
  updateScoreboard();
  if (state.cards.every((card) => card.matched)) {
    state.timer = window.setTimeout(showGameOver, END_DELAY);
  }
}

/**
 * Turns two unmatched cards face down again and passes the turn on.
 * @param firstIndex - Index of the first card.
 * @param secondIndex - Index of the second card.
 * @returns {void}
 */
function hidePair(firstIndex: number, secondIndex: number): void {
  [firstIndex, secondIndex].forEach((index) => {
    state.cards[index].open = false;
    refreshCard(index);
  });
  state.locked = false;
  state.turn = state.turn === 'blue' ? 'orange' : 'blue';
  updateScoreboard();
}

/**
 * Writes the current scores and the active player into the top bar.
 * @returns {void}
 */
function updateScoreboard(): void {
  byId('score-blue').textContent = String(state.scores.blue);
  byId('score-orange').textContent = String(state.scores.orange);
  const chip = byId('turn-chip');
  chip.style.setProperty('--turn-color', state.turn === 'blue' ? 'var(--blue)' : 'var(--orange)');
}

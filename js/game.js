/**
 * Round logic: flipping cards, scoring pairs and switching turns.
 */

/**
 * Starts a fresh round with the current settings and shows the board.
 * @returns {void}
 */
function startGame() {
  resetRound();
  state.cards = buildDeck(getTheme(state.theme), state.size);
  document.body.dataset.size = String(state.size);
  renderBoard();
  updateScoreboard();
  showScreen('game');
}

/**
 * Handles a click on a card.
 * @param {number} index - Position of the clicked card inside the deck.
 * @returns {void}
 */
function flipCard(index) {
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
 * @param {number} firstIndex - Index of the first open card.
 * @param {number} secondIndex - Index of the second open card.
 * @returns {void}
 */
function resolvePair(firstIndex, secondIndex) {
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
 * @param {number} firstIndex - Index of the first card.
 * @param {number} secondIndex - Index of the second card.
 * @returns {void}
 */
function scorePair(firstIndex, secondIndex) {
  [firstIndex, secondIndex].forEach((index) => {
    state.cards[index].matched = true;
    refreshCard(index);
  });
  state.scores[state.turn] += 1;
  updateScoreboard();
  if (state.cards.every((card) => card.matched)) {
    state.timer = window.setTimeout(showEndScreen, END_DELAY);
  }
}

/**
 * Turns two unmatched cards face down again and passes the turn on.
 * @param {number} firstIndex - Index of the first card.
 * @param {number} secondIndex - Index of the second card.
 * @returns {void}
 */
function hidePair(firstIndex, secondIndex) {
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
function updateScoreboard() {
  document.getElementById('score-blue').textContent = String(state.scores.blue);
  document.getElementById('score-orange').textContent = String(state.scores.orange);
  const chip = document.getElementById('turn-chip');
  chip.style.setProperty('--turn-color', state.turn === 'blue' ? 'var(--blue)' : 'var(--orange)');
}

/**
 * Central game state. All modules read from and write to this single object,
 * so there is exactly one source of truth for the running round.
 */
const state = {
  theme: 'codevibes',
  player: null,
  size: null,
  cards: [],
  firstIndex: null,
  locked: false,
  scores: { blue: 0, orange: 0 },
  turn: 'blue',
  timer: null
};

/**
 * Clears every value that belongs to a single round, but keeps the settings.
 * @returns {void}
 */
function resetRound() {
  window.clearTimeout(state.timer);
  state.cards = [];
  state.firstIndex = null;
  state.locked = false;
  state.scores = { blue: 0, orange: 0 };
  state.turn = state.player || 'blue';
  state.timer = null;
}

/**
 * Tells whether all settings needed to start a round have been chosen.
 * @returns {boolean} True when player and board size are selected.
 */
function isReadyToStart() {
  return state.player !== null && state.size !== null;
}

/**
 * Determines the winner of the current round.
 * @returns {string} 'blue', 'orange' or 'draw'.
 */
function getWinner() {
  if (state.scores.blue > state.scores.orange) return 'blue';
  if (state.scores.orange > state.scores.blue) return 'orange';
  return 'draw';
}

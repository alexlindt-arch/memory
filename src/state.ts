/**
 * Central game state. All modules read from and write to this single object,
 * so there is exactly one source of truth for the running round.
 */

import type { GameState, Winner } from './types';

export const state: GameState = {
  theme: null,
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
export function resetRound(): void {
  if (state.timer !== null) window.clearTimeout(state.timer);
  state.cards = [];
  state.firstIndex = null;
  state.locked = false;
  state.scores = { blue: 0, orange: 0 };
  state.turn = state.player ?? 'blue';
  state.timer = null;
}

/**
 * Tells whether all settings needed to start a round have been chosen.
 * @returns True when theme, player and board size are all selected.
 */
export function isReadyToStart(): boolean {
  return state.theme !== null && state.player !== null && state.size !== null;
}

/**
 * Determines the winner of the current round.
 * @returns The leading player, or 'draw' when the scores are level.
 */
export function getWinner(): Winner {
  if (state.scores.blue > state.scores.orange) return 'blue';
  if (state.scores.orange > state.scores.blue) return 'orange';
  return 'draw';
}

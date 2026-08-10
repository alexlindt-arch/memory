/**
 * Application entry point: pulls in the stylesheet, wires up every button and
 * boots the game on the start screen.
 */

import './styles/style.scss';

import { renderConfetti, showEndScreen } from './end';
import { byId } from './dom';
import { startGame } from './game';
import { closeQuitDialog, openQuitDialog, showScreen } from './screens';
import { renderSettings } from './settings';
import { fitStage } from './stage';
import { resetRound, state } from './state';

/**
 * Leaves the running round and returns to the start screen.
 * @returns {void}
 */
function quitToHome(): void {
  resetRound();
  showScreen('home');
}

/**
 * Connects every button of the app with its handler.
 * @returns {void}
 */
function bindEvents(): void {
  byId('btn-play').addEventListener('click', () => showScreen('settings'));
  byId('btn-start').addEventListener('click', startGame);
  byId('btn-exit').addEventListener('click', openQuitDialog);
  byId('btn-resume').addEventListener('click', closeQuitDialog);
  byId('btn-quit').addEventListener('click', quitToHome);
  byId('btn-again').addEventListener('click', startGame);
  byId('btn-home').addEventListener('click', quitToHome);
  byId('screen-gameover').addEventListener('click', showEndScreen);
  window.addEventListener('resize', onResize);
}

/**
 * Refits the stage and rebuilds the confetti, which differs above and below
 * the breakpoint.
 * @returns {void}
 */
function onResize(): void {
  fitStage();
  const end = byId('screen-end');
  if (!end.hidden) {
    renderConfetti(!end.classList.contains('is-draw') && state.theme === 'codevibes');
  }
}

/**
 * Boots the application.
 * @returns {void}
 */
function init(): void {
  renderSettings();
  bindEvents();
  fitStage();
  showScreen('home');
}

init();

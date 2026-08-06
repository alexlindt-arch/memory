/**
 * Application entry point: screen routing, stage scaling and event wiring.
 */

/** Ids of all screens, used to hide the inactive ones. */
const SCREENS = ['home', 'settings', 'game', 'gameover', 'end'];

/**
 * Shows one screen and hides all others.
 * @param {string} name - 'home', 'settings', 'game' or 'end'.
 * @returns {void}
 */
function showScreen(name) {
  SCREENS.forEach((screen) => {
    document.getElementById('screen-' + screen).hidden = screen !== name;
  });
  document.body.dataset.screen = name;
  closeQuitDialog();
}

/**
 * Opens the "quit game" confirmation dialog.
 * @returns {void}
 */
function openQuitDialog() {
  document.getElementById('dialog-quit').hidden = false;
}

/**
 * Closes the "quit game" confirmation dialog.
 * @returns {void}
 */
function closeQuitDialog() {
  document.getElementById('dialog-quit').hidden = true;
}

/**
 * Leaves the running round and returns to the start screen.
 * @returns {void}
 */
function quitToHome() {
  resetRound();
  showScreen('home');
}

/**
 * Fits the 1440x1024 design canvas to the viewport. Below the breakpoint the
 * canvas is scaled down; from 1440px up it keeps its size and only the stage
 * widens, so the content stays centred while the background runs edge to edge.
 * @returns {void}
 */
function fitStage() {
  const scale = Math.min(1, window.innerWidth / BREAKPOINT, window.innerHeight / 1024);
  const width = Math.max(BREAKPOINT, window.innerWidth / scale);
  const root = document.documentElement.style;
  root.setProperty('--stage-scale', String(scale));
  root.setProperty('--stage-width', width + 'px');
}

/**
 * Connects every button of the app with its handler.
 * @returns {void}
 */
function bindEvents() {
  document.getElementById('btn-play').addEventListener('click', () => showScreen('settings'));
  document.getElementById('btn-start').addEventListener('click', startGame);
  document.getElementById('btn-exit').addEventListener('click', openQuitDialog);
  document.getElementById('btn-resume').addEventListener('click', closeQuitDialog);
  document.getElementById('btn-quit').addEventListener('click', quitToHome);
  document.getElementById('btn-again').addEventListener('click', startGame);
  document.getElementById('btn-home').addEventListener('click', quitToHome);
  document.getElementById('screen-gameover').addEventListener('click', showEndScreen);
  window.addEventListener('resize', onResize);
}

/**
 * Refits the stage and rebuilds the confetti, which differs above and below
 * the breakpoint.
 * @returns {void}
 */
function onResize() {
  fitStage();
  const end = document.getElementById('screen-end');
  if (!end.hidden) renderConfetti(!end.classList.contains('is-draw') && state.theme === 'codevibes');
}

/**
 * Boots the application.
 * @returns {void}
 */
function init() {
  renderSettings();
  bindEvents();
  fitStage();
  showScreen('home');
}

document.addEventListener('DOMContentLoaded', init);

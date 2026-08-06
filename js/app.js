/**
 * Application entry point: screen routing, stage scaling and event wiring.
 */

/** Ids of all screens, used to hide the inactive ones. */
const SCREENS = ['home', 'settings', 'game', 'end'];

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
 * Scales the fixed 1440x1024 stage so it always fits the viewport.
 * @returns {void}
 */
function fitStage() {
  const scale = Math.min(window.innerWidth / 1440, window.innerHeight / 1024);
  document.documentElement.style.setProperty('--stage-scale', String(scale));
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
  window.addEventListener('resize', fitStage);
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

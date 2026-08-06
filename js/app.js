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
  centreContent();
}

/**
 * Vertical bounds of everything meaningful on the current screen, measured in
 * canvas pixels from the top of the canvas. Purely decorative parts – the
 * watermark, the confetti – are left out so they cannot drag the centring.
 * @returns {{top: number, bottom: number}} Upper and lower edge of the content.
 */
function getContentBounds() {
  const stage = document.getElementById('stage').getBoundingClientRect();
  const scale = Number(getComputedStyle(document.documentElement).getPropertyValue('--stage-scale')) || 1;
  const bounds = { top: Infinity, bottom: -Infinity };
  document.getElementById('screen-' + document.body.dataset.screen).querySelectorAll('*').forEach((el) => {
    const box = el.getBoundingClientRect();
    if (!box.height || el.closest('[aria-hidden="true"]')) return;
    bounds.top = Math.min(bounds.top, (box.top - stage.top) / scale);
    bounds.bottom = Math.max(bounds.bottom, (box.bottom - stage.top) / scale);
  });
  return bounds;
}

/**
 * Moves the canvas so the content sits in the middle of the window instead of
 * the middle of the 1024px tall canvas, which every screen fills differently.
 * @returns {void}
 */
function centreContent() {
  const bounds = getContentBounds();
  if (!Number.isFinite(bounds.top)) return;
  const shift = 512 - (bounds.top + bounds.bottom) / 2;
  document.documentElement.style.setProperty('--stage-shift', shift.toFixed(1) + 'px');
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
 * Fits the 1440x1024 design canvas to the viewport. It is scaled to the width
 * the design actually fills, not to the canvas, so only the empty side margins
 * run past the edge; from 1440px up it keeps its size and only the stage
 * widens, so the content stays centred while the background runs edge to edge.
 * @returns {void}
 */
function fitStage() {
  const scale = Math.min(1, window.innerWidth / CONTENT_WIDTH, window.innerHeight / CONTENT_HEIGHT);
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
  centreContent();
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

/**
 * Settings screen: theme, player and board size selection.
 * Every change writes to `state` and immediately refreshes the preview,
 * the summary bar and the start button.
 */

const ARROW_SVG = '<svg class="option__arrow" viewBox="395 330 50 18" xmlns="http://www.w3.org/2000/svg"'
  + ' aria-hidden="true"><path d="M444.66 339L436 330.34L427.34 339L436 347.66L444.66 339ZM395 339V340.5H436V339V337.5'
  + 'H395V339Z" fill="var(--settings-rule)"></path></svg>';

/**
 * Renders all three option lists once on start-up.
 * @returns {void}
 */
function renderSettings() {
  fillOptions('options-theme', THEMES.map((theme) => ({ value: theme.id, label: theme.label })), true);
  fillOptions('options-player', PLAYERS.map((player) => ({ value: player.id, label: player.label })), false);
  fillOptions('options-size', BOARD_SIZES.map((size) => ({ value: size.cards, label: size.label })), false);
  updateSettings();
}

/**
 * Builds the list items of one option group.
 * @param {string} listId - Id of the <ul> element.
 * @param {{value: (string|number), label: string}[]} items - Options to render.
 * @param {boolean} withArrow - True to append the pointer arrow (themes only).
 * @returns {void}
 */
function fillOptions(listId, items, withArrow) {
  const list = document.getElementById(listId);
  list.innerHTML = '';
  items.forEach((item) => list.appendChild(createOption(listId, item, withArrow)));
}

/**
 * Creates a single selectable option row.
 * @param {string} listId - Id of the owning list, used to derive the group.
 * @param {{value: (string|number), label: string}} item - Option data.
 * @param {boolean} withArrow - True to append the pointer arrow.
 * @returns {HTMLLIElement} The ready-to-insert list item.
 */
function createOption(listId, item, withArrow) {
  const group = listId.replace('options-', '');
  const li = document.createElement('li');
  li.innerHTML = '<button class="option" type="button"><span class="option__dot"></span>'
    + '<span class="option__label">' + item.label + '</span>' + (withArrow ? ARROW_SVG : '') + '</button>';
  const button = li.firstChild;
  button.dataset.group = group;
  button.dataset.value = String(item.value);
  button.addEventListener('click', () => selectOption(group, item.value));
  return li;
}

/**
 * Stores a chosen option in the state and refreshes the screen.
 * @param {string} group - 'theme', 'player' or 'size'.
 * @param {(string|number)} value - The chosen value.
 * @returns {void}
 */
function selectOption(group, value) {
  if (group === 'theme') state.theme = String(value);
  if (group === 'player') state.player = String(value);
  if (group === 'size') state.size = Number(value);
  updateSettings();
}

/**
 * Applies the current selection to theme, options, preview and summary.
 * @returns {void}
 */
function updateSettings() {
  document.body.dataset.theme = state.theme;
  markActiveOptions();
  updatePreview();
  updateSummary();
  document.getElementById('btn-start').disabled = !isReadyToStart();
}

/**
 * Highlights the selected row inside every option group.
 * @returns {void}
 */
function markActiveOptions() {
  const chosen = { theme: state.theme, player: state.player, size: state.size };
  document.querySelectorAll('.option').forEach((option) => {
    const active = String(chosen[option.dataset.group]) === option.dataset.value;
    option.classList.toggle('option--active', active);
    option.style.setProperty('--option-dot', getDotColor(option.dataset.value));
  });
}

/**
 * Picks the marker colour of an option dot.
 * @param {string} value - The option value.
 * @returns {string} A CSS colour value.
 */
function getDotColor(value) {
  if (value === 'blue') return 'var(--blue)';
  if (value === 'orange') return 'var(--orange)';
  return 'var(--settings-ink)';
}

/**
 * Shows a sample card of the selected theme inside the preview panel.
 * @returns {void}
 */
function updatePreview() {
  const theme = getTheme(state.theme);
  const image = document.getElementById('preview-front');
  const card = image.parentNode;
  card.classList.remove('is-fallback');
  document.getElementById('preview-glyph').textContent = getFaceGlyph(theme, theme.preview);
  image.onerror = () => card.classList.add('is-fallback');
  image.src = getFacePath(theme, theme.preview);
}

/**
 * Mirrors the current selection in the summary bar: each step shows the
 * chosen value once it is picked, and stays grey until then.
 * @returns {void}
 */
function updateSummary() {
  const player = PLAYERS.find((entry) => entry.id === state.player);
  const size = BOARD_SIZES.find((entry) => entry.cards === state.size);
  setSummaryStep('theme', getTheme(state.theme).label.replace(' theme', ''), true);
  setSummaryStep('player', player ? player.label : 'Player', player !== undefined);
  setSummaryStep('size', size ? size.label : 'Board size', size !== undefined);
}

/**
 * Writes one summary step and marks it as done or pending.
 * @param {string} key - 'theme', 'player' or 'size'.
 * @param {string} label - Text to display.
 * @param {boolean} done - True when the step has been chosen.
 * @returns {void}
 */
function setSummaryStep(key, label, done) {
  const step = document.getElementById('summary-' + key);
  step.textContent = label;
  step.classList.toggle('summary__step--done', done);
}

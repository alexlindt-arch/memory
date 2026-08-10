/**
 * Settings screen: theme, player and board size selection.
 * Every change writes to `state` and immediately refreshes the preview,
 * the summary bar and the start button.
 */

import { BOARD_SIZES, PLAYERS, THEMES, getFaceGlyph, getFacePath, getTheme } from './config';
import { byId } from './dom';
import { isReadyToStart, state } from './state';
import type { BoardSize, OptionGroup, PlayerId, Theme, ThemeId } from './types';

const ARROW_SVG = '<svg class="option__arrow" viewBox="395 330 50 18" xmlns="http://www.w3.org/2000/svg"'
  + ' aria-hidden="true"><path d="M444.66 339L436 330.34L427.34 339L436 347.66L444.66 339ZM395 339V340.5H436V339V337.5'
  + 'H395V339Z" fill="var(--settings-rule)"></path></svg>';

/** One selectable row of an option group. */
interface OptionItem {
  readonly value: string | number;
  readonly label: string;
}

/**
 * Renders all three option lists once on start-up.
 * @returns {void}
 */
export function renderSettings(): void {
  fillOptions('options-theme', THEMES.map((theme) => ({ value: theme.id, label: theme.label })), true);
  fillOptions('options-player', PLAYERS.map((player) => ({ value: player.id, label: player.label })), false);
  fillOptions('options-size', BOARD_SIZES.map((size) => ({ value: size.cards, label: size.label })), false);
  updateSettings();
}

/**
 * Builds the list items of one option group.
 * @param listId - Id of the <ul> element.
 * @param items - Options to render.
 * @param withArrow - True to append the pointer arrow (themes only).
 * @returns {void}
 */
function fillOptions(listId: string, items: OptionItem[], withArrow: boolean): void {
  const list = byId(listId);
  list.innerHTML = '';
  items.forEach((item) => list.appendChild(createOption(listId, item, withArrow)));
}

/**
 * Creates a single selectable option row.
 * @param listId - Id of the owning list, used to derive the group.
 * @param item - Option data.
 * @param withArrow - True to append the pointer arrow.
 * @returns The ready-to-insert list item.
 */
function createOption(listId: string, item: OptionItem, withArrow: boolean): HTMLLIElement {
  const group = listId.replace('options-', '') as OptionGroup;
  const li = document.createElement('li');
  const button = document.createElement('button');
  button.className = 'option';
  button.type = 'button';
  button.innerHTML = '<span class="option__dot"></span>'
    + `<span class="option__label">${item.label}</span>${withArrow ? ARROW_SVG : ''}`;
  button.dataset.group = group;
  button.dataset.value = String(item.value);
  button.addEventListener('click', () => selectOption(group, item.value));
  if (group === 'theme') bindThemePeek(button, item.value as ThemeId);
  li.appendChild(button);
  return li;
}

/**
 * Lets a theme row show its own motif on the preview card while the pointer
 * rests on it, so the theme can be judged before it is chosen. Leaving the row
 * puts the selected theme back.
 * @param button - The theme row to watch.
 * @param theme - Id of the theme this row stands for.
 * @returns {void}
 */
function bindThemePeek(button: HTMLButtonElement, theme: ThemeId): void {
  const peek = () => updatePreview(getTheme(theme));
  const reset = () => updatePreview();
  button.addEventListener('mouseenter', peek);
  button.addEventListener('mouseleave', reset);
  button.addEventListener('focus', peek);
  button.addEventListener('blur', reset);
}

/**
 * Stores a chosen option in the state and refreshes the screen.
 * @param group - Which setting was changed.
 * @param value - The chosen value.
 * @returns {void}
 */
function selectOption(group: OptionGroup, value: string | number): void {
  if (group === 'theme') state.theme = String(value) as ThemeId;
  if (group === 'player') state.player = String(value) as PlayerId;
  if (group === 'size') state.size = Number(value) as BoardSize;
  updateSettings();
}

/**
 * Applies the current selection to theme, options, preview and summary.
 * @returns {void}
 */
export function updateSettings(): void {
  document.body.dataset.theme = state.theme;
  markActiveOptions();
  updatePreview();
  updateSummary();
  byId<HTMLButtonElement>('btn-start').disabled = !isReadyToStart();
}

/**
 * Highlights the selected row inside every option group.
 * @returns {void}
 */
function markActiveOptions(): void {
  const chosen: Record<OptionGroup, string | number | null> = {
    theme: state.theme,
    player: state.player,
    size: state.size
  };
  document.querySelectorAll<HTMLButtonElement>('.option').forEach((option) => {
    const group = option.dataset.group as OptionGroup | undefined;
    if (!group) return;
    option.classList.toggle('option--active', String(chosen[group]) === option.dataset.value);
    option.style.setProperty('--option-dot', getDotColor(option.dataset.value));
  });
}

/**
 * Picks the marker colour of an option dot.
 * @param value - The option value.
 * @returns A CSS colour value.
 */
function getDotColor(value: string | undefined): string {
  if (value === 'blue') return 'var(--blue)';
  if (value === 'orange') return 'var(--orange)';
  return 'var(--settings-ink)';
}

/**
 * Shows a sample card inside the preview panel.
 * @param theme - Theme to display; defaults to the selected one.
 * @returns {void}
 */
function updatePreview(theme: Theme = getTheme(state.theme)): void {
  const image = byId<HTMLImageElement>('preview-front');
  const card = image.parentElement;
  card?.classList.remove('is-fallback');
  byId('preview-glyph').textContent = getFaceGlyph(theme, theme.preview);
  image.onerror = () => card?.classList.add('is-fallback');
  image.src = getFacePath(theme, theme.preview);
}

/**
 * Mirrors the current selection in the summary bar: each step shows the
 * chosen value once it is picked, and stays grey until then.
 * @returns {void}
 */
function updateSummary(): void {
  const player = PLAYERS.find((entry) => entry.id === state.player);
  const size = BOARD_SIZES.find((entry) => entry.cards === state.size);
  setSummaryStep('theme', getTheme(state.theme).label.replace(' theme', ''), true);
  setSummaryStep('player', player ? player.label : 'Player', player !== undefined);
  setSummaryStep('size', size ? size.label : 'Board size', size !== undefined);
}

/**
 * Writes one summary step and marks it as done or pending.
 * @param key - Which step to write.
 * @param label - Text to display.
 * @param done - True when the step has been chosen.
 * @returns {void}
 */
function setSummaryStep(key: OptionGroup, label: string, done: boolean): void {
  const step = byId(`summary-${key}`);
  step.textContent = label;
  step.classList.toggle('summary__step--done', done);
}

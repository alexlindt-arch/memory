/**
 * Deck creation and board rendering.
 */

import { getFaceGlyph, getFacePath } from './config';
import { byId, query } from './dom';
import { state } from './state';
import type { BoardSize, Card, Theme } from './types';

/**
 * Called with the position of the card the player clicked. The board hands the
 * click on instead of importing the round logic itself – that would make the
 * two modules import each other in a circle.
 */
export type FlipHandler = (index: number) => void;

const BACK_GLYPH = '<svg class="card__glyph" viewBox="0 0 60 48" fill="none"'
  + ' xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
  + '<rect x="6" y="4" width="48" height="32" rx="3" stroke="#FFFFFF" stroke-width="3"></rect>'
  + '<path d="M24 15L19 20L24 25M36 15L41 20L36 25" stroke="#FFFFFF" stroke-width="3"'
  + ' stroke-linecap="round" stroke-linejoin="round"></path>'
  + '<path d="M14 43H46" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"></path></svg>';

/**
 * Randomises an array in place (Fisher-Yates).
 * @param items - The array to shuffle.
 * @returns The same array, shuffled.
 */
function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = items[i];
    items[i] = items[j];
    items[j] = swap;
  }
  return items;
}

/**
 * Builds a shuffled deck of card objects for the current theme and size.
 * @param theme - Theme supplying the motifs.
 * @param size - Number of cards on the board.
 * @returns The ready-to-play deck.
 */
export function buildDeck(theme: Theme, size: BoardSize): Card[] {
  const pool = shuffle(theme.faces.slice()).slice(0, size / 2);
  const deck = shuffle(pool.concat(pool));
  return deck.map((face) => ({ face, open: false, matched: false }));
}

/**
 * Renders the whole board into the DOM.
 * @param theme - Theme the current round is played with.
 * @param onFlip - Called with the index of a clicked card.
 * @returns {void}
 */
export function renderBoard(theme: Theme, onFlip: FlipHandler): void {
  const board = byId('board');
  board.innerHTML = '';
  state.cards.forEach((card, index) => board.appendChild(createCard(theme, card, index, onFlip)));
}

/**
 * Creates the DOM node of a single card.
 * @param theme - Theme supplying motif and back face.
 * @param card - The card to render.
 * @param index - Position of the card inside the deck.
 * @param onFlip - Called when this card is clicked.
 * @returns The card element.
 */
function createCard(theme: Theme, card: Card, index: number, onFlip: FlipHandler): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = 'card';
  button.type = 'button';
  button.dataset.index = String(index);
  button.setAttribute('aria-label', `Card ${index + 1}`);
  button.innerHTML = `<span class="card__inner">${buildBackFace(theme)}`
    + `${buildFrontFace(theme, card)}</span>`;
  watchImage(query<HTMLImageElement>('.card__img', button));
  button.addEventListener('click', () => onFlip(index));
  return button;
}

/**
 * Switches a card to its glyph fallback when the motif image cannot load.
 * @param image - The motif image of a card.
 * @returns {void}
 */
function watchImage(image: HTMLImageElement): void {
  image.addEventListener('error', () => {
    image.parentElement?.classList.add('is-fallback');
  });
}

/**
 * Builds the markup of the hidden side of a card.
 * @param theme - Theme deciding whether the back carries a glyph.
 * @returns HTML string of the back face.
 */
function buildBackFace(theme: Theme): string {
  const glyph = theme.id === 'gaming' ? '' : BACK_GLYPH;
  return `<span class="card__face card__face--back">${glyph}</span>`;
}

/**
 * Builds the markup of the motif side of a card.
 * @param theme - Theme supplying the motif and the optional frame.
 * @param card - The card whose motif is rendered.
 * @returns HTML string of the front face.
 */
function buildFrontFace(theme: Theme, card: Card): string {
  const frame = theme.frame ? `<img class="card__frame" src="${theme.frame}" alt="">` : '';
  return '<span class="card__face card__face--front">'
    + `<img class="card__img" src="${getFacePath(theme, card.face)}" alt="">`
    + `<span class="card__fallback">${getFaceGlyph(theme, card.face)}</span>`
    + `${frame}</span>`;
}

/**
 * Syncs the CSS classes of one card element with its state.
 * @param index - Position of the card inside the deck.
 * @returns {void}
 */
export function refreshCard(index: number): void {
  const element = query(`.card[data-index="${index}"]`);
  const card = state.cards[index];
  element.classList.toggle('card--open', card.open);
  element.classList.toggle('card--matched', card.matched);
}

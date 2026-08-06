/**
 * Deck creation and board rendering.
 */

const BACK_GLYPH = '<svg class="card__glyph" viewBox="0 0 60 48" fill="none"'
  + ' xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
  + '<rect x="6" y="4" width="48" height="32" rx="3" stroke="#FFFFFF" stroke-width="3"></rect>'
  + '<path d="M24 15L19 20L24 25M36 15L41 20L36 25" stroke="#FFFFFF" stroke-width="3"'
  + ' stroke-linecap="round" stroke-linejoin="round"></path>'
  + '<path d="M14 43H46" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"></path></svg>';

/**
 * Randomises an array in place (Fisher-Yates).
 * @param {any[]} items - The array to shuffle.
 * @returns {any[]} The same array, shuffled.
 */
function shuffle(items) {
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
 * @param {object} theme - Theme object from THEMES.
 * @param {number} size - Number of cards on the board (16, 24 or 36).
 * @returns {{face: string, open: boolean, matched: boolean}[]} The deck.
 */
function buildDeck(theme, size) {
  const pool = shuffle(theme.faces.slice()).slice(0, size / 2);
  const deck = shuffle(pool.concat(pool));
  return deck.map((face) => ({ face: face, open: false, matched: false }));
}

/**
 * Renders the whole board into the DOM.
 * @returns {void}
 */
function renderBoard() {
  const board = document.getElementById('board');
  const theme = getTheme(state.theme);
  board.innerHTML = '';
  state.cards.forEach((card, index) => board.appendChild(createCard(theme, card, index)));
}

/**
 * Creates the DOM node of a single card.
 * @param {object} theme - Theme object from THEMES.
 * @param {object} card - Card object from the deck.
 * @param {number} index - Position of the card inside the deck.
 * @returns {HTMLButtonElement} The card element.
 */
function createCard(theme, card, index) {
  const button = document.createElement('button');
  button.className = 'card';
  button.type = 'button';
  button.dataset.index = String(index);
  button.setAttribute('aria-label', 'Card ' + (index + 1));
  button.innerHTML = '<span class="card__inner">' + buildBackFace(theme)
    + buildFrontFace(theme, card) + '</span>';
  watchImage(button.querySelector('.card__img'));
  button.addEventListener('click', () => flipCard(index));
  return button;
}

/**
 * Switches a card to its glyph fallback when the motif image cannot load.
 * @param {HTMLImageElement} image - The motif image of a card.
 * @returns {void}
 */
function watchImage(image) {
  image.addEventListener('error', () => image.parentNode.classList.add('is-fallback'));
}

/**
 * Builds the markup of the hidden side of a card.
 * @param {object} theme - Theme object from THEMES.
 * @returns {string} HTML string of the back face.
 */
function buildBackFace(theme) {
  const glyph = theme.id === 'gaming' ? '' : BACK_GLYPH;
  return '<span class="card__face card__face--back">' + glyph + '</span>';
}

/**
 * Builds the markup of the motif side of a card.
 * @param {object} theme - Theme object from THEMES.
 * @param {object} card - Card object from the deck.
 * @returns {string} HTML string of the front face.
 */
function buildFrontFace(theme, card) {
  const frame = theme.frame ? '<img class="card__frame" src="' + theme.frame + '" alt="">' : '';
  return '<span class="card__face card__face--front">'
    + '<img class="card__img" src="' + getFacePath(theme, card.face) + '" alt="">'
    + '<span class="card__fallback">' + getFaceGlyph(theme, card.face) + '</span>'
    + frame + '</span>';
}

/**
 * Syncs the CSS classes of one card element with its state.
 * @param {number} index - Position of the card inside the deck.
 * @returns {void}
 */
function refreshCard(index) {
  const element = document.querySelector('.card[data-index="' + index + '"]');
  const card = state.cards[index];
  element.classList.toggle('card--open', card.open);
  element.classList.toggle('card--matched', card.matched);
}

/**
 * Static configuration: themes, players and board sizes.
 * Every theme owns its own motif set, so choosing a theme changes both the
 * colour scheme (via CSS custom properties) and the topics of the cards.
 */

/**
 * Every theme owns an ordered list of motifs. `glyphs` mirrors `faces` and is
 * used as a fallback whenever the matching PNG is not (yet) available.
 * `preview` names the motif shown on the settings preview card.
 * @type {{id: string, label: string, prefix: string, preview: string,
 *         frame: (string|null), faces: string[], glyphs: string[]}[]}
 */
const THEMES = [
  {
    id: 'codevibes',
    label: 'Code vibes theme',
    prefix: 'code',
    preview: 'git',
    frame: null,
    faces: ['git', 'ts', 'js', 'html', 'vscode', 'css', 'django', 'angular', 'terminal',
      'python', 'github', 'node', 'bootstrap', 'vue', 'react', 'sass', 'database', 'firebase'],
    glyphs: ['🔀', '🟦', '🟨', '🌐', '🧩', '🎨', '🎸', '🅰️', '⌨️',
      '🐍', '🐙', '🌿', '🅱️', '💚', '⚛️', '💅', '🗄️', '🔥']
  },
  {
    id: 'gaming',
    label: 'Gaming theme',
    prefix: 'game',
    preview: 'dice',
    frame: null,
    faces: ['controller', 'dice', 'pacman', 'pacman-ghost', 'mushroom', 'coin', 'creeper',
      'snake', 'levelup', 'banana', 'maze', 'circle', 'square', 'triangle', 'gameboy',
      'puzzle', 'ace', 'play'],
    glyphs: ['🎮', '🎲', '🟡', '👻', '🍄', '🪙', '🟩',
      '🐍', '⬆️', '🍌', '🌀', '⭕', '🟪', '🔺', '📟',
      '🧩', '🃏', '▶️']
  },
  {
    id: 'daprojects',
    label: 'DA Projects theme',
    prefix: 'da',
    preview: 'shark',
    frame: null,
    faces: ['logo', 'shark', 'chat', 'network', 'coins', 'tree', 'sombrero', 'chef', 'basket',
      'smiley', 'pokeball', 'tictactoe', 'join', 'arrow', 'ramen', 'soup', 'egg', 'sakura'],
    glyphs: ['🎓', '🦈', '💬', '🕸️', '🪙', '🌳', '🎩', '👨‍🍳', '🧺',
      '🙂', '⚪', '❌', '🤝', '➡️', '🍜', '🥣', '🥚', '🌸']
  },
  {
    id: 'foods',
    label: 'Foods theme',
    prefix: 'food',
    preview: 'fries',
    frame: './assets/card-frame-foods.png',
    faces: ['fries', 'pizza', 'sandwich', 'donut', 'sushi', 'corndog', 'burger', 'pretzel',
      'cupcake', 'flan', 'pudding', 'chocolate', 'nuggets', 'wrap', 'taco', 'icecream',
      'salad', 'macaron'],
    glyphs: ['🍟', '🍕', '🥪', '🍩', '🍣', '🌭', '🍔', '🥨',
      '🧁', '🍮', '🍨', '🍫', '🍗', '🌯', '🌮', '🍦',
      '🥗', '🍪']
  }
];

/** @type {{id: string, label: string}[]} */
const PLAYERS = [
  { id: 'blue', label: 'Blue' },
  { id: 'orange', label: 'Orange' }
];

/** @type {{cards: number, label: string}[]} */
const BOARD_SIZES = [
  { cards: 16, label: '16 cards' },
  { cards: 24, label: '24 cards' },
  { cards: 36, label: '36 cards' }
];

/** Viewport width from which the widescreen layout takes over. */
const BREAKPOINT = 1440;

/**
 * Width the design really fills inside the 1440px wide canvas. The canvas
 * keeps empty margins left and right, so scaling to this value instead makes
 * everything larger – only those margins run past the edge.
 *
 * The height deliberately stays at the full 1024px. Cropping it would gain a
 * little more size, but the top edge would then creep closer the shorter the
 * window gets, and the content would appear to drift upwards.
 */
const CONTENT_WIDTH = 1260;

/** Milliseconds two unmatched cards stay visible before they flip back. */
const HIDE_DELAY = 1400;

/** Milliseconds between the last match and the game over screen. */
const END_DELAY = 1200;

/** Milliseconds the game over screen stays before the winner is revealed. */
const OVER_DELAY = 2600;

/**
 * Looks up a theme by its id.
 * @param {string} id - Theme id, e.g. 'codevibes'.
 * @returns {object} The matching theme, or the first theme as fallback.
 */
function getTheme(id) {
  return THEMES.find((theme) => theme.id === id) || THEMES[0];
}

/**
 * Builds the image path of a single card motif.
 * @param {object} theme - Theme object from THEMES.
 * @param {string} face - Motif name, e.g. 'git'.
 * @returns {string} Relative path to the motif image.
 */
function getFacePath(theme, face) {
  return './assets/card-' + theme.prefix + '-' + face + '.png';
}

/**
 * Returns the fallback glyph of a motif, shown when its image is missing.
 * @param {object} theme - Theme object from THEMES.
 * @param {string} face - Motif name, e.g. 'git'.
 * @returns {string} A single emoji character.
 */
function getFaceGlyph(theme, face) {
  return theme.glyphs[theme.faces.indexOf(face)] || '?';
}

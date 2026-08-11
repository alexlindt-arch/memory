/**
 * Static configuration: themes, players, board sizes and timings.
 * Every theme owns its own motif set, so choosing a theme changes both the
 * colour scheme (via CSS custom properties) and the topics of the cards.
 */

import type { BoardSizeOption, Player, Theme, ThemeId } from './types';

/**
 * Builds the URL of a file in `public/`. Vite serves the app from a subfolder
 * on the server, and `BASE_URL` carries that prefix – a bare '/assets/…' would
 * point at the document root and 404.
 * @param file - Path inside `public/`, e.g. 'assets/card-code-git.png'.
 * @returns The URL the browser can load.
 */
export function publicUrl(file: string): string {
  return import.meta.env.BASE_URL + file;
}

/** All four themes in the order they appear on the settings screen. */
export const THEMES: readonly Theme[] = [
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
    frame: publicUrl('assets/card-frame-foods.png'),
    faces: ['fries', 'pizza', 'sandwich', 'donut', 'sushi', 'corndog', 'burger', 'pretzel',
      'cupcake', 'flan', 'pudding', 'chocolate', 'nuggets', 'wrap', 'taco', 'icecream',
      'salad', 'macaron'],
    glyphs: ['🍟', '🍕', '🥪', '🍩', '🍣', '🌭', '🍔', '🥨',
      '🧁', '🍮', '🍨', '🍫', '🍗', '🌯', '🌮', '🍦',
      '🥗', '🍪']
  }
];

/** The two selectable players. */
export const PLAYERS: readonly Player[] = [
  { id: 'blue', label: 'Blue' },
  { id: 'orange', label: 'Orange' }
];

/** The three selectable board sizes. */
export const BOARD_SIZES: readonly BoardSizeOption[] = [
  { cards: 16, label: '16 cards' },
  { cards: 24, label: '24 cards' },
  { cards: 36, label: '36 cards' }
];

/** Viewport width from which the widescreen layout takes over. */
export const BREAKPOINT = 1440;

/**
 * Width the design really fills inside the 1440px wide canvas. The canvas
 * keeps empty margins left and right, so scaling to this value instead makes
 * everything larger – only those margins run past the edge.
 *
 * The height deliberately stays at the full 1024px. Cropping it would gain a
 * little more size, but the top edge would then creep closer the shorter the
 * window gets, and the content would appear to drift upwards.
 */
export const CONTENT_WIDTH = 1260;

/** Milliseconds two unmatched cards stay visible before they flip back. */
export const HIDE_DELAY = 1400;

/** Milliseconds between the last match and the game over screen. */
export const END_DELAY = 1200;

/** Milliseconds the game over screen stays before the winner is revealed. */
export const OVER_DELAY = 2600;

/**
 * Looks up a theme by its id.
 * @param id - Theme id, or null while none has been picked yet.
 * @returns The matching theme, or the first one – which is what the settings
 *   screen shows before a choice is made, without marking it as chosen.
 */
export function getTheme(id: ThemeId | null): Theme {
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0];
}

/**
 * Builds the image path of a single card motif.
 * @param theme - Theme the motif belongs to.
 * @param face - Motif name, e.g. 'git'.
 * @returns URL of the motif image.
 */
export function getFacePath(theme: Theme, face: string): string {
  return publicUrl(`assets/card-${theme.prefix}-${face}.png`);
}

/**
 * Returns the fallback glyph of a motif, shown when its image is missing.
 * @param theme - Theme the motif belongs to.
 * @param face - Motif name, e.g. 'git'.
 * @returns A single emoji character.
 */
export function getFaceGlyph(theme: Theme, face: string): string {
  return theme.glyphs[theme.faces.indexOf(face)] ?? '?';
}

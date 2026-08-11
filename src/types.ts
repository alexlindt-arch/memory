/**
 * Shared types of the game. Everything the modules pass around is described
 * here once, so a wrong theme id or a misspelt player never reaches the DOM.
 */

/** The two players. Doubles as the key of the score object. */
export type PlayerId = 'blue' | 'orange';

/** Outcome of a finished round. */
export type Winner = PlayerId | 'draw';

/** Ids of the four themes. */
export type ThemeId = 'codevibes' | 'gaming' | 'daprojects' | 'foods';

/** The three board sizes, in cards. */
export type BoardSize = 16 | 24 | 36;

/** Ids of all screens the app can show. */
export type ScreenName = 'home' | 'settings' | 'game' | 'gameover' | 'end';

/** The three option groups on the settings screen. */
export type OptionGroup = 'theme' | 'player' | 'size';

/**
 * One theme: its colour scheme lives in the stylesheet, its motifs here.
 * `glyphs` mirrors `faces` and is used whenever a motif image is missing.
 */
export interface Theme {
  readonly id: ThemeId;
  readonly label: string;
  /** File name prefix of this theme's motifs, e.g. 'code' for card-code-*.png. */
  readonly prefix: string;
  /** Motif shown on the settings preview card. */
  readonly preview: string;
  /** Optional frame drawn on top of every card front. */
  readonly frame: string | null;
  readonly faces: readonly string[];
  readonly glyphs: readonly string[];
}

/** One card of the current deck. */
export interface Card {
  readonly face: string;
  open: boolean;
  matched: boolean;
}

/** A selectable player on the settings screen. */
export interface Player {
  readonly id: PlayerId;
  readonly label: string;
}

/** A selectable board size on the settings screen. */
export interface BoardSizeOption {
  readonly cards: BoardSize;
  readonly label: string;
}

/** Placement of a single confetti image, taken from the design. */
export interface ConfettiPiece {
  readonly w: number;
  readonly h: number;
  readonly x: number;
  readonly y: number;
  /** Ready-to-use CSS transform. */
  readonly t: string;
}

/** The running round. Exactly one object of this shape exists. */
export interface GameState {
  /** Null until a theme has been picked – nothing is preselected. */
  theme: ThemeId | null;
  player: PlayerId | null;
  size: BoardSize | null;
  cards: Card[];
  firstIndex: number | null;
  locked: boolean;
  scores: Record<PlayerId, number>;
  turn: PlayerId;
  timer: number | null;
}

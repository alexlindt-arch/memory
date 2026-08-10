/**
 * Screen routing and the quit dialog.
 *
 * Lives in its own module because almost every other module needs to switch
 * screens – importing it from the entry point instead would make the modules
 * import each other in a circle.
 */

import { byId } from './dom';
import type { ScreenName } from './types';

/** Ids of all screens, used to hide the inactive ones. */
const SCREENS: readonly ScreenName[] = ['home', 'settings', 'game', 'gameover', 'end'];

/**
 * Shows one screen and hides all others.
 * @param name - The screen to show.
 * @returns {void}
 */
export function showScreen(name: ScreenName): void {
  SCREENS.forEach((screen) => {
    byId(`screen-${screen}`).hidden = screen !== name;
  });
  document.body.dataset.screen = name;
  closeQuitDialog();
}

/**
 * Opens the "quit game" confirmation dialog.
 * @returns {void}
 */
export function openQuitDialog(): void {
  byId('dialog-quit').hidden = false;
}

/**
 * Closes the "quit game" confirmation dialog.
 * @returns {void}
 */
export function closeQuitDialog(): void {
  byId('dialog-quit').hidden = true;
}

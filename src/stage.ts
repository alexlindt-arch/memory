/**
 * Fits the fixed design canvas to the window.
 */

import { CONTENT_WIDTH } from './config';

/** Height of the design canvas. */
const CANVAS_HEIGHT = 1024;

/**
 * Scales the 1440x1024 design canvas to the viewport. It is scaled to the
 * width the design actually fills, not to the canvas, so only the empty side
 * margins run past the edge; from 1440px up it keeps its size. The canvas
 * width itself follows from this scale in the stylesheet, which keeps it
 * centred from the very first frame.
 * @returns {void}
 */
export function fitStage(): void {
  const scale = Math.min(
    1,
    window.innerWidth / CONTENT_WIDTH,
    window.innerHeight / CANVAS_HEIGHT
  );
  document.documentElement.style.setProperty('--stage-scale', String(scale));
}

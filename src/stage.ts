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
 *
 * The size is read from the document element, not from `window.innerWidth`.
 * On a tablet the canvas deliberately reaches past the left and right edge,
 * and `innerWidth` grows with content that sticks out – it reported 1130px on
 * an 820px iPad. That fed straight back into the scale, which widened the
 * canvas further, and the design ended up cut off on both sides.
 * `clientWidth` is the layout viewport alone and stays put.
 * @returns {void}
 */
export function fitStage(): void {
  const view = document.documentElement;
  const scale = Math.min(
    1,
    view.clientWidth / CONTENT_WIDTH,
    view.clientHeight / CANVAS_HEIGHT
  );
  view.style.setProperty('--stage-scale', String(scale));
}

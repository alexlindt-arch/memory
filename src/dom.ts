/**
 * Typed DOM helpers.
 *
 * `getElementById` returns `HTMLElement | null`, so under `strict` every single
 * lookup would need its own null check. These two helpers do that check once
 * and fail loudly instead: a missing id is a typo in the markup, not a state
 * the game should try to survive.
 */

/**
 * Looks up an element by id and narrows it to the expected type.
 * @param id - The id attribute, without '#'.
 * @returns The element.
 * @throws {Error} When no element with that id exists.
 */
export function byId<T extends HTMLElement = HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing element #${id}`);
  return element as T;
}

/**
 * Looks up the first element matching a selector.
 * @param selector - Any CSS selector.
 * @param scope - Element to search inside, defaults to the whole document.
 * @returns The element.
 * @throws {Error} When nothing matches.
 */
export function query<T extends Element = HTMLElement>(
  selector: string,
  scope: ParentNode = document
): T {
  const element = scope.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element ${selector}`);
  return element;
}

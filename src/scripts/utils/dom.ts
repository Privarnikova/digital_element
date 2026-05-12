/**
 * Возвращает массив элементов по селектору.
 *
 * @param selector CSS-селектор.
 * @param parent Контекст поиска (по умолчанию `document`).
 * @returns Массив найденных элементов (пустой, если ничего не найдено).
 */
export const queryAll = <TElement extends Element = HTMLElement>(
  selector: string,
  parent: Document | Element = document
): TElement[] => {
  return Array.from(parent.querySelectorAll<TElement>(selector));
};

/**
 * Возвращает элемент по селектору либо бросает исключение, если он не найден.
 *
 * @param selector CSS-селектор.
 * @param parent Контекст поиска (по умолчанию `document`).
 * @returns Найденный DOM-элемент.
 * @throws {Error} Если элемент по селектору не найден.
 */
export const queryRequired = <TElement extends Element = HTMLElement>(
  selector: string,
  parent: Document | Element = document
): TElement => {
  const element = parent.querySelector<TElement>(selector);

  if (element === null) {
    throw new Error(`Element not found: ${selector}`);
  }

  return element;
};

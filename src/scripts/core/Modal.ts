import { scrollLock } from "./ScrollLock.js";
import type { IModalOptions } from "../types/index.js";
import { queryAll, queryRequired } from "../utils/dom.js";

const OPEN_CLASS = "modal--open";
const CLOSE_ATTRIBUTE = "data-modal-close";

/**
 * Универсальный класс модального окна.
 *
 * Закрывается по клику на крестик, по клику на фоновый оверлей и по клавише
 * `Escape`. При открытии блокирует скролл страницы через `scrollLock` и
 * передаёт фокус первому интерактивному элементу диалога. При закрытии
 * возвращает фокус на элемент, с которого окно было открыто.
 */
export class Modal {

  private readonly root: HTMLElement;

  private readonly closeOnOverlay: boolean;

  private readonly closeOnEscape: boolean;

  private readonly onOpen: (() => void) | undefined;

  private readonly onClose: (() => void) | undefined;

  private isOpen = false;

  private lastFocusedElement: HTMLElement | null = null;

  /**
   * Находит корневой элемент модалки и привязывает обработчики.
   *
   * @param rootSelector CSS-селектор корневого элемента.
   * @param options Опции поведения модалки.
   */
  public constructor(rootSelector: string, options: IModalOptions = {}) {
    this.root = queryRequired<HTMLElement>(rootSelector);
    this.closeOnOverlay = options.closeOnOverlay ?? true;
    this.closeOnEscape = options.closeOnEscape ?? true;
    this.onOpen = options.onOpen;
    this.onClose = options.onClose;

    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);

    this.root.hidden = false;
    this.root.setAttribute("aria-hidden", "true");

    this.bindEvents();
  }

  /**
   * Открывает модалку, блокирует скролл и переводит фокус внутрь.
   */
  public open(): void {
    if (this.isOpen) {
      return;
    }

    this.lastFocusedElement = document.activeElement as HTMLElement | null;
    this.isOpen = true;
    this.root.classList.add(OPEN_CLASS);
    this.root.setAttribute("aria-hidden", "false");
    scrollLock.lock();
    this.focusFirstInteractive();
    this.onOpen?.();
  }

  /**
   * Закрывает модалку, снимает блокировку скролла и возвращает фокус.
   */
  public close(): void {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    this.root.classList.remove(OPEN_CLASS);
    this.root.setAttribute("aria-hidden", "true");
    scrollLock.unlock();
    this.lastFocusedElement?.focus();
    this.onClose?.();
  }

  /**
   * Переключает состояние модалки: если открыта — закрывает, иначе открывает.
   */
  public toggle(): void {
    if (this.isOpen) {
      this.close();
      return;
    }

    this.open();
  }

  /**
   * Возвращает корневой элемент модалки.
   *
   * @returns Корневой DOM-элемент диалога.
   */
  public getRoot(): HTMLElement {
    return this.root;
  }

  private bindEvents(): void {
    this.root.addEventListener("click", this.handleClick);
    document.addEventListener("keydown", this.handleKeydown);
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;

    if (target === null) {
      return;
    }

    if (this.closeOnOverlay && target.hasAttribute(CLOSE_ATTRIBUTE)) {
      this.close();
      return;
    }

    const closeTrigger = target.closest(`[${CLOSE_ATTRIBUTE}]`);

    if (closeTrigger !== null) {
      this.close();
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (!this.isOpen || !this.closeOnEscape) {
      return;
    }

    if (event.key === "Escape") {
      this.close();
    }
  }

  private focusFirstInteractive(): void {
    const candidates = queryAll<HTMLElement>(
      "input, textarea, select, button:not([data-modal-close])", this.root
    );

    const firstVisible = candidates.find((element) => element.offsetParent !== null);

    firstVisible?.focus({ preventScroll: true });
  }

}

export default Modal;

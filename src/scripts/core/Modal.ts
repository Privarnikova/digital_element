import { scrollLock } from "./ScrollLock.js";
import type { IModalOptions } from "../types/index.js";
import { queryAll, queryRequired } from "../utils/dom.js";

const OPEN_CLASS = "modal--open";
const CLOSE_ATTRIBUTE = "data-modal-close";

/**
 * Универсальный класс модального окна.
 * Закрывается по крестику, по клику на оверлей и по Esc.
 * Блокирует скролл страницы при открытии.
 */
export class Modal {

  private readonly root: HTMLElement;

  private readonly closeOnOverlay: boolean;

  private readonly closeOnEscape: boolean;

  private readonly onOpen: (() => void) | undefined;

  private readonly onClose: (() => void) | undefined;

  private isOpen = false;

  private lastFocusedElement: HTMLElement | null = null;

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

  public toggle(): void {
    if (this.isOpen) {
      this.close();
      return;
    }

    this.open();
  }

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

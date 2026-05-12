/**
 * Блокирует скролл страницы при открытии модального окна и компенсирует
 * исчезновение скроллбара, чтобы фон не "дёргался" при появлении/исчезновении
 * вертикальной полосы прокрутки.
 *
 * Использует счётчик блокировок (`lockCount`), благодаря чему несколько
 * модалок одновременно работают корректно: каждый `lock()` инкрементирует
 * счётчик, каждый `unlock()` декрементирует, а класс на `<body>` снимается
 * только когда счётчик доходит до нуля.
 */
class ScrollLock {

  private readonly bodyClassName = "is-scroll-locked";

  private readonly compensationVariable = "--scrollbar-compensation";

  private lockCount = 0;

  /**
   * Включает блокировку скролла. Можно вызывать многократно — снимется только
   * после стольких же `unlock()`.
   */
  public lock(): void {
    this.lockCount += 1;

    if (this.lockCount > 1) {
      return;
    }

    const scrollbarWidth = this.getScrollbarWidth();

    document.body.style.setProperty(this.compensationVariable, `${scrollbarWidth}px`);
    document.body.classList.add(this.bodyClassName);
  }

  /**
   * Снимает одну блокировку скролла. Когда счётчик доходит до нуля,
   * класс снимается с `<body>` и страницу снова можно скроллить.
   */
  public unlock(): void {
    if (this.lockCount === 0) {
      return;
    }

    this.lockCount -= 1;

    if (this.lockCount > 0) {
      return;
    }

    document.body.classList.remove(this.bodyClassName);
    document.body.style.removeProperty(this.compensationVariable);
  }

  /**
   * Принудительно сбрасывает все блокировки. Полезно при ошибках,
   * когда `unlock()` не успел сработать.
   */
  public reset(): void {
    this.lockCount = 0;
    document.body.classList.remove(this.bodyClassName);
    document.body.style.removeProperty(this.compensationVariable);
  }

  private getScrollbarWidth(): number {
    return window.innerWidth - document.documentElement.clientWidth;
  }

}

/**
 * Глобальный экземпляр `ScrollLock`, чтобы счётчик блокировок был общим
 * для всех модалок страницы.
 */
export const scrollLock = new ScrollLock();
export default ScrollLock;

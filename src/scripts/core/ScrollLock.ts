/**
 * Блокирует скролл страницы при открытии модального окна и
 * компенсирует исчезновение скроллбара, чтобы фон не "дёргался".
 */
class ScrollLock {

  private readonly bodyClassName = "is-scroll-locked";

  private readonly compensationVariable = "--scrollbar-compensation";

  private lockCount = 0;

  public lock(): void {
    this.lockCount += 1;

    if (this.lockCount > 1) {
      return;
    }

    const scrollbarWidth = this.getScrollbarWidth();

    document.body.style.setProperty(this.compensationVariable, `${scrollbarWidth}px`);
    document.body.classList.add(this.bodyClassName);
  }

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

  public reset(): void {
    this.lockCount = 0;
    document.body.classList.remove(this.bodyClassName);
    document.body.style.removeProperty(this.compensationVariable);
  }

  private getScrollbarWidth(): number {
    return window.innerWidth - document.documentElement.clientWidth;
  }

}

export const scrollLock = new ScrollLock();
export default ScrollLock;

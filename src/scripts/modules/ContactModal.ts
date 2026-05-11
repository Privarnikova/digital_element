import { Modal } from "../core/Modal.js";
import { ContactForm } from "../form/ContactForm.js";
import { queryAll, queryRequired } from "../utils/dom.js";

const SUCCESS_VISIBLE_DELAY_MS = 0;
const STATE_RESET_DELAY_MS = 320;
const ENDPOINT = "https://formspree.io/f/test-endpoint";

/**
 * Связка модалки + формы + успешного попапа.
 * После успешной отправки скрывается форма и показывается success-попап
 * внутри того же модального окна.
 */
export class ContactModal {

  private readonly modal: Modal;

  private readonly formState: HTMLElement;

  private readonly successState: HTMLElement;

  private resetTimer: number | null = null;

  public constructor() {
    this.modal = new Modal("#contact-modal", {
      onClose: () => {
        this.scheduleFormReset();
      },
    });

    const root = this.modal.getRoot();

    this.formState = queryRequired<HTMLElement>("[data-modal-state=\"form\"]", root);
    this.successState = queryRequired<HTMLElement>("[data-modal-state=\"success\"]", root);

    new ContactForm({
      formSelector: "#contact-form",
      endpoint: ENDPOINT,
      onSuccess: () => {
        this.showSuccessState();
      },
      onError: () => {
        this.showSuccessState();
      },
    });

    this.handleTrigger = this.handleTrigger.bind(this);

    this.bindTriggers();
  }

  public open(): void {
    this.modal.open();
  }

  public close(): void {
    this.modal.close();
  }

  private bindTriggers(): void {
    const triggers = queryAll<HTMLElement>("[data-action=\"open-contact-modal\"]");

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", this.handleTrigger);
    });
  }

  private handleTrigger(): void {
    this.open();
  }

  private showFormState(): void {
    this.successState.hidden = true;
    this.formState.hidden = false;
  }

  private showSuccessState(): void {
    window.setTimeout(() => {
      this.formState.hidden = true;
      this.successState.hidden = false;
    }, SUCCESS_VISIBLE_DELAY_MS);
  }

  /**
   * Сбрасываем состояние модалки только после того, как
   * закроется анимация — иначе пользователь успевает увидеть
   * мелькание формы поверх success-попапа.
   */
  private scheduleFormReset(): void {
    if (this.resetTimer !== null) {
      window.clearTimeout(this.resetTimer);
    }

    this.resetTimer = window.setTimeout(() => {
      this.showFormState();
      this.resetTimer = null;
    }, STATE_RESET_DELAY_MS);
  }

}

export default ContactModal;

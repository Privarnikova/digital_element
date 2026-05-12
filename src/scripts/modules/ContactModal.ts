import { Modal } from "../core/Modal.js";
import { ContactForm } from "../form/ContactForm.js";
import { FormSender } from "../form/FormSender.js";
import { FormValidator } from "../form/FormValidator.js";
import type { IFieldRule } from "../types/index.js";
import { queryAll, queryRequired } from "../utils/dom.js";
import { EMAIL_PATTERN, NAME_PATTERN } from "../utils/validators.js";

const STATE_RESET_DELAY_MS = 320;
const ENDPOINT = "https://formspree.io/f/test-endpoint";

const FIELD_RULES: ReadonlyArray<IFieldRule> = [
  {
    name: "name",
    required: true,
    minLength: 2,
    maxLength: 60,
    pattern: NAME_PATTERN,
    requiredMessage: "Please enter your name",
    message: "Use letters, spaces and hyphens (2 to 60 characters)",
  },
  {
    name: "email",
    required: true,
    pattern: EMAIL_PATTERN,
    requiredMessage: "Please enter your email",
    message: "Looks like an invalid email address",
  },
  {
    name: "message",
    required: true,
    minLength: 10,
    maxLength: 2000,
    requiredMessage: "Please add a message",
    message: "Message should be 10 to 2000 characters",
  },
];

/**
 * Связка модалки + формы + двух финальных состояний (успех/ошибка).
 *
 * Класс берёт на себя только композицию: создаёт инстансы валидатора и
 * отправщика, инжектирует их в `ContactForm` и переключает видимые
 * состояния модального окна по результату отправки. Сетевая ошибка
 * показывает отдельный error-стейт с предупреждением и кнопкой
 * «Попробовать снова», как требует ТЗ.
 */
export class ContactModal {

  private readonly modal: Modal;

  private readonly formState: HTMLElement;

  private readonly successState: HTMLElement;

  private readonly errorState: HTMLElement;

  private resetTimer: number | null = null;

  /**
   * Собирает все зависимости и привязывает обработчики триггеров и retry-кнопки.
   */
  public constructor() {
    this.modal = new Modal("#contact-modal", {
      onClose: () => {
        this.scheduleFormReset();
      },
    });

    const root = this.modal.getRoot();

    this.formState = queryRequired<HTMLElement>("[data-modal-state=\"form\"]", root);
    this.successState = queryRequired<HTMLElement>("[data-modal-state=\"success\"]", root);
    this.errorState = queryRequired<HTMLElement>("[data-modal-state=\"error\"]", root);

    const form = queryRequired<HTMLFormElement>("#contact-form", root);
    const validator = new FormValidator(form, FIELD_RULES);
    const sender = new FormSender({ endpoint: ENDPOINT });

    new ContactForm({
      form,
      validator,
      sender,
      onSuccess: () => {
        this.showSuccessState();
      },
      onError: () => {
        this.showErrorState();
      },
    });

    this.handleTrigger = this.handleTrigger.bind(this);
    this.handleRetry = this.handleRetry.bind(this);

    this.bindTriggers();
    this.bindRetry();
  }

  /**
   * Открывает модалку.
   */
  public open(): void {
    this.modal.open();
  }

  /**
   * Закрывает модалку.
   */
  public close(): void {
    this.modal.close();
  }

  private bindTriggers(): void {
    const triggers = queryAll<HTMLElement>("[data-action=\"open-contact-modal\"]");

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", this.handleTrigger);
    });
  }

  private bindRetry(): void {
    const retryButton = this.errorState.querySelector<HTMLButtonElement>(
      "[data-action=\"retry-contact-form\"]"
    );

    retryButton?.addEventListener("click", this.handleRetry);
  }

  private handleTrigger(): void {
    this.open();
  }

  private handleRetry(): void {
    this.showFormState();
  }

  private showFormState(): void {
    this.successState.hidden = true;
    this.errorState.hidden = true;
    this.formState.hidden = false;
  }

  private showSuccessState(): void {
    this.formState.hidden = true;
    this.errorState.hidden = true;
    this.successState.hidden = false;
  }

  private showErrorState(): void {
    this.formState.hidden = true;
    this.successState.hidden = true;
    this.errorState.hidden = false;
  }

  /**
   * Сбрасываем состояние модалки только после того, как
   * закроется анимация — иначе пользователь успевает увидеть
   * мелькание формы поверх success/error-попапа.
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

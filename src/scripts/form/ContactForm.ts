import type {
  IFormSender,
  IFormValidator,
  TFormPayload,
} from "../types/index.js";
import { queryRequired } from "../utils/dom.js";

const SUBMIT_DISABLED_CLASS = "form__submit--disabled";

/**
 * Опции конструктора `ContactForm`.
 *
 * Валидатор и отправщик передаются снаружи (инверсия зависимостей):
 * сам класс не знает, какие именно реализации стоят за ними.
 */
export interface IContactFormOptions<TPayload extends TFormPayload> {
  readonly form: HTMLFormElement;
  readonly validator: IFormValidator;
  readonly sender: IFormSender<TPayload>;
  readonly onSuccess: (payload: TPayload) => void;
  readonly onError?: (error: Error) => void;
}

/**
 * Координирует жизненный цикл формы: валидация → сбор payload → отправка.
 *
 * Класс не создаёт зависимости сам, а принимает их через конструктор,
 * что делает его независимым от конкретных реализаций валидатора и
 * отправщика — любой класс, удовлетворяющий `IFormValidator`/`IFormSender`,
 * подходит без правок этого файла.
 */
export class ContactForm<TPayload extends TFormPayload = TFormPayload> {

  private readonly form: HTMLFormElement;

  private readonly submitButton: HTMLButtonElement;

  private readonly validator: IFormValidator;

  private readonly sender: IFormSender<TPayload>;

  private readonly onSuccess: (payload: TPayload) => void;

  private readonly onError: ((error: Error) => void) | undefined;

  private isSubmitting = false;

  /**
   * Привязывает форму к инжектированным валидатору и отправщику.
   *
   * @param options Форма и инжектированные зависимости (валидатор, отправщик, колбэки).
   */
  public constructor(options: IContactFormOptions<TPayload>) {
    this.form = options.form;
    this.submitButton = queryRequired<HTMLButtonElement>("button[type=\"submit\"]", this.form);
    this.validator = options.validator;
    this.sender = options.sender;
    this.onSuccess = options.onSuccess;
    this.onError = options.onError;

    this.handleSubmit = this.handleSubmit.bind(this);

    this.form.addEventListener("submit", this.handleSubmit);
  }

  /**
   * Сбрасывает значения и состояние ошибок формы.
   */
  public reset(): void {
    this.form.reset();
    this.validator.reset();
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault();
    this.runSubmit();
  }

  private runSubmit(): void {
    if (this.isSubmitting) {
      return;
    }

    const result = this.validator.validate();

    if (!result.isValid) {
      this.focusFirstInvalidField();
      return;
    }

    const payload = this.sender.collect(this.form);

    this.setSubmittingState(true);

    this.sender
      .send(payload)
      .then(() => {
        this.onSuccess(payload);
        this.reset();
        return undefined;
      })
      .catch((error: unknown) => {
        const reason = error instanceof Error ? error : new Error("Unable to send the form");

        this.onError?.(reason);
      })
      .finally(() => {
        this.setSubmittingState(false);
      });
  }

  private setSubmittingState(submitting: boolean): void {
    this.isSubmitting = submitting;
    this.submitButton.disabled = submitting;
    this.submitButton.classList.toggle(SUBMIT_DISABLED_CLASS, submitting);
    this.submitButton.textContent = submitting ? "Sending…" : "Submit";
  }

  private focusFirstInvalidField(): void {
    const invalidField = this.form.querySelector<HTMLElement>(".form__field--invalid");

    if (invalidField === null) {
      return;
    }

    const control = invalidField.querySelector<HTMLInputElement | HTMLTextAreaElement>(
      "input, textarea"
    );

    control?.focus();
  }

}

export default ContactForm;

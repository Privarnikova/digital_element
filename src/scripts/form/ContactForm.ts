import { FormSender } from "./FormSender.js";
import { FormValidator } from "./FormValidator.js";
import type { IFieldRule, IFormPayload } from "../types/index.js";
import { queryRequired } from "../utils/dom.js";
import { EMAIL_PATTERN, NAME_PATTERN } from "../utils/validators.js";

const SUBMIT_DISABLED_CLASS = "form__submit--disabled";

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

interface IContactFormOptions {
  readonly formSelector: string;
  readonly endpoint: string;
  readonly onSuccess: (payload: IFormPayload) => void;
  readonly onError?: (error: Error) => void;
}

/**
 * Координирует валидатор и отправщик формы.
 * Не использует сторонние библиотеки и нативные browser-tooltips.
 */
export class ContactForm {

  private readonly form: HTMLFormElement;

  private readonly submitButton: HTMLButtonElement;

  private readonly validator: FormValidator;

  private readonly sender: FormSender;

  private readonly onSuccess: (payload: IFormPayload) => void;

  private readonly onError: ((error: Error) => void) | undefined;

  private isSubmitting = false;

  public constructor(options: IContactFormOptions) {
    this.form = queryRequired<HTMLFormElement>(options.formSelector);
    this.submitButton = queryRequired<HTMLButtonElement>("button[type=\"submit\"]", this.form);
    this.validator = new FormValidator(this.form, FIELD_RULES);
    this.sender = new FormSender({ endpoint: options.endpoint });
    this.onSuccess = options.onSuccess;
    this.onError = options.onError;

    this.handleSubmit = this.handleSubmit.bind(this);

    this.form.addEventListener("submit", this.handleSubmit);
  }

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

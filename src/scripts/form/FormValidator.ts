import type { IFieldRule, IValidationResult, TFieldName } from "../types/index.js";
import { isEmptyString } from "../utils/validators.js";

const INVALID_CLASS = "form__field--invalid";

/**
 * Кастомная валидация формы.
 * Не полагается на нативные браузерные подсказки и атрибут required.
 */
export class FormValidator {

  private readonly form: HTMLFormElement;

  private readonly rules: ReadonlyArray<IFieldRule>;

  private readonly fieldElements: Map<TFieldName, HTMLElement> = new Map();

  private readonly errorElements: Map<TFieldName, HTMLElement> = new Map();

  public constructor(form: HTMLFormElement, rules: ReadonlyArray<IFieldRule>) {
    this.form = form;
    this.rules = rules;

    this.handleInput = this.handleInput.bind(this);

    this.cacheElements();
    this.bindLiveValidation();
  }

  public validate(): IValidationResult {
    const errors = new Map<TFieldName, string>();

    for (const rule of this.rules) {
      const errorMessage = this.validateField(rule);

      if (errorMessage !== null) {
        errors.set(rule.name, errorMessage);
      }
    }

    this.applyErrors(errors);

    return {
      isValid: errors.size === 0,
      errors,
    };
  }

  public reset(): void {
    for (const fieldElement of this.fieldElements.values()) {
      fieldElement.classList.remove(INVALID_CLASS);
    }

    for (const errorElement of this.errorElements.values()) {
      errorElement.textContent = "";
    }
  }

  private cacheElements(): void {
    for (const rule of this.rules) {
      const fieldElement = this.form.querySelector<HTMLElement>(`[data-field="${rule.name}"]`);
      const errorElement = this.form.querySelector<HTMLElement>(`[data-error-for="${rule.name}"]`);

      if (fieldElement !== null) {
        this.fieldElements.set(rule.name, fieldElement);
      }

      if (errorElement !== null) {
        this.errorElements.set(rule.name, errorElement);
      }
    }
  }

  private bindLiveValidation(): void {
    for (const rule of this.rules) {
      const control = this.getControl(rule.name);

      if (control === null) {
        continue;
      }

      control.addEventListener("blur", this.handleInput);
      control.addEventListener("input", this.handleInput);
      control.addEventListener("change", this.handleInput);
    }
  }

  private handleInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | null;

    if (target === null) {
      return;
    }

    const rule = this.rules.find((item) => item.name === target.name);

    if (rule === undefined) {
      return;
    }

    const errorMessage = this.validateField(rule);

    this.applyFieldError(rule.name, errorMessage);
  }

  private validateField(rule: IFieldRule): string | null {
    const control = this.getControl(rule.name);

    if (control === null) {
      return null;
    }

    if (control instanceof HTMLInputElement && control.type === "checkbox") {
      if (rule.required && !control.checked) {
        return rule.requiredMessage ?? rule.message;
      }

      return null;
    }

    const rawValue = control.value;
    const value = rawValue.trim();

    if (rule.required && isEmptyString(value)) {
      return rule.requiredMessage ?? rule.message;
    }

    if (!rule.required && isEmptyString(value)) {
      return null;
    }

    if (rule.minLength !== undefined && value.length < rule.minLength) {
      return rule.message;
    }

    if (rule.maxLength !== undefined && value.length > rule.maxLength) {
      return rule.message;
    }

    if (rule.pattern !== undefined && !rule.pattern.test(value)) {
      return rule.message;
    }

    return null;
  }

  private getControl(name: TFieldName): HTMLInputElement | HTMLTextAreaElement | null {
    const element = this.form.elements.namedItem(name);

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      return element;
    }

    return null;
  }

  private applyErrors(errors: Map<TFieldName, string>): void {
    for (const rule of this.rules) {
      const message = errors.get(rule.name) ?? null;

      this.applyFieldError(rule.name, message);
    }
  }

  private applyFieldError(name: TFieldName, message: string | null): void {
    const fieldElement = this.fieldElements.get(name);
    const errorElement = this.errorElements.get(name);

    if (fieldElement === undefined || errorElement === undefined) {
      return;
    }

    if (message === null) {
      fieldElement.classList.remove(INVALID_CLASS);
      errorElement.textContent = "";
      return;
    }

    fieldElement.classList.add(INVALID_CLASS);
    errorElement.textContent = message;
  }

}

export default FormValidator;

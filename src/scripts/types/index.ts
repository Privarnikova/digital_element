/**
 * Правило валидации одного поля формы.
 * Имя поля — обычная строка, не привязано к фиксированному перечислению.
 */
export interface IFieldRule {
  readonly name: string;
  readonly required: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: RegExp;
  readonly message: string;
  readonly requiredMessage?: string;
}

/**
 * Абстракция отправщика формы.
 * `collect` извлекает payload из DOM, `send` доставляет его на сервер.
 */
export interface IFormSender<TPayload extends TFormPayload = TFormPayload> {

  /**
   * Собирает payload формы для отправки.
   *
   * @param form Корневой элемент формы.
   */
  collect(form: HTMLFormElement): TPayload;

  /**
   * Отправляет уже собранный payload на сервер.
   *
   * @param payload Готовые данные формы.
   */
  send(payload: TPayload): Promise<void>;

}

/**
 * Параметры конструктора отправщика формы.
 */
export interface IFormSenderOptions {
  readonly endpoint: string;
  readonly method?: "POST" | "PUT";
  readonly headers?: Record<string, string>;
}

/**
 * Абстракция валидатора формы.
 * Позволяет внедрять любую реализацию через конструктор зависимостей.
 */
export interface IFormValidator {

  /**
   * Запускает полную валидацию формы и возвращает результат.
   */
  validate(): IValidationResult;

  /**
   * Сбрасывает видимые ошибки на форме.
   */
  reset(): void;

}

/**
 * Параметры конструктора модального окна.
 */
export interface IModalOptions {
  readonly closeOnOverlay?: boolean;
  readonly closeOnEscape?: boolean;
  readonly onOpen?: () => void;
  readonly onClose?: () => void;
}

/**
 * Результат запуска валидации формы целиком.
 */
export interface IValidationResult {
  readonly isValid: boolean;
  readonly errors: ReadonlyMap<string, string>;
}

/**
 * Полезная нагрузка формы — произвольная карта строковых значений.
 * Конкретные поля не зашиты в тип, чтобы он одинаково описывал
 * формы любого размера и состава.
 */
export type TFormPayload = Record<string, string>;

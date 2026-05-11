export interface IFieldRule {
  readonly name: TFieldName;
  readonly required: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: RegExp;
  readonly message: string;
  readonly requiredMessage?: string;
}

export interface IFormPayload {
  readonly name: string;
  readonly email: string;
  readonly message: string;
}

export interface IFormSenderOptions {
  readonly endpoint: string;
  readonly method?: "POST" | "PUT";
  readonly headers?: Record<string, string>;
}

export interface IModalOptions {
  readonly closeOnOverlay?: boolean;
  readonly closeOnEscape?: boolean;
  readonly onOpen?: () => void;
  readonly onClose?: () => void;
}

export interface IValidationResult {
  readonly isValid: boolean;
  readonly errors: ReadonlyMap<TFieldName, string>;
}

export type TFieldName = "name" | "email" | "message";

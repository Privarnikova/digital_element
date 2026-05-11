import type { IFormPayload, IFormSenderOptions } from "../types/index.js";

/**
 * Сбор и отправка данных формы методом fetch.
 * URL может быть любым; в случае реального бэкенда замените endpoint.
 */
export class FormSender {

  private readonly endpoint: string;

  private readonly method: "POST" | "PUT";

  private readonly headers: Record<string, string>;

  public constructor(options: IFormSenderOptions) {
    this.endpoint = options.endpoint;
    this.method = options.method ?? "POST";
    this.headers = {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    };
  }

  public collect(form: HTMLFormElement): IFormPayload {
    const data = new FormData(form);

    return {
      name: this.readString(data.get("name")),
      email: this.readString(data.get("email")),
      message: this.readString(data.get("message")),
    };
  }

  public send(payload: IFormPayload): Promise<void> {
    return fetch(this.endpoint, {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        return undefined;
      })
      .catch((error: unknown) => {
        const reason = error instanceof Error ? error : new Error("Unknown network error");

        throw reason;
      });
  }

  private readString(value: FormDataEntryValue | null): string {
    if (typeof value !== "string") {
      return "";
    }

    return value.trim();
  }

}

export default FormSender;

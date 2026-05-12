import type {
  IFormSender,
  IFormSenderOptions,
  TFormPayload,
} from "../types/index.js";

/**
 * Универсальный отправщик данных формы.
 *
 * Класс не знает, какие поля у формы: payload собирается из всех именованных
 * контролов через `FormData`, благодаря чему один и тот же экземпляр подходит
 * под форму любого состава. Тип payload параметризован, чтобы при желании
 * вызвать `new FormSender<TMyShape>()` и получить типобезопасный результат
 * `collect`/`send`.
 */
export class FormSender<TPayload extends TFormPayload = TFormPayload>
implements IFormSender<TPayload> {

  private readonly endpoint: string;

  private readonly method: "POST" | "PUT";

  private readonly headers: Record<string, string>;

  /**
   * Сохраняет конфигурацию отправщика для последующих вызовов `send`.
   *
   * @param options Опции отправщика (endpoint, метод, дополнительные заголовки).
   */
  public constructor(options: IFormSenderOptions) {
    this.endpoint = options.endpoint;
    this.method = options.method ?? "POST";
    this.headers = {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    };
  }

  /**
   * Собирает все именованные строковые значения формы в payload.
   * Файлы и прочие нестроковые `FormDataEntryValue` отбрасываются.
   *
   * @param form Корневой элемент формы.
   * @returns Карта `имя поля → значение`.
   */
  public collect(form: HTMLFormElement): TPayload {
    const data = new FormData(form);
    const payload: Record<string, string> = {};

    data.forEach((value, name) => {
      if (typeof value === "string") {
        payload[name] = value.trim();
      }
    });

    return payload as TPayload;
  }

  /**
   * Сериализует payload в JSON и отправляет на `endpoint`.
   *
   * @param payload Готовые данные формы.
   * @returns Promise, который завершится успехом при HTTP 2xx и
   *   будет отвергнут Error'ом при сетевой ошибке или статусе ≥ 400.
   */
  public send(payload: TPayload): Promise<void> {
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

}

export default FormSender;

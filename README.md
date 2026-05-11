# Afrianska — landing page

Тестовое задание по вёрстке для **Цифрового Элемента**. Светлый брендовый landing с блобовой иллюстрацией, услугами в зигзаге, секцией клиентов и CTA-блоком с модальной формой.

## Стек

- **Vite 5** — сборщик (dev-сервер + production build)
- **TypeScript 5** — основной язык, ES6-классы и модули
- **PostCSS** + `postcss-import`, `postcss-nested`, `postcss-preset-env`, `autoprefixer`
- **ESLint 9** (flat config) + [`@delement/eslint-config-master`](https://www.npmjs.com/package/@delement/eslint-config-master) — правила от Цифрового Элемента
- Google Fonts: Playfair Display (заголовки) + Poppins (текст)
- Никаких сторонних UI-фреймворков, библиотек валидации, jQuery

## Команды

```bash
npm install          # установка зависимостей
npm run dev          # dev-сервер на http://localhost:5173
npm run build        # production-сборка в dist/
npm run preview      # просмотр собранной версии
npm run lint         # линт TS/JS файлов
npm run lint:fix     # линт + автофикс
```

## Структура проекта

```
.
├── index.html
├── vite.config.ts
├── tsconfig.json
├── postcss.config.js
├── eslint.config.js
├── .browserslistrc
└── src/
    ├── main.ts
    ├── styles/
    │   ├── index.css            # корневой импорт
    │   ├── reset.css
    │   ├── variables.css        # палитра, типографика, размеры
    │   └── base.css             # body, .container, .section, заголовки
    ├── blocks/
    │   ├── button/              # .button, .button--primary/--ghost/--on-blue
    │   ├── header/              # логотип + бургер
    │   ├── hero/                # титульный экран с блоб-иллюстрацией
    │   ├── services/            # 3 карточки в зигзаге
    │   ├── clients/             # сетка логотипов на синем фоне
    │   ├── cta/                 # «Intersted to work with our team?»
    │   ├── footer/              # тёмно-синий футер с округлым углом
    │   ├── modal/               # универсальный диалог
    │   ├── form/                # инпуты, лейблы, ошибки, чекбокс
    │   └── success/             # успех-экран с галочкой
    ├── scripts/
    │   ├── core/   Modal.ts · ScrollLock.ts
    │   ├── form/   FormValidator.ts · FormSender.ts · ContactForm.ts
    │   ├── modules/ ContactModal.ts
    │   ├── utils/  dom.ts · validators.ts
    │   └── types/  index.ts (I-префикс / T-префикс)
    └── assets/icons/            # SVG: логотип, бургер, стрелка, иллюстрации
```

## Что закрыли по ТЗ

### Сборка

- три скрипта по требованию: `dev`, `build` (с `tsc --noEmit`), `lint` (плюс `preview` и `lint:fix`);
- task-менеджер Vite, процессор стилей PostCSS, линтер ESLint;
- ESLint подключает `@delement/eslint-config-master` через flat config (ESLint 9).

### HTML / CSS

- семантическая разметка: `header`, `main`, `section`, `nav`, `footer`, заголовки `h1`/`h2`/`h3`;
- БЭМ во всех блоках (`.block`, `.block__element`, `.block--modifier`);
- адаптив с брейкпоинтами 1024 / 768 / 480 / 360 px;
- иконки и иллюстрации — только SVG из `src/assets/icons`;
- никаких CSS-сеток или компонентных пакетов; свой минимальный reset;
- модалка закрывается крестиком, кликом на оверлей и по `Esc`;
- блокировка скролла страницы (`is-scroll-locked`) с компенсацией ширины скроллбара;
- анимации: появление hero, лёгкая «качка» иллюстрации, hover на карточках, slide-up модалки, success-pop галочки.

### JavaScript / TypeScript

- ES6+, классы, модули, `import`/`export`;
- никаких сторонних библиотек, нет `console.log` / `alert`;
- обработчики только вызывают методы (`handleSubmit → runSubmit`, `handleTrigger → open`);
- интерфейсы с `I`-префиксом, типы с `T`-префиксом — соответствует правилам ЦЭ;
- кастомная валидация формы (без атрибута `required` и без браузерных подсказок) через `FormValidator`;
- сбор данных формы и `fetch`-отправка в `FormSender` с обязательным `.catch()` и `return` в `.then()`;
- успех показывает success-блок в той же модалке.

## Где быстро поправить под точные значения макета

| Что | Файл |
| --- | --- |
| Цвета, шрифты, размеры, радиусы | `src/styles/variables.css` |
| Контент секций | `index.html` |
| Поля формы / правила валидации | `src/scripts/form/ContactForm.ts` (массив `FIELD_RULES`) |
| Endpoint отправки | `src/scripts/modules/ContactModal.ts` (константа `ENDPOINT`) |
| Иллюстрация hero | `src/assets/icons/hero-illustration.svg` |
| Иконки сервисов | `src/assets/icons/service-*.svg` |
| Логотип | `src/assets/icons/logo.svg` и `logo-white.svg` |

Иллюстрации сейчас — упрощённые SVG-плейсхолдеры. Финальные ассеты лучше экспортировать из Figma и заменить файлы по тем же путям.

## Безопасность

```bash
npm audit --omit=dev  # должен быть чистым (рантайм-зависимостей нет)
```

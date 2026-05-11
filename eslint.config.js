import delementConfig from "@delement/eslint-config-master";

export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "public/**",
      "*.config.js",
      "*.config.ts",
      "vite.config.ts",
      "postcss.config.js",
      "eslint.config.js",
    ],
  },
  ...delementConfig,
  {
    files: ["src/**/*.{ts,js}"],
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        HTMLElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLTextAreaElement: "readonly",
        HTMLFormElement: "readonly",
        HTMLButtonElement: "readonly",
        Element: "readonly",
        Event: "readonly",
        SubmitEvent: "readonly",
        MouseEvent: "readonly",
        KeyboardEvent: "readonly",
        FormData: "readonly",
        FormDataEntryValue: "readonly",
        fetch: "readonly",
        console: "readonly",
      },
    },
    rules: {
      // Дисейблим JSDoc-обязаловку: лендинг-проект, JSDoc избыточен.
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-param-description": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/require-returns-description": "off",
      "jsdoc/require-param-type": "off",
      "jsdoc/require-returns-type": "off",
      // React-правила не нужны.
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-refresh/only-export-components": "off",
    },
  },
];

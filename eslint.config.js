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
  },
];

import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: ".",
  base: "./",
  publicDir: "public",
  resolve: {
    alias: {
      "@": resolve(projectRoot, "src"),
      "@blocks": resolve(projectRoot, "src/blocks"),
      "@scripts": resolve(projectRoot, "src/scripts"),
      "@styles": resolve(projectRoot, "src/styles"),
      "@assets": resolve(projectRoot, "src/assets"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    cssMinify: true,
    minify: "esbuild",
    target: "es2020",
    rollupOptions: {
      input: {
        main: resolve(projectRoot, "index.html"),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
    host: true,
  },
});

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    {
      name: "erudite-development-entry",
      apply: "serve",
      transformIndexHtml: {
        order: "pre",
        handler(html) {
          return html
            .replace(/<link\b(?=[^>]*\bdata-app-style\b)[^>]*>/, "")
            .replace(
              /<script\b(?=[^>]*\bdata-app-entry\b)[^>]*>[\s\S]*?<\/script>/,
              '<script type="module" src="/src/main.tsx"></script>',
            )
            .replace("./public/favicon.svg", "./favicon.svg");
        },
      },
    },
  ],
  base: "./",
  define:
    command === "build"
      ? { "process.env.NODE_ENV": JSON.stringify("production") }
      : {},
  build: {
    outDir: "public/standalone",
    emptyOutDir: true,
    copyPublicDir: false,
    lib: {
      entry: "src/main.tsx",
      name: "Erudite",
      formats: ["iife"],
      fileName: () => "app.js",
      cssFileName: "app",
    },
  },
  test: { environment: "node" },
}));

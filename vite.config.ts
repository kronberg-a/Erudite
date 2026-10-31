import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { articleHandler } from "./server/article";
import { geminiHandler } from "./server/gemini";
import { loadEnv } from "vite";
export default defineConfig(({ command, mode }) => {
  const envKey = loadEnv(mode, process.cwd(), "").GEMINI_API_KEY;
  if (!process.env.GEMINI_API_KEY && envKey) process.env.GEMINI_API_KEY = envKey;
  return ({
  plugins: [
    react(),
    {
      name: "erudite-article-api",
      configureServer(server) { server.middlewares.use("/api/article", articleHandler); server.middlewares.use("/api/gemini", geminiHandler); },
      configurePreviewServer(server) { server.middlewares.use("/api/article", articleHandler); server.middlewares.use("/api/gemini", geminiHandler); },
    },
    {
      name: "erudite-development-entry",
      apply: "serve",
      transformIndexHtml: {
        order: "pre",
        handler(html) {
          return html
            .replace(/<script\b(?=[^>]*\bdata-pwa\b)[^>]*>[\s\S]*?<\/script>/, "")
            .replace(/<link\b(?=[^>]*\bdata-app-style\b)[^>]*>/, "")
            .replace(
              /<script\b(?=[^>]*\bdata-app-entry\b)[^>]*>[\s\S]*?<\/script>/,
              '<script type="module" src="/src/main.tsx"></script>',
            )
            .replaceAll("./public/", "./");
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
}); });

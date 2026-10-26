import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Script } from "node:vm";
import { describe, expect, it } from "vitest";

describe("direct-open HTML entry", () => {
  const html = readFileSync("index.html", "utf8");
  it("loads a bundled classic script instead of raw TypeScript or an ES module", () => {
    const tag = html.match(/<script\b[^>]*\bdata-app-entry\b[^>]*>/)?.[0];
    expect(tag).toBeTruthy();
    expect(tag).not.toMatch(/type=["']module["']/);
    const src = tag?.match(/src=["']([^"']+)["']/)?.[1];
    expect(src).toBe("./public/standalone/app.js");
    const bundle = readFileSync(resolve(src!), "utf8");
    expect(bundle.length).toBeGreaterThan(100_000);
    expect(() => new Script(bundle)).not.toThrow();
    expect(html).not.toContain("/src/main.tsx");
  });
  it("ships its stylesheet alongside the application", () => {
    const css = html.match(
      /<link\b[^>]*\bdata-app-style\b[^>]*href=["']([^"']+)["']/,
    )?.[1];
    expect(css).toBe("./public/standalone/app.css");
    expect(readFileSync(resolve(css!), "utf8")).toContain(".flashcard");
  });
});

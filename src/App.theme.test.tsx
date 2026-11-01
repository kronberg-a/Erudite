// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { defaultSettings } from "./services/storage";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it("applies the saved theme before rendering and updates native color hints when toggled", async () => {
  localStorage.clear(); sessionStorage.clear();
  const themeMeta = document.createElement("meta"); themeMeta.name = "theme-color";
  const schemeMeta = document.createElement("meta"); schemeMeta.name = "color-scheme";
  document.head.append(themeMeta, schemeMeta);
  localStorage.setItem("erudite:v3", JSON.stringify({ version: 3, reviewOrder: 0, settings: { ...defaultSettings, theme: "dark" }, pairs: {} }));
  const startup = readFileSync("index.html", "utf8").match(/<script>([\s\S]*?)<\/script>/)![1];
  const host = document.createElement("div"); document.body.append(host);
  const root = createRoot(host);
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ configured: false }) }));
  const check = (theme: "dark" | "light") => {
    expect(document.documentElement.classList.contains("dark")).toBe(theme === "dark");
    expect(document.documentElement.style.colorScheme).toBe(theme);
    expect(document.documentElement.style.backgroundColor).toBe(theme === "dark" ? "rgb(9, 13, 22)" : "rgb(248, 250, 252)");
    expect(themeMeta.content).toBe(theme === "dark" ? "#090D16" : "#F8FAFC");
    expect(schemeMeta.content).toBe(theme);
  };
  try {
    runInNewContext(startup, { document, localStorage });
    check("dark");
    const { default: App } = await import("./App");
    await act(async () => root.render(<App />));
    check("dark");
    act(() => host.querySelector<HTMLButtonElement>('button[aria-label="Light"]')!.click());
    check("light");
    act(() => host.querySelector<HTMLButtonElement>('button[aria-label="Dark"]')!.click());
    check("dark");
  } finally {
    act(() => root.unmount()); host.remove(); themeMeta.remove(); schemeMeta.remove();
    document.documentElement.classList.remove("dark");
    document.documentElement.style.removeProperty("color-scheme");
    document.documentElement.style.removeProperty("background-color");
    localStorage.clear(); sessionStorage.clear(); vi.unstubAllGlobals();
  }
});

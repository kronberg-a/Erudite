// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { clearPairUiState, readUiState, uiString, writeUiState } from "./useUiState";
afterEach(() => { vi.restoreAllMocks(); sessionStorage.clear(); });
it("rejects invalid recovery data and tolerates unavailable or full storage", () => {
  sessionStorage.setItem("erudite:ui:v1:page", "{broken");
  expect(readUiState("page", "learn", uiString)).toBe("learn");
  sessionStorage.setItem("erudite:ui:v1:page", "42");
  expect(readUiState("page", "learn", uiString)).toBe("learn");
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("Unavailable"); });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Quota"); });
  expect(readUiState("page", "learn", uiString)).toBe("learn");
  expect(() => writeUiState("page", "reader")).not.toThrow();
});
it("clears pair recovery on backup restore without deleting navigation or unrelated session data", () => {
  writeUiState("pair:en-de:reader:article", { title: "Old" });
  writeUiState("pair:en-fr:study", { queue: ["old"] });
  writeUiState("page", "settings"); sessionStorage.setItem("unrelated", "keep");
  clearPairUiState();
  expect(sessionStorage.getItem("erudite:ui:v1:pair:en-de:reader:article")).toBeNull();
  expect(sessionStorage.getItem("erudite:ui:v1:pair:en-fr:study")).toBeNull();
  expect(readUiState("page", "learn", uiString)).toBe("settings");
  expect(sessionStorage.getItem("unrelated")).toBe("keep");
});

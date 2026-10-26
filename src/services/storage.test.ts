import { describe, expect, it } from "vitest";
import { defaultSettings, validateData } from "./storage";
import { seedPair } from "../i18n/seedData";
describe("versioned data validation", () => {
  const data = {
    version: 1,
    settings: defaultSettings,
    pairs: { "en-de": seedPair("en", "de") },
  };
  it("accepts the initial schema", () => expect(validateData(data)).toBe(true));
  it("rejects invalid versions, settings, same-language pairs and malformed words", () => {
    expect(validateData(null)).toBe(false);
    expect(validateData({ ...data, version: 2 })).toBe(false);
    expect(
      validateData({
        ...data,
        settings: { ...defaultSettings, sourceLanguage: "de" },
      }),
    ).toBe(false);
    expect(
      validateData({
        ...data,
        settings: { ...defaultSettings, dailyNewCardsCap: -1 },
      }),
    ).toBe(false);
    expect(
      validateData({
        ...data,
        pairs: { "en-de": { ...data.pairs["en-de"], words: [{ id: "x" }] } },
      }),
    ).toBe(false);
  });
});

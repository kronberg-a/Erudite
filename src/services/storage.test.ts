import { describe, expect, it } from "vitest";
import { defaultSettings, hydrateData, validateData } from "./storage";
import { seedPair } from "../i18n/seedData";
describe("versioned data validation", () => {
  const data = {
    version: 1,
    settings: defaultSettings,
    pairs: { "en-de": seedPair("en", "de") },
  };
  it("accepts the initial schema", () => expect(validateData(data)).toBe(true));
  it("hydrates older v1 settings without changing pair progress", () => {
    const {
      studyMode: _mode,
      strictAccents: _accents,
      ...oldSettings
    } = defaultSettings;
    const legacy = { ...data, settings: oldSettings };
    expect(validateData(legacy)).toBe(true);
    if (validateData(legacy)) {
      const migrated = hydrateData(legacy);
      expect(migrated.settings.studyMode).toBe("SWIPE_ONLY");
      expect(migrated.settings.strictAccents).toBe(true);
      expect(migrated.pairs).toBe(data.pairs);
    }
  });
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

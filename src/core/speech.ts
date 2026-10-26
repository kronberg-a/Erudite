import type { Language } from "../types";
const locales: Record<Language, string> = {
  en: "en-US",
  ru: "ru-RU",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
  es: "es-ES",
};
export function speak(text: string, language: Language): boolean {
  if (!("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locales[language];
  utterance.rate = 0.85;
  const voice =
    window.speechSynthesis.getVoices().find((v) => v.lang === utterance.lang) ??
    window.speechSynthesis.getVoices().find((v) => v.lang.startsWith(language));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
  return true;
}

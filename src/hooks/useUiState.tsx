import { createContext, useContext, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

const PREFIX = "erudite:ui:v1:";
export const UiStateScope = createContext<string | null>(null);
export const uiObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
export const uiString = (value: unknown): value is string => typeof value === "string" && value.length <= 200_000;
export const uiBoolean = (value: unknown): value is boolean => typeof value === "boolean";
export const uiCount = (value: unknown): value is number => Number.isSafeInteger(value) && Number(value) >= 0;
export function readUiState<T>(key: string | null, fallback: T, valid: (value: unknown) => boolean): T {
  if (!key) return fallback;
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(PREFIX + key) ?? "null");
    return valid(value) ? value as T : fallback;
  } catch { return fallback; }
}
export function writeUiState(key: string | null, value: unknown) {
  if (!key) return;
  try { sessionStorage.setItem(PREFIX + key, JSON.stringify(value)); }
  catch { /* UI recovery is optional; vocabulary storage remains independent. */ }
}
export function clearPairUiState() {
  try {
    for (const key of Object.keys(sessionStorage)) if (key.startsWith(PREFIX + "pair:")) sessionStorage.removeItem(key);
  } catch { /* Storage may be unavailable. */ }
}
export function useUiKey(name: string): string | null {
  const scope = useContext(UiStateScope);
  return scope ? `${scope}:${name}` : null;
}
export function useStoredUiState<T>(key: string | null, initial: T, valid: (value: unknown) => boolean): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => readUiState(key, initial, valid));
  useEffect(() => { writeUiState(key, value); }, [key, value]);
  return [value, setValue];
}
export function useUiState<T>(name: string, initial: T, valid: (value: unknown) => boolean): [T, Dispatch<SetStateAction<T>>] {
  return useStoredUiState(useUiKey(name), initial, valid);
}

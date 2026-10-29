import { Download, Upload } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { AppData, Language, Settings } from "../types";
import { languageNames, languages } from "../types";
import type { T, TextKey } from "../i18n/translations";
import { hydrateData } from "../services/storage";
import { configureGemini, getGeminiConnectionState, subscribeGeminiConnection, testGeminiConnection } from "../services/gemini";
import type { GeminiConnectionState } from "../services/gemini";
const connectionLabels: Record<GeminiConnectionState, TextKey> = {
  unconfigured: "geminiNotConfigured", untested: "geminiNotTested", checking: "geminiChecking", connected: "geminiConnected",
  auth_error: "geminiAuthError", quota_error: "geminiQuotaError", model_error: "geminiModelError", unavailable: "geminiUnavailable",
  response_error: "geminiResponseError", timeout: "geminiTimeout",
};
export function LanguageSelect({
  label,
  value,
  onChange,
  exclude,
}: {
  label: string;
  value: Language;
  onChange: (v: Language) => void;
  exclude?: Language;
}) {
  return (
    <label>
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Language)}
      >
        {languages
          .filter((l) => l !== exclude)
          .map((l) => (
            <option key={l} value={l}>
              {languageNames[l]}
            </option>
          ))}
      </select>
    </label>
  );
}
export function SettingsView({
  data,
  changeSettings,
  restore,
  t,
}: {
  data: AppData;
  changeSettings: (s: Partial<Settings>) => void;
  restore: (d: AppData) => void;
  t: T;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(false);
  const s = data.settings;
  const connection = useSyncExternalStore(subscribeGeminiConnection, getGeminiConnectionState);
  const connectionRequest = useRef<AbortController | null>(null);
  useEffect(() => {
    configureGemini(s.geminiApiKey);
    return () => { connectionRequest.current?.abort(); };
  }, [s.geminiApiKey]);
  const [goalInput, setGoalInput] = useState(s.dailyWordGoal?.toString() ?? "");
  const validGoal = (value: string) =>
    value.trim() !== "" && Number.isInteger(Number(value)) &&
    Number(value) >= 1 && Number(value) <= 50;
  const download = () => {
    const backup = { ...data, settings: { ...data.settings, geminiApiKey: undefined } };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `erudite-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t("settings")}</p>
          <h1>{t("settingsTitle")}</h1>
          <p className="subtitle">{t("settingsSub")}</p>
        </div>
      </div>
      <div className="settings-columns">
        <section className="panel settings-panel">
          <h2>{t("language")}</h2>
          <LanguageSelect
            label={t("interface")}
            value={s.interfaceLanguage}
            onChange={(interfaceLanguage) =>
              changeSettings({ interfaceLanguage })
            }
          />
          <div className="form-two">
            <LanguageSelect
              label={t("source")}
              value={s.sourceLanguage}
              exclude={s.targetLanguage}
              onChange={(sourceLanguage) => changeSettings({ sourceLanguage })}
            />
            <LanguageSelect
              label={t("target")}
              value={s.targetLanguage}
              exclude={s.sourceLanguage}
              onChange={(targetLanguage) => changeSettings({ targetLanguage })}
            />
          </div>
          <div className="setting-toggle">
            <div>
              <label htmlFor="strict-accents">{t("strictAccents")}</label>
              <p>{t("strictAccentsHint")}</p>
            </div>
            <input
              id="strict-accents"
              type="checkbox"
              role="switch"
              checked={s.strictAccents}
              onChange={(e) =>
                changeSettings({ strictAccents: e.target.checked })
              }
            />
          </div>
          <label>
            {t("studyMode")}
            <select
              value={s.studyMode}
              onChange={(e) =>
                changeSettings({
                  studyMode: e.target.value as Settings["studyMode"],
                })
              }
            >
              <option value="SWIPE_ONLY">{t("swipeOnly")}</option>
              <option value="TYPE_ONLY">{t("typeOnly")}</option>
              <option value="MIXED">{t("mixedRecall")}</option>
            </select>
          </label>
          {s.studyMode !== "SWIPE_ONLY" && <p className="form-message">
            {t(s.studyMode === "TYPE_ONLY" ? "typeOnlyHint" : "mixedRecallHint")}
          </p>}
          <div className="setting-toggle">
            <div>
              <label htmlFor="instant-master">{t("instant")}</label>
              <p>{t("instantHint")}</p>
            </div>
            <input id="instant-master" type="checkbox" role="switch"
              checked={s.instantMasterOnFirstTry}
              onChange={(e) => changeSettings({ instantMasterOnFirstTry: e.target.checked })} />
          </div>
          <label>
            {t("dailyGoal")}
            <input
              id="daily-word-goal"
              type="number"
              min={1}
              max={50}
              step={1}
              inputMode="numeric"
              enterKeyHint="done"
              placeholder="1–50"
              value={goalInput}
              aria-describedby="daily-goal-hint"
              onChange={(e) => {
                const value = e.target.value;
                setGoalInput(value);
                if (validGoal(value)) changeSettings({ dailyWordGoal: Number(value) });
              }}
              onBlur={(e) => setGoalInput(validGoal(e.currentTarget.value)
                ? e.currentTarget.value : s.dailyWordGoal?.toString() ?? "")}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
          </label>
          <div className="setting-toggle">
            <label htmlFor="unlimited-goal">{t("unlimited")}</label>
            <input
              id="unlimited-goal"
              type="checkbox"
              role="switch"
              checked={s.dailyWordGoal === null}
              onChange={(e) => {
                const dailyWordGoal = e.target.checked ? null : validGoal(goalInput) ? Number(goalInput) : 10;
                setGoalInput(dailyWordGoal?.toString() ?? "");
                changeSettings({ dailyWordGoal });
              }}
            />
          </div>
          <p id="daily-goal-hint" className="form-message">{t("dailyGoalHint")}</p>

        </section>
        <div>
          <section className="panel settings-panel">
            <h2>{t("geminiTitle")}</h2>
            <label htmlFor="gemini-api-key">{t("geminiApiKey")}</label>
            <input id="gemini-api-key" type="password" autoComplete="off" spellCheck={false}
              maxLength={512} value={s.geminiApiKey ?? ""} aria-describedby="gemini-key-hint"
              onChange={(event) => changeSettings({ geminiApiKey: event.target.value.trim() || undefined })} />
            <p id="gemini-key-hint" className="form-message">{t("geminiKeyHint")}</p>
            <a className="text-button" href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">{t("getGeminiApiKey")}</a>
            <div className="gemini-connection">
              <p role="status" aria-live="polite" aria-atomic="true" className="gemini-connection-status" data-connection={connection}>
                <span className="gemini-connection-dot" aria-hidden="true" />{t(connectionLabels[connection])}
              </p>
              <button type="button" className="outline-button" disabled={connection === "checking"}
                onClick={() => {
                  connectionRequest.current?.abort();
                  const controller = new AbortController();
                  connectionRequest.current = controller;
                  void testGeminiConnection(s.geminiApiKey, controller.signal).catch(() => {});
                }}>{t("geminiTestConnection")}</button>
            </div>
            <p className="form-message">{t("geminiConnectionHint")}</p>
          </section>
          <section className="panel settings-panel">
            <h2>{t("appearance")}</h2>
            <div className="theme-options">
              {(["light", "dark"] as const).map((theme) => (
                <button
                  className={s.theme === theme ? "active" : ""}
                  key={theme}
                  onClick={() => changeSettings({ theme })}
                >
                  <span className={`theme-preview ${theme}`}>
                    <i />
                    <i />
                    <i />
                  </span>
                  {t(theme)}
                </button>
              ))}
            </div>
          </section>
          <section className="panel settings-panel data-panel">
            <h2>{t("data")}</h2>
            <p className="muted">{t("local")}</p>
            <button className="outline-button" onClick={download}>
              <Download size={17} />
              {t("export")}
            </button>
            <button
              className="text-button"
              onClick={() => fileInput.current?.click()}
            >
              <Upload size={17} />
              {t("import")}
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              aria-label={t("import")}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setError(false);
                try {
                  if (file.size > 10_000_000) throw new Error("Too large");
                  const d = hydrateData(JSON.parse(await file.text()));
                  if (window.confirm(t("importConfirm"))) restore(d);
                } catch {
                  setError(true);
                } finally {
                  e.target.value = "";
                }
              }}
            />
            {error && (
              <p role="alert" className="form-message">
                {t("importError")}
              </p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

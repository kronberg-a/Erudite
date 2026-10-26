import { Download, Upload } from "lucide-react";
import { useRef, useState } from "react";
import type { AppData, Language, Settings } from "../types";
import { languageNames, languages } from "../types";
import type { T } from "../i18n/translations";
import { validateData } from "../services/storage";
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
  const download = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
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
          <label>
            {t("dailyCap")}
            <select
              value={s.dailyNewCardsCap}
              onChange={(e) =>
                changeSettings({ dailyNewCardsCap: Number(e.target.value) })
              }
            >
              {[...new Set([5, 10, 15, 20, 30, 50, 100, s.dailyNewCardsCap])]
                .sort((a, b) => a - b)
                .map((v) => (
                  <option key={v}>{v}</option>
                ))}
            </select>
          </label>
          <div className="setting-toggle">
            <div>
              <label htmlFor="instant-master">{t("instant")}</label>
              <p>{t("instantHint")}</p>
            </div>
            <input
              id="instant-master"
              type="checkbox"
              role="switch"
              checked={s.instantMasterOnFirstTry}
              onChange={(e) =>
                changeSettings({ instantMasterOnFirstTry: e.target.checked })
              }
            />
          </div>
        </section>
        <div>
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
                  const d: unknown = JSON.parse(await file.text());
                  if (!validateData(d)) throw new Error("Invalid");
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

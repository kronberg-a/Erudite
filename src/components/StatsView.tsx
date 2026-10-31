import { useEffect, useState } from "react";
import type { AppData, PairData, Settings } from "../types";
import type { T } from "../i18n/translations";
import {
  getActivityHistory,
  getForecast,
  getMaturityDistribution,
  getRecallModeSplit,
  getRetentionStats,
  getVocabularySummary,
} from "../core/stats";

interface Props {
  pair: PairData;
  data: AppData;
  settings: Settings;
  t: T;
}
export function StatsView({ pair, data, settings, t }: Props) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const timer = window.setInterval(refresh, 60_000);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  const locale = settings.interfaceLanguage;
  const number = (n: number, digits = 0) =>
    n.toLocaleString(locale, { maximumFractionDigits: digits });
  const percentage = (n: number) => `${number(n)}%`;
  const date = (day: string) =>
    new Date(`${day}T12:00:00`).toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
    });
  const forecast = getForecast(pair.words, now);
  const retention = getRetentionStats(pair.words);
  const maturity = getMaturityDistribution(pair.words);
  const current = getVocabularySummary(pair.words);
  const activity = getActivityHistory(data.activityLog, now);
  const modes = getRecallModeSplit(data.recallModes);
  const maxActivity = Math.max(1, ...activity.map((d) => d.count));
  const maxForecast = Math.max(
    1,
    ...forecast.dailyTimeline.map((d) => d.count),
  );
  const horizons = [
    ["dueToday", forecast.today],
    ["dueTomorrow", forecast.tomorrow],
    ["dueNext7Days", forecast.next7Days],
    ["dueNext14Days", forecast.next14Days],
    ["dueNext30Days", forecast.next30Days],
  ] as const;
  return (
    <div className="stats-view">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t("stats")}</p>
          <h1>{t("statsTitle")}</h1>
          <p className="subtitle">{t("statsSub")}</p>
        </div>
      </div>
      <div className="stats-summary">
        {[
          [t("total"), number(current.total)],
          [t("masteryPercentage"), percentage(current.percentage)],
          [t("dueNext30Days"), number(forecast.next30Days)],
          [
            t("retentionRate"),
            retention.activeCount ? percentage(retention.accuracyRate) : "—",
          ],
        ].map(([label, value]) => (
          <div className="panel stats-metric" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="stats-columns">
        <section className="panel stats-panel" aria-labelledby="stats-forecast">
          <h2 id="stats-forecast">{t("forecast")}</h2>
          <dl className="stats-list">
            {horizons.map(([label, count]) => (
              <div key={label}>
                <dt>{t(label)}</dt>
                <dd>{number(count)}</dd>
              </div>
            ))}
          </dl>
          <div className="stats-forecast-bars" aria-label={t("dueNext30Days")}>
            {forecast.dailyTimeline.map((day) => (
              <div
                key={day.date}
                tabIndex={0}
                aria-label={`${date(day.date)}: ${number(day.count)}`}
                title={`${date(day.date)}: ${number(day.count)}`}
              >
                <span
                  style={{ height: `${(day.count / maxForecast) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="stats-range">
            <span>{date(forecast.dailyTimeline[0].date)}</span>
            <span>{date(forecast.dailyTimeline[29].date)}</span>
          </div>
          <p className="stats-hint">{t("forecastHint")}</p>
        </section>
        <section className="panel stats-panel" aria-labelledby="stats-maturity">
          <h2 id="stats-maturity">{t("maturity")}</h2>
          <div className="stats-maturity-bar" aria-hidden="true">
            {maturity.map((item, i) => (
              <span
                key={item.bracket}
                className={`maturity-${i}`}
                style={{ width: `${item.percentage}%` }}
              />
            ))}
          </div>
          <dl className="stats-list">
            {maturity.map((item, i) => (
              <div key={item.bracket}>
                <dt>
                  <i className={`stats-key maturity-${i}`} />
                  {t(item.bracket)}
                </dt>
                <dd>
                  {number(item.count)}{" "}
                  <span>({percentage(item.percentage)})</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="panel stats-panel">
          <h2>{t("retentionRate")}</h2>
          <strong className="stats-value">
            {retention.activeCount ? percentage(retention.accuracyRate) : "—"}
          </strong>
          <p className="stats-hint">{t("retentionHint")}</p>
          <dl className="stats-list">
            <div>
              <dt>{t("averageEase")}</dt>
              <dd>
                {retention.activeCount ? number(retention.averageEase, 2) : "—"}
              </dd>
            </div>
          </dl>
          <p className="stats-hint">{t("easeHint")}</p>
        </section>
        <section className="panel stats-panel">
          <h2>{t("acquisitionVelocity")}</h2>
          <dl className="stats-list">
            <div>
              <dt>{t("averageDaysToMaster")}</dt>
              <dd>
                {retention.datedMasteredCount
                  ? number(retention.averageDaysToMaster, 1)
                  : "—"}
              </dd>
            </div>
            <div>
              <dt>{t("averageRepsToMaster")}</dt>
              <dd>
                {retention.masteredCount
                  ? number(retention.averageRepsToMaster, 1)
                  : "—"}
              </dd>
            </div>
          </dl>
          <p className="stats-hint">{t("acquisitionHint")}</p>
        </section>
      </div>
      <section className="panel stats-panel" aria-labelledby="stats-activity">
        <h2 id="stats-activity">{t("activityHistory")}</h2>
        <p className="stats-hint">{t("activityHint")}</p>
        <div
          className="stats-calendar"
          role="list"
          aria-label={t("activityHistory")}
        >
          {activity.map((day) => (
            <span
              key={day.date}
              role="listitem"
              tabIndex={0}
              className={`activity-level-${day.count ? Math.ceil((day.count / maxActivity) * 4) : 0}`}
              aria-label={`${date(day.date)}: ${number(day.count)} ${t("recordedReviews")}`}
              title={`${date(day.date)}: ${number(day.count)} ${t("recordedReviews")}`}
            />
          ))}
        </div>
        <div className="stats-range">
          <span>{date(activity[0].date)}</span>
          <span>{date(activity[83].date)}</span>
        </div>
        <h3>{t("recallModeSplit")}</h3>
        <dl className="stats-list">
          {modes.map((item) => (
            <div key={item.mode}>
              <dt>
                {t(
                  item.mode === "SWIPE_ONLY"
                    ? "flashcardsMode"
                    : item.mode === "KEYBOARD"
                      ? "keyboard"
                      : "tiles",
                )}
              </dt>
              <dd>
                {number(item.count)}{" "}
                <span>({percentage(item.percentage)})</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

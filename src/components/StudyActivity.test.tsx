// @vitest-environment jsdom
import { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { StudyView } from "./StudyView";
import { translator } from "../i18n/translations";
import { defaultSettings } from "../services/storage";
import { seedPair } from "../i18n/seedData";
import type { StudyActivity } from "../types";
import { localDate } from "../core/dailyGoal";
vi.mock("../core/speech", () => ({ speak: () => true }));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
it.each(["Flashcards", "Keyboard", "Letter tiles", "Reveal"])(
  "tracks committed %s reviews only, and restores activity and modes exactly on Undo",
  (mode) => {
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);
    const updates = vi.fn();
    const initial = seedPair("en", "de");
    initial.words = initial.words
      .slice(0, 1)
      .map((word) => ({ ...word, status: "LEARNING", step: 1 }));
    function Harness() {
      const [pair, setPair] = useState(initial);
      const [order, setOrder] = useState(0);
      const [activity, setActivity] = useState<StudyActivity>({
        activityLog: { "2020-01-01": 2 },
        recallModes: { KEYBOARD: 2 },
      });
      return (
        <StudyView
          pair={pair}
          settings={{
            ...defaultSettings,
            studyMode: mode === "Flashcards" ? "SWIPE_ONLY" : "TYPE_ONLY",
          }}
          reviewOrder={order}
          {...activity}
          t={translator("en")}
          openLibrary={() => {}}
          update={(p, tick, _daily, nextActivity) => {
            setPair(p);
            setOrder(tick ?? order);
            if (nextActivity) {
              setActivity(nextActivity);
              updates(nextActivity);
            }
          }}
        />
      );
    }
    function click(label: string) {
      const button = Array.from(host.querySelectorAll("button")).find(
        (b) =>
          b.textContent?.trim() === label ||
          b.getAttribute("aria-label") === label,
      );
      expect(button, label).toBeTruthy();
      act(() => button!.click());
    }
    try {
      act(() => root.render(<Harness />));
      click("Start practice");
      expect(updates).not.toHaveBeenCalled();
      if (mode === "Keyboard" || mode === "Letter tiles") click(mode);
      expect(updates).not.toHaveBeenCalled();
      click("Reveal");
      expect(updates).not.toHaveBeenCalled();
      click("Repeat");
      const recallMode =
        mode === "Keyboard"
          ? "KEYBOARD"
          : mode === "Letter tiles"
            ? "TILES"
            : "SWIPE_ONLY";
      expect(updates.mock.lastCall?.[0]).toEqual({
        activityLog: { "2020-01-01": 2, [localDate()]: 1 },
        recallModes: {
          KEYBOARD: 2,
          [recallMode]: recallMode === "KEYBOARD" ? 3 : 1,
        },
      });
      click("Undo");
      expect(updates.mock.lastCall?.[0]).toEqual({
        activityLog: { "2020-01-01": 2 },
        recallModes: { KEYBOARD: 2 },
      });
    } finally {
      act(() => root.unmount());
      host.remove();
    }
  },
);

import { useEffect, useRef } from "react";
import { ArrowRight, BookOpen, BookOpenText, CalendarDays, Check, Focus, Layers, Plus, RotateCcw, Unlock, Volume2 } from "lucide-react";
import type { T } from "../i18n/translations";
import type { Settings } from "../types";
import { BrandLogo } from "./BrandLogo";

function LearningCanvas({ theme, label }: { theme: Settings["theme"]; label: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const draw = () => {
      const width = element.getBoundingClientRect().width;
      if (!width) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.round(width * ratio);
      element.height = Math.round(width * .7 * ratio);
      const ctx = element.getContext("2d");
      if (!ctx) return;
      ctx.scale(element.width / 480, element.height / 336);
      const dark = theme === "dark";
      const ink = dark ? "#F8FAFC" : "#0F172A";
      const border = dark ? "#1F2937" : "#E2E8F0";
      const accent = dark ? "#3B82F6" : "#2563EB";
      const surface = dark ? "#111827" : "#FFFFFF";
      const muted = dark ? "#94A3B8" : "#64748B";
      const teal = dark ? "#5EEAD4" : "#0F766E";
      const line = (points: number[][], color = border) => {
        ctx.strokeStyle = color; ctx.beginPath();
        points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.stroke();
      };
      const circle = (x: number, y: number, radius: number, color = border) => {
        ctx.strokeStyle = color; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.stroke();
      };
      const card = (x: number, y: number, width: number, height: number) => {
        ctx.fillStyle = surface; ctx.strokeStyle = border;
        ctx.beginPath(); ctx.roundRect(x, y, width, height, 5); ctx.fill(); ctx.stroke();
      };
      ctx.lineWidth = 1;
      ctx.strokeStyle = border;
      // A quiet atlas of language: six languages, reading, sound and recall.
      for (let x = 24; x < 480; x += 24) {
        for (let y = 24; y < 336; y += 24) {
          ctx.fillStyle = border; ctx.fillRect(x, y, 1.5, 1.5);
        }
      }
      const wash = ctx.createRadialGradient(240, 168, 10, 240, 168, 158);
      wash.addColorStop(0, dark ? "#3B82F61A" : "#2563EB0D");
      wash.addColorStop(1, dark ? "#3B82F600" : "#2563EB00");
      ctx.fillStyle = wash; ctx.fillRect(70, 0, 340, 336);
      ctx.save(); ctx.translate(240, 168); ctx.rotate(-.35);
      ctx.beginPath(); ctx.ellipse(0, 0, 184, 106, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      circle(240, 168, 128);
      ctx.setLineDash([4, 6]);
      line([[88, 86], [146, 86], [190, 140]]);
      line([[368, 70], [328, 70], [290, 130]]);
      line([[86, 230], [130, 230], [184, 198]]);
      line([[388, 252], [336, 252], [294, 202]]);
      ctx.setLineDash([]);
      // The central book sits on a small stack of vocabulary cards.
      ctx.save(); ctx.translate(240, 168); ctx.rotate(-.08);
      card(-72, -70, 144, 148); ctx.restore();
      ctx.save(); ctx.translate(240, 168); ctx.rotate(.055);
      card(-72, -74, 144, 148); ctx.restore();
      card(166, 94, 148, 148);
      ctx.strokeStyle = ink; ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(240, 197); ctx.lineTo(240, 143);
      ctx.bezierCurveTo(225, 132, 209, 132, 195, 136);
      ctx.lineTo(195, 188); ctx.bezierCurveTo(210, 184, 225, 186, 240, 197);
      ctx.bezierCurveTo(255, 186, 270, 184, 285, 188);
      ctx.lineTo(285, 136); ctx.bezierCurveTo(271, 132, 255, 132, 240, 143); ctx.stroke();
      for (const y of [151, 162, 173]) {
        ctx.beginPath(); ctx.moveTo(206, y); ctx.lineTo(227, y + 3);
        ctx.moveTo(253, y + 3); ctx.lineTo(274, y); ctx.stroke();
      }
      ctx.lineWidth = 1;
      line([[214, 216], [266, 216]], border);
      for (const x of [232, 240, 248]) {
        ctx.fillStyle = x === 240 ? accent : border;
        ctx.beginPath(); ctx.arc(x, 228, 1.7, 0, Math.PI * 2); ctx.fill();
      }
      // Small language specimens make the drawing independent of UI language.
      const specimen = (x: number, y: number, angle: number, first: string, second: string) => {
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        card(-49, -29, 98, 58);
        ctx.fillStyle = ink; ctx.font = '19px Georgia, serif'; ctx.textAlign = "center";
        ctx.fillText(first, 0, -1);
        ctx.fillStyle = muted; ctx.font = '10px sans-serif'; ctx.fillText(second, 0, 17);
        ctx.restore();
      };
      specimen(88, 74, -.1, "Wort", "word");
      specimen(373, 66, .08, "mot", "parola");
      specimen(78, 244, -.06, "слово", "palabra");
      // Speech: a compact waveform with a clean geometric frame.
      card(189, 23, 87, 35);
      [6, 14, 22, 12, 26, 16, 7].forEach((height, index) => {
        ctx.lineWidth = 1.5;
        line([[211 + index * 7, 40 - height / 2], [211 + index * 7, 40 + height / 2]], accent);
      });
      // Recall: a small orbital mark and an open path forward.
      ctx.lineWidth = 1;
      ctx.fillStyle = surface; ctx.beginPath(); ctx.arc(388, 253, 27, 0, Math.PI * 2); ctx.fill();
      circle(388, 253, 27); circle(388, 253, 34);
      ctx.lineWidth = 1.8;
      line([[377, 253], [385, 261], [400, 244]], teal);
      ctx.lineWidth = 1;
      ctx.strokeStyle = accent;
      ctx.beginPath(); ctx.moveTo(181, 285); ctx.bezierCurveTo(205, 270, 214, 303, 240, 288);
      ctx.bezierCurveTo(259, 277, 279, 279, 295, 290); ctx.stroke();
      line([[289, 283], [295, 290], [286, 293]], accent);
      // Registration marks and constellation points keep the composition airy.
      line([[34, 151], [34, 141], [44, 141]], muted);
      line([[431, 184], [441, 184], [441, 174]], muted);
      line([[319, 32], [319, 42]], teal); line([[314, 37], [324, 37]], teal);
      line([[137, 290], [137, 300]], teal); line([[132, 295], [142, 295]], teal);
      ctx.fillStyle = accent;
      for (const [x, y] of [[146, 86], [328, 70], [130, 230], [336, 252], [70, 170], [414, 125]]) {
        ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
      }
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(element);
    return () => observer.disconnect();
  }, [theme]);
  return <canvas ref={canvas} className="about-canvas" role="img" aria-label={label}>{label}</canvas>;
}

export function AboutView({ t, theme, onLearn }: { t: T; theme: Settings["theme"]; onLearn: () => void }) {
  const principles = [
    { icon: Unlock, title: "aboutFreeTitle", text: "aboutFreeText" },
    { icon: Focus, title: "aboutFocusTitle", text: "aboutFocusText" },
    { icon: BookOpen, title: "aboutPaceTitle", text: "aboutPaceText" },
  ] as const;
  const steps = [
    { icon: Plus, title: "aboutCollectTitle", text: "aboutCollectText" },
    { icon: BookOpen, title: "aboutMeetTitle", text: "aboutMeetText" },
    { icon: RotateCcw, title: "aboutRecallTitle", text: "aboutRecallText" },
    { icon: CalendarDays, title: "aboutReviewTitle", text: "aboutReviewText" },
    { icon: Check, title: "aboutRememberTitle", text: "aboutRememberText" },
  ] as const;
  return <div className="about-view">
    <div className="page-heading"><p className="eyebrow">{t("about")}</p></div>
    <section className="about-hero panel" aria-labelledby="about-title">
      <div className="about-intro">
        <BrandLogo className="about-wordmark" />
        <h1 id="about-title">{t("aboutTitle")}</h1>
        <p>{t("aboutIntro")}</p>
        <button type="button" className="outline-button" onClick={onLearn}>{t("aboutStart")}<ArrowRight size={16} aria-hidden="true" /></button>
      </div>
      <figure className="about-figure">
        <LearningCanvas theme={theme} label={t("aboutCanvas")} />
        <figcaption>{t("aboutCycle")}</figcaption>
      </figure>
    </section>
    <section className="about-principles" aria-label={t("aboutPrinciples")}>
      {principles.map(({ icon: Icon, title, text }, index) => <div className="about-principle panel" key={title}>
        <div className="about-symbol"><Icon size={24} strokeWidth={1.5} aria-hidden="true" /><span>0{index + 1}</span></div>
        <h2>{t(title)}</h2><p>{t(text)}</p>
      </div>)}
    </section>
    <section className="about-learning panel" aria-labelledby="about-learning-title">
      <div className="about-learning-heading">
        <p className="eyebrow">{t("aboutLearningLabel")}</p>
        <h2 id="about-learning-title">{t("aboutLearningTitle")}</h2>
        <p>{t("aboutLearningIntro")}</p>
      </div>
      <ol className="about-learning-steps">
        {steps.map(({ icon: Icon, title, text }, index) => <li className="about-learning-step" key={title}>
          <div className="about-step-marker" aria-hidden="true"><Icon size={20} strokeWidth={1.5} /></div>
          <div className="about-step-copy"><span className="about-step-number">0{index + 1}</span><h3>{t(title)}</h3><p>{t(text)}</p></div>
          <div className={`about-step-demo about-step-demo-${index + 1}`} aria-hidden="true">
            {index === 0 && <><BookOpenText size={32} strokeWidth={1.3} /><ArrowRight size={18} /><span className="about-demo-card"><Plus size={15} /><span>Aa</span></span></>}
            {index === 1 && <><span className="about-demo-card"><span>Aa</span><span className="about-demo-rule" /><span className="about-demo-rule short" /></span><Volume2 size={25} strokeWidth={1.3} /></>}
            {index === 2 && <div className="about-demo-recalls">{[1, 2, 3].map((n) => <span key={n}><small>{n}</small><Check size={19} /></span>)}</div>}
            {index === 3 && <div className="about-demo-calendar"><CalendarDays size={28} strokeWidth={1.3} /><div className="about-demo-intervals"><i /><i /><i /><i /></div></div>}
            {index === 4 && <><span className="about-demo-complete"><Check size={30} strokeWidth={1.5} /></span><Layers size={29} strokeWidth={1.3} /></>}
          </div>
        </li>)}
      </ol>
      <div className="about-learning-note"><RotateCcw size={18} aria-hidden="true" /><p>{t("aboutLearningNote")}</p></div>
    </section>
    <p className="about-closing">{t("aboutClosing")}</p>
  </div>;
}

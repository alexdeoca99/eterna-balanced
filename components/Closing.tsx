"use client";
import { useRef } from "react";
import { fontsReady, gsap, SplitText, useGSAP } from "./gsap";
import Button from "./Button";
import s from "./Closing.module.css";

// Lemniscate of Bernoulli as an SVG path
const LEM = Array.from({ length: 121 }, (_, i) => {
  const t = (i / 120) * Math.PI * 2;
  const d = 1 + Math.sin(t) ** 2;
  return `${i ? "L" : "M"}${(500 + (480 * Math.cos(t)) / d).toFixed(1)} ${(200 + (480 * Math.sin(t) * Math.cos(t)) / d).toFixed(1)}`;
}).join(" ");

export default function Closing() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    (_, contextSafe) => {
      gsap.fromTo(
        `.${s.lem}`,
        { drawSVG: "0% 0%" },
        { drawSVG: "0% 100%", duration: 3, ease: "power2.inOut", scrollTrigger: { trigger: ref.current, start: "top 70%" } }
      );
      // dash pattern repeats every 100 (pathLength), so the trace wraps past the path's end with no jump
      gsap.fromTo(`.${s.lemGlow}`, { strokeDashoffset: 0 }, { strokeDashoffset: -100, duration: 6, repeat: -1, ease: "none" });
      fontsReady().then(
        contextSafe!(() => {
          const split = SplitText.create(`.${s.title}`, { type: "lines", mask: "lines", linesClass: "split-line" });
          gsap.from(split.lines, {
            yPercent: 105,
            duration: 1.4,
            stagger: 0.12,
            ease: "expo.out",
            scrollTrigger: { trigger: `.${s.title}`, start: "top 85%" },
          });
        })
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className={s.closing}>
      <svg className={s.svg} viewBox="0 0 1000 400" aria-hidden>
        <path d={LEM} className={s.lem} />
        <path d={LEM} className={s.lemGlow} pathLength={100} />
      </svg>
      <div className={`${s.inner} wrap`}>
        <p className={s.eyebrow}>Balanced today, thriving forever</p>
        <h2 className={s.title}>
          You don&apos;t have to keep <em>guessing</em> what your symptoms mean.
        </h2>
        <div className={s.actions}>
          <Button variant="light">
            Discover your Hormone Health Score
          </Button>
          <Button variant="ghostLight">
            Book a free consult
          </Button>
        </div>
      </div>
    </section>
  );
}

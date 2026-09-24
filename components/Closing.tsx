"use client";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "./gsap";
import Button from "./Button";
import { BOOK } from "./Nav";
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
    () => {
      gsap.fromTo(
        `.${s.lem}`,
        { drawSVG: "0% 0%" },
        { drawSVG: "0% 100%", ease: "none", scrollTrigger: { trigger: ref.current, start: "top 80%", end: "center center", scrub: 1 } }
      );
      gsap.fromTo(`.${s.lemGlow}`, { drawSVG: "0% 8%" }, { drawSVG: "92% 100%", duration: 6, repeat: -1, ease: "none" });
      const split = SplitText.create(`.${s.title}`, { type: "lines", mask: "lines", linesClass: "split-line" });
      gsap.from(split.lines, {
        yPercent: 105,
        duration: 1.4,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: `.${s.title}`, start: "top 85%" },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className={s.closing}>
      <svg className={s.svg} viewBox="0 0 1000 400" aria-hidden>
        <path d={LEM} className={s.lem} />
        <path d={LEM} className={s.lemGlow} />
      </svg>
      <div className={`${s.inner} wrap`}>
        <p className={s.eyebrow}>Balanced today, thriving forever</p>
        <h2 className={s.title}>
          You don&apos;t have to keep <em>guessing</em> what your symptoms mean.
        </h2>
        <div className={s.actions}>
          <Button quiz variant="light">
            Discover your Hormone Health Score
          </Button>
          <Button href={BOOK} variant="ghostLight">
            Book a free consult
          </Button>
        </div>
      </div>
    </section>
  );
}

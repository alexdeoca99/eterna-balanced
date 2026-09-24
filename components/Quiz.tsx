"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import Button from "./Button";
import { BOOK } from "./Nav";
import s from "./Quiz.module.css";

const points = [
  "Understand common hormone-related symptom patterns.",
  "Get a more informed starting point before booking.",
  "Move forward with one clear, low-pressure next step.",
];

// Gauge arc: 240° sweep drawn as a path so DrawSVG can animate it.
const R = 130;
const arc = (deg: number) => {
  const a = ((deg - 210) * Math.PI) / 180;
  return [160 + R * Math.cos(a), 160 + R * Math.sin(a)];
};
const [sx, sy] = arc(0);
const [ex, ey] = arc(240);
const ARC = `M${sx} ${sy} A${R} ${R} 0 1 1 ${ex} ${ey}`;

export default function Quiz() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const score = { v: 0 };
      const num = ref.current!.querySelector(`.${s.score}`)!;
      const tl = gsap.timeline({ scrollTrigger: { trigger: `.${s.gauge}`, start: "top 75%" } });
      tl.fromTo(`.${s.fill}`, { drawSVG: "0%" }, { drawSVG: "0% 72%", duration: 2.2, ease: "expo.inOut" })
        .to(score, { v: 72, duration: 2.2, ease: "expo.inOut", onUpdate: () => (num.textContent = String(Math.round(score.v))) }, 0)
        .from(`.${s.needle}`, { rotate: -172.8, svgOrigin: "160 160", duration: 2.2, ease: "expo.inOut" }, 0)
        .from(`.${s.tickMark}`, { opacity: 0, stagger: 0.03, duration: 0.3 }, 0);
      gsap.from(`.${s.copy} > *`, {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: `.${s.copy}`, start: "top 80%" },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="quiz" className={s.quiz}>
      <div className={`${s.grid} wrap`}>
        <div className={s.gauge} aria-hidden>
          <svg viewBox="0 0 320 300">
            {Array.from({ length: 25 }, (_, i) => {
              const [x1, y1] = arc(i * 10);
              const a = ((i * 10 - 210) * Math.PI) / 180;
              return (
                <line
                  key={i}
                  className={s.tickMark}
                  x1={x1 - Math.cos(a) * 22}
                  y1={y1 - Math.sin(a) * 22}
                  x2={x1 - Math.cos(a) * (i % 4 === 0 ? 34 : 28)}
                  y2={y1 - Math.sin(a) * (i % 4 === 0 ? 34 : 28)}
                />
              );
            })}
            <path d={ARC} className={s.track} />
            <path d={ARC} className={s.fill} />
            <g className={s.needle}>
              <line x1="160" y1="160" x2={160 + Math.cos(((172.8 - 210) * Math.PI) / 180) * 88} y2={160 + Math.sin(((172.8 - 210) * Math.PI) / 180) * 88} />
              <circle cx="160" cy="160" r="7" />
            </g>
          </svg>
          <div className={s.readout}>
            <b className={s.score}>72</b>
            <span>Your score, decoded</span>
          </div>
        </div>

        <div className={s.copy}>
          <p className="eyebrow">Featured · free</p>
          <h2>
            Start with your <em>Hormone Health Score.</em>
          </h2>
          <p>
            Not sure where to begin? This is the clearest first step: a simple, supportive way to make sense of what
            your body may be trying to tell you.
          </p>
          <ul>
            {points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <div className={s.actions}>
            <Button quiz variant="primary">
              Take the quiz
            </Button>
            <Button href={BOOK} variant="ghost" arrow={false}>
              Or book directly
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

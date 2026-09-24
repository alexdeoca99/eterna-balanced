"use client";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "./gsap";
import s from "./Mission.module.css";

const pillars = [
  ["Root cause", "Care that looks deeper than quick fixes and surface-level answers."],
  ["Women focused", "Support designed around real-life symptoms, stress, and everyday demands."],
  ["Science + nature", "Clinical guidance paired with an approachable, whole-person perspective."],
  ["Lifelong wellness", "A plan built to support sustainable change through every season of life."],
];

export default function Mission() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const split = SplitText.create(`.${s.statement}`, { type: "words" });
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: `.${s.statement}`, start: "top 80%", end: "bottom 45%", scrub: true },
        }
      );
      gsap.from(`.${s.pillar}`, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: `.${s.pillars}`, start: "top 85%" },
      });
      gsap.from(`.${s.pillar} i`, {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1.4,
        stagger: 0.12,
        ease: "expo.inOut",
        scrollTrigger: { trigger: `.${s.pillars}`, start: "top 85%" },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="mission" className={s.mission}>
      <div className="wrap">
        <p className="eyebrow">Our mission</p>
        <h2 className={s.statement}>
          We help women uncover the <em>root cause</em> of their symptoms and create lasting wellness through
          personalized functional medicine, so <em>normal</em> finally means feeling well.
        </h2>
        <div className={s.pillars}>
          {pillars.map(([t, d], i) => (
            <div key={t} className={s.pillar}>
              <i aria-hidden />
              <span className={s.num}>0{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

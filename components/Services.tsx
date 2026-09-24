"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import s from "./Services.module.css";

const services = [
  ["Root-cause hormone support", "Uncover the “why” behind low energy, irritability, mood changes and weight fluctuations. Care that starts by listening.", "Foundation"],
  ["Personalized protocols", "Physician-guided and designed around your symptoms, goals and unique health picture, never a generic recommendation.", "Plan"],
  ["DUTCH testing", "A closer look at hormone patterns and metabolism to guide more precise, personalized care.", "Testing"],
  ["GI-MAP testing", "Identify patterns in gut health, a key driver of hormone balance, for targeted recommendations.", "Testing"],
  ["Telemedicine care", "Expert guidance from home, by phone or video, so care fits into real life instead of taking it over.", "Access"],
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(`.${s.row}`).forEach((row) => {
        gsap.from(row, { y: 50, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: row, start: "top 90%" } });
        gsap.from(row.querySelector("i"), { scaleX: 0, transformOrigin: "left", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: row, start: "top 90%" } });
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="services" className={s.services}>
      <div className="wrap">
        <div className={s.head}>
          <p className="eyebrow">Services</p>
          <h2>
            Support built around your <em>whole</em> picture.
          </h2>
          <p>
            Fatigue, mood swings, weight changes, cycle concerns, gut issues, or labs that say “normal” while you
            still don&apos;t feel well. Your symptoms are not random.
          </p>
        </div>
        <ol className={s.list}>
          {services.map(([t, d, tag], i) => (
            <li key={t} className={s.row}>
              <i aria-hidden />
              <span className={s.n}>0{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
              <span className={s.tag}>{tag}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

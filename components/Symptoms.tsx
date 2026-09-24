"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "./gsap";
import Button from "./Button";
import s from "./Symptoms.module.css";

const groups = [
  {
    title: "Low energy",
    copy: "You wake up tired, push through the day, and wonder why rest never seems to feel like enough anymore.",
    chips: ["Waking up exhausted", "Afternoon crashes", "Brain fog"],
  },
  {
    title: "Mood changes",
    copy: "Irritability, overwhelm, or feeling unlike yourself can be a sign that your body needs deeper support.",
    chips: ["Irritability", "Feeling overwhelmed", "Not feeling like me"],
  },
  {
    title: "Weight changes",
    copy: "Your body may feel harder to understand, even when your routines and habits have not dramatically changed.",
    chips: ["Weight that won't budge", "Bloating & gut issues"],
  },
  {
    title: "Cycle & hormones",
    copy: "When symptoms keep repeating, looking at the full picture can bring more clarity and direction.",
    chips: ["Irregular or painful cycles", "Poor sleep", "Trying to conceive"],
  },
];
const TOTAL = groups.reduce((n, g) => n + g.chips.length, 0);

const message = (n: number) =>
  n === 0
    ? "Tap anything that sounds familiar."
    : n < 3
      ? "Worth paying attention to. Your body is talking."
      : n < 6
        ? "These often share a common root. Let's look deeper."
        : "Your body is asking for a closer look, not a rushed answer.";

export default function Symptoms() {
  const ref = useRef<HTMLElement>(null);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const n = picked.size;

  const toggle = (c: string) =>
    setPicked((p) => {
      const next = new Set(p);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });

  useGSAP(
    () => {
      gsap.to(`.${s.ringFg}`, { strokeDashoffset: 1 - n / TOTAL, duration: 0.9, ease: "expo.out" });
      gsap.fromTo(`.${s.msg}`, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
    },
    { scope: ref, dependencies: [n] }
  );

  useGSAP(
    () => {
      gsap.from(`.${s.chip}`, {
        y: 30,
        opacity: 0,
        scale: 0.9,
        duration: 0.9,
        stagger: 0.05,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: `.${s.panel}`, start: "top 80%" },
      });
      gsap.from(`.${s.card}`, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: `.${s.cards}`, start: "top 85%" },
      });
    },
    { scope: ref }
  );

  // spotlight that follows the pointer inside each card
  const spot = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <section ref={ref} className={s.symptoms} id="symptoms">
      <div className="wrap">
        <div className={s.top}>
          <div className={s.intro}>
            <p className={s.eyebrow}>Is this you?</p>
            <h2>
              You&apos;ve been told everything looks <em>normal.</em>
            </h2>
            <p className={s.lede}>
              But you still don&apos;t feel like yourself. If something feels off, it&apos;s worth paying attention
              to. We help you connect the dots between how you feel and what may be happening beneath the surface.
            </p>
          </div>

          <div className={s.panel}>
            <div className={s.panelHead}>
              <svg className={s.ring} viewBox="0 0 120 120" aria-hidden>
                <circle cx="60" cy="60" r="52" className={s.ringBg} />
                <circle cx="60" cy="60" r="52" className={s.ringFg} pathLength={1} />
              </svg>
              <div className={s.count} aria-live="polite">
                <b>{n}</b>
                <span>of {TOTAL}</span>
              </div>
              <p className={s.msg}>{message(n)}</p>
            </div>
            <div className={s.chips} role="group" aria-label="Symptoms">
              {groups.flatMap((g) =>
                g.chips.map((c) => (
                  <button
                    key={c}
                    className={s.chip}
                    aria-pressed={picked.has(c)}
                    onClick={() => toggle(c)}
                  >
                    <span className={s.tick} aria-hidden />
                    {c}
                  </button>
                ))
              )}
            </div>
            <div className={s.panelFoot} data-show={n > 0}>
              <Button variant="light">
                See your Hormone Health Score
              </Button>
            </div>
          </div>
        </div>

        <div className={s.cards}>
          {groups.map((g, i) => {
            const hits = g.chips.filter((c) => picked.has(c)).length;
            return (
              <article key={g.title} className={s.card} data-hit={hits > 0} onPointerMove={spot}>
                <div className={s.cardTop}>
                  <span className={s.idx}>0{i + 1}</span>
                  <span className={s.badge}>{hits > 0 ? `${hits} selected` : ""}</span>
                </div>
                <h3>{g.title}</h3>
                <p>{g.copy}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

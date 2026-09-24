"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "./gsap";
import Button from "./Button";
import { BOOK } from "./Nav";
import s from "./Founder.module.css";

const approach = [
  ["Root cause first", "Looking deeper than isolated lab results to understand what's really going on."],
  ["Whole-picture view", "Your full health story, never a one-size-fits-all solution."],
  ["Personalized plans", "Approachable, realistic, and built around your unique needs."],
];

export default function Founder() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.fromTo(
        `.${s.frame}`,
        { clipPath: "inset(100% 0% 0% 0% round 200px 200px 24px 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 200px 200px 24px 24px)",
          duration: 1.8,
          ease: "expo.inOut",
          scrollTrigger: { trigger: `.${s.frame}`, start: "top 80%" },
        }
      );
      gsap.fromTo(
        `.${s.frame} img`,
        { scale: 1.3, yPercent: -6 },
        { scale: 1.05, yPercent: 6, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } }
      );
      const split = SplitText.create(`.${s.name}`, { type: "chars", mask: "chars" });
      gsap.from(split.chars, {
        yPercent: 100,
        duration: 1.2,
        stagger: 0.03,
        ease: "expo.out",
        scrollTrigger: { trigger: `.${s.name}`, start: "top 85%" },
      });
      gsap.from(`.${s.reveal}`, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: `.${s.text}`, start: "top 75%" },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="founder" className={s.founder}>
      <div className={`${s.grid} wrap`}>
        <div className={s.visual}>
          <div className={s.frame}>
            <Image
              src="/img/dr-rouse.jpg"
              alt="Dr. Sophia Rouse, founder of Eterna Balanced, in a white coat"
              width={1024}
              height={1536}
              sizes="(max-width: 900px) 90vw, 40vw"
            />
          </div>
          <svg className={s.badge} viewBox="0 0 200 200" aria-hidden>
            <defs>
              <path id="circ" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" />
            </defs>
            <text>
              <textPath href="#circ">Root cause · Whole person · Personalized care · </textPath>
            </text>
          </svg>
          <span className={s.badgeMark} aria-hidden />
        </div>

        <div className={s.text}>
          <p className="eyebrow">Meet the founder</p>
          <h2 className={s.name}>Dr. Sophia Rouse</h2>
          <blockquote className={`${s.quote} ${s.reveal}`}>
            “Care that feels warm, personalized, and rooted in <em>real answers.</em>”
          </blockquote>
          <p className={s.reveal}>
            Dr. Rouse founded Eterna Balanced to create the kind of care many women have been missing, care that
            doesn&apos;t rush past symptoms or dismiss the ways women feel when something is off. She works with
            women who are exhausted, overwhelmed, unlike themselves, or frustrated by symptoms that have been brushed
            aside.
          </p>
          <p className={`${s.cred} ${s.reveal}`}>
            <span>Training</span>
            Chiropractic &amp; functional medicine, National University of Health Sciences
          </p>
          <ul className={s.approach}>
            {approach.map(([t, d]) => (
              <li key={t} className={s.reveal}>
                <b>{t}</b>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className={s.reveal}>
            <Button href={BOOK}>Book with Dr. Rouse</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

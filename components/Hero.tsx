"use client";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "./gsap";
import InfinityField from "./InfinityField";
import Button from "./Button";
import { BOOK } from "./Nav";
import s from "./Hero.module.css";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create(`.${s.title}`, { type: "lines,words", mask: "lines", linesClass: "split-line" });
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(`.${s.canvas}`, { opacity: 0, scale: 1.15, duration: 2.6, ease: "power2.out" })
        .from(split.words, { yPercent: 110, rotate: 4, duration: 1.4, stagger: 0.06 }, 0.3)
        .from(`.${s.fade}`, { y: 24, opacity: 0, duration: 1.2, stagger: 0.1 }, 0.9)
        .from(`.${s.meta} li`, { y: 16, opacity: 0, duration: 1, stagger: 0.08 }, 1.2);

      // content drifts up and fades as you leave the hero
      gsap.to(`.${s.content}`, {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className={s.hero} id="top">
      <InfinityField className={s.canvas} />
      <div className={s.glow} aria-hidden />
      <div className={`${s.content} wrap`}>
        <p className={`${s.eyebrow} ${s.fade}`}>Root-cause care for lifelong wellness</p>
        <div className={s.grid}>
          <h1 className={s.title}>
            Feel like <em>yourself</em> again.
          </h1>
          <div className={s.side}>
            <p className={s.fade}>
              Personalized, physician-guided protocols for low energy, mood swings, weight changes and hormone
              symptoms, delivered through telemedicine from the comfort of home.
            </p>
            <div className={`${s.actions} ${s.fade}`}>
              <Button quiz variant="light">
                Get your Hormone Health Score
              </Button>
              <Button href={BOOK} variant="ghostLight">
                Book a free consult
              </Button>
            </div>
          </div>
        </div>
        <ul className={s.meta}>
          <li>
            <b>15 min</b> free consultation
          </li>
          <li>
            <b>100%</b> virtual care
          </li>
          <li>
            <b>DUTCH</b> + GI-MAP testing
          </li>
          <li className={s.scroll} aria-hidden>
            <span />
            Scroll
          </li>
        </ul>
      </div>
    </section>
  );
}

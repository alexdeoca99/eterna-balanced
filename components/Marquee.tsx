"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";
import s from "./Marquee.module.css";

const words = ["Root cause", "Women focused", "Science + nature", "Lifelong wellness", "Telemedicine", "Personalized protocols"];

const Leaf = () => (
  <svg className={s.leaf} viewBox="0 0 24 24" aria-hidden>
    <path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16Zm0 0L14 10" fill="none" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

// Endless ribbon whose speed and direction follow scroll velocity.
export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const loop = gsap.to(`.${s.track}`, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return void loop.pause();
      let dir = 1;
      ScrollTrigger.create({
        onUpdate: (self) => {
          dir = self.direction;
          const v = gsap.utils.clamp(1, 6, Math.abs(self.getVelocity()) / 300);
          gsap.to(loop, { timeScale: v * dir, duration: 0.2, overwrite: true });
          gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.2 });
        },
      });
    },
    { scope: ref }
  );

  const row = words.map((w) => (
    <span key={w} className={s.item}>
      {w}
      <Leaf />
    </span>
  ));
  return (
    <div ref={ref} className={s.marquee} aria-label={words.join(", ")}>
      <div className={s.track} aria-hidden>
        {row}
        {row}
      </div>
    </div>
  );
}

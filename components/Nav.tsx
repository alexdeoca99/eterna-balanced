"use client";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";
import Button from "./Button";
import s from "./Nav.module.css";

const links = [
  ["Approach", "#mission"],
  ["Process", "#process"],
  ["Dr. Rouse", "#founder"],
  ["Services", "#services"],
  ["Pricing", "#pricing"],
  ["FAQ", "#faq"],
];

export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(() => {
    const el = ref.current!;
    gsap.from(el, { yPercent: -100, opacity: 0, duration: 1.2, delay: 0.9, ease: "expo.out", clearProps: "transform,opacity" });
    ScrollTrigger.create({
      start: () => innerHeight * 0.85,
      end: "max",
      onToggle: (self) => el.classList.toggle(s.solid, self.isActive),
      onUpdate: (self) => el.classList.toggle(s.hidden, self.direction === 1 && self.scroll() > innerHeight),
    });
  });

  return (
    <header ref={ref} className={`${s.nav} ${open ? s.open : ""}`}>
      <a href="#top" className={s.brand} aria-label="Eterna Balanced home">
        <span className={s.mark} aria-hidden />
        <span className={s.word}>Eterna Balanced</span>
      </a>
      <nav className={s.links} aria-label="Primary">
        {links.map(([l, h]) => (
          <a key={h} href={h} onClick={() => setOpen(false)}>
            <span data-text={l}>{l}</span>
          </a>
        ))}
      </nav>
      <div className={s.cta}>
        <Button variant="light" arrow={false}>
          Book free consult
        </Button>
      </div>
      <button className={s.burger} onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">
        <i />
        <i />
      </button>
    </header>
  );
}

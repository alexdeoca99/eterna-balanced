"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "./gsap";
import s from "./Roots.module.css";

const nodes = [
  ["Hormones", "Estrogen, progesterone, cortisol and thyroid: how they rise, fall and talk to each other across your cycle and life stage."],
  ["Gut health", "Digestion, the microbiome and inflammation shape how hormones are made, used and cleared. GI-MAP testing helps map it."],
  ["Nutrition", "What, when and how you eat. Practical, realistic changes that support steady energy and hormone balance."],
  ["Energy", "Blood sugar, metabolism and mitochondrial health: the reasons rest alone may not be restoring you."],
  ["Labs", "DUTCH, GI-MAP and bloodwork read through a functional lens, looking for patterns, not just out-of-range flags."],
  ["Lifestyle", "Movement, environment and daily rhythms that quietly add up. Your plan is built for the life you actually live."],
  ["Mind + stress", "Chronic stress reshapes cortisol and every system downstream. Calming the load is part of the protocol."],
  ["Sleep + recovery", "Deep, restorative sleep is when hormones reset. We look at why yours might not be happening."],
];

const C = 400;
const pos = nodes.map((_, i) => {
  const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
  return { x: C + Math.cos(a) * 300, y: C + Math.sin(a) * 300, a };
});
// organic root: bows sideways halfway out, with a small tendril branching off
const root = (i: number) => {
  const { x, y, a } = pos[i];
  const bend = i % 2 ? 60 : -60;
  const mx = C + Math.cos(a) * 150 + Math.cos(a + Math.PI / 2) * bend;
  const my = C + Math.sin(a) * 150 + Math.sin(a + Math.PI / 2) * bend;
  return `M${C} ${C} Q${mx} ${my} ${x} ${y}`;
};
const tendril = (i: number) => {
  const { a } = pos[i];
  const sx = C + Math.cos(a) * 170, sy = C + Math.sin(a) * 170;
  const b = a + (i % 2 ? -0.5 : 0.5);
  return `M${sx} ${sy} q${Math.cos(b) * 50} ${Math.sin(b) * 50} ${Math.cos(b) * 90} ${Math.sin(b) * 70}`;
};

export default function Roots() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setActive((a) => (a + 1) % nodes.length), 3200);
    return () => clearInterval(id);
  }, [auto]);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: `.${s.diagram}`, start: "top 75%", end: "center 55%", scrub: 1 },
      });
      tl.from(`.${s.root}`, { drawSVG: "0%", stagger: 0.05, ease: "none" })
        .from(`.${s.tendril}`, { drawSVG: "0%", stagger: 0.03, ease: "none" }, 0.3)
        .from(`.${s.node}`, { scale: 0, opacity: 0, stagger: 0.05, ease: "back.out(2)" }, 0.2);
      gsap.from(`.${s.center}`, {
        scale: 0.4,
        opacity: 0,
        duration: 1.4,
        ease: "elastic.out(1, 0.6)",
        scrollTrigger: { trigger: `.${s.diagram}`, start: "top 70%" },
      });
    },
    { scope: ref }
  );

  useGSAP(
    () => {
      gsap.fromTo(`.${s.detail} > *`, { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.7, ease: "power3.out" });
    },
    { scope: ref, dependencies: [active] }
  );

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <section ref={ref} className={s.roots} id="whole-person">
      <div className={`${s.grid} wrap`}>
        <div className={s.copy}>
          <p className={s.eyebrow}>Whole-person wellness</p>
          <h2>
            Every symptom connects back to a wider <em>root system.</em>
          </h2>
          <p className={s.lede}>
            Hormones, gut health, stress, lifestyle and lab findings all matter. We look at the whole picture, not
            just one piece of it. Explore the roots.
          </p>
          <div className={s.detail} aria-live="polite">
            <span className={s.detailNum}>
              0{active + 1} / 0{nodes.length}
            </span>
            <h3>{nodes[active][0]}</h3>
            <p>{nodes[active][1]}</p>
          </div>
        </div>

        <div className={s.diagram}>
          <svg viewBox="0 0 800 800" aria-hidden>
            <circle cx={C} cy={C} r="300" className={s.orbit} />
            <circle cx={C} cy={C} r="170" className={s.orbit} />
            {nodes.map((_, i) => (
              <g key={i} data-on={i === active}>
                <path d={root(i)} className={s.root} />
                <path d={tendril(i)} className={s.tendril} />
              </g>
            ))}
          </svg>
          <div className={s.center}>
            <span>You</span>
          </div>
          {nodes.map(([t], i) => (
            <button
              key={t}
              className={s.node}
              style={{ left: `${(pos[i].x / 800) * 100}%`, top: `${(pos[i].y / 800) * 100}%` }}
              data-on={i === active}
              onClick={() => pick(i)}
              onPointerEnter={() => pick(i)}
              onFocus={() => pick(i)}
            >
              <i aria-hidden />
              <span>{t}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

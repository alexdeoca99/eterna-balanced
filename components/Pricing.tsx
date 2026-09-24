"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "./gsap";
import Button from "./Button";
import s from "./Pricing.module.css";

type Plan = {
  name: string;
  price: number;
  unit: string;
  desc: string;
  items?: string[];
  note?: string;
  featured?: boolean;
};

const plans: Record<"programs" | "visits", Plan[]> = {
  programs: [
    {
      name: "Hormone & Fertility Optimization",
      price: 2400,
      unit: "6 sessions · 3 months",
      desc: "Begin regulating hormones and supporting fertility by correcting imbalances in hormones, gut health, stress physiology and metabolic function.",
      items: ["Initial functional medicine assessment", "3 follow-up care sessions", "Functional lab review & interpretation", "Personalized nutrition, lifestyle & supplement plan", "Ongoing care guidance"],
      note: "Best for women early in their healing journey, trying to conceive, or wanting structured short-term support.",
    },
    {
      name: "Signature Care Package",
      price: 5200,
      unit: "12 sessions · 6 months",
      desc: "Comprehensive, high-touch support for complex hormone, fertility or metabolic concerns, with the time to adjust protocols as your body responds.",
      items: ["Initial functional medicine assessment", "5–6 follow-up care sessions", "Advanced lab testing support & interpretation", "Ongoing protocol adjustments", "Structured messaging support between sessions"],
      note: "Best for preconception, postpartum restoration, perimenopause and long-standing imbalance.",
      featured: true,
    },
  ],
  visits: [
    {
      name: "Free Hormone Consultation",
      price: 0,
      unit: "15 min · phone or video",
      desc: "A one-on-one session to uncover what's going on beneath the surface and map out a personalized strategy. Complimentary for a limited time.",
      featured: true,
    },
    {
      name: "New Patient Appointment",
      price: 300,
      unit: "1 hour · phone or video",
      desc: "A comprehensive initial session to identify root causes of hormone imbalance, fertility challenges and chronic symptoms, and outline your plan.",
      note: "Required before ongoing care or follow-ups.",
    },
    {
      name: "Follow-Up Appointment",
      price: 150,
      unit: "30 min · phone or video",
      desc: "Review lab results, assess progress, refine protocols and address ongoing symptoms with thoughtful adjustments.",
      note: "For established clients.",
    },
  ],
};

export default function Pricing() {
  const ref = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<"programs" | "visits">("programs");

  const { contextSafe } = useGSAP(
    () => {
      gsap.from(`.${s.head} > *`, {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
    },
    { scope: ref }
  );

  // cards rise + prices count up whenever the tab changes or first come into view
  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(`.${s.card}`);
      const tl = gsap.timeline({ scrollTrigger: { trigger: `.${s.cards}`, start: "top 80%" } });
      tl.from(cards, { y: 70, opacity: 0, rotateX: -12, duration: 1.1, stagger: 0.1, ease: "expo.out" });
      cards.forEach((c) => {
        const el = c.querySelector<HTMLElement>("[data-price]");
        if (!el) return;
        const v = Number(el.dataset.price);
        const o = { n: 0 };
        tl.to(o, { n: v, duration: 1.4, ease: "power3.out", onUpdate: () => (el.textContent = Math.round(o.n).toLocaleString()) }, 0.1);
      });
    },
    { scope: ref, dependencies: [tab] }
  );

  const tilt = contextSafe((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--x", `${px * 100}%`);
    el.style.setProperty("--y", `${py * 100}%`);
    gsap.to(el, { rotateY: (px - 0.5) * 8, rotateX: (0.5 - py) * 8, duration: 0.6, ease: "power3.out" });
  });
  const untilt = contextSafe((e: React.PointerEvent<HTMLElement>) =>
    gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, duration: 1, ease: "elastic.out(1, 0.5)" })
  );

  return (
    <section ref={ref} id="pricing" className={s.pricing}>
      <div className="wrap">
        <div className={s.head}>
          <p className={s.eyebrow}>Packages &amp; pricing</p>
          <h2>
            Care plans built around <em>where you are.</em>
          </h2>
          <p>Every path starts with an initial assessment. From there, choose the support that fits your goals.</p>
          <div className={s.tabs} role="tablist" data-tab={tab}>
            <span className={s.pill} aria-hidden />
            {(["programs", "visits"] as const).map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>
                {t === "programs" ? "Care programs" : "Single visits"}
              </button>
            ))}
          </div>
        </div>

        <div className={s.cards} data-count={plans[tab].length} key={tab}>
          {plans[tab].map((p) => (
            <article
              key={p.name}
              className={s.card}
              data-featured={!!p.featured}
              onPointerMove={tilt}
              onPointerLeave={untilt}
            >
              {p.featured && <span className={s.flag}>{p.price === 0 ? "Start here" : "Most complete"}</span>}
              <h3>{p.name}</h3>
              <p className={s.price}>
                {p.price === 0 ? (
                  <b>Free</b>
                ) : (
                  <>
                    <sup>$</sup>
                    <b data-price={p.price}>{p.price.toLocaleString()}</b>
                  </>
                )}
                <span>{p.unit}</span>
              </p>
              <p className={s.desc}>{p.desc}</p>
              {p.items && (
                <ul>
                  {p.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              )}
              {p.note && <p className={s.note}>{p.note}</p>}
              <Button variant={p.featured ? "light" : "ghostLight"} className={s.cta}>
                Book now
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

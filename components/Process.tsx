"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import s from "./Process.module.css";

const steps = [
  ["Begin with your story", "Every journey starts with a conversation: what you've been experiencing, how you've been feeling, and where your health needs deeper support."],
  ["Look beyond the surface", "A root-cause lens on stress, gut health, metabolism, lifestyle patterns and hormone function, with DUTCH or GI-MAP testing when it adds clarity."],
  ["Receive your plan", "A personalized, physician-guided protocol built around your body, your symptoms and your goals. Never a one-size-fits-all template."],
  ["Move forward, supported", "Healing isn't being handed a plan and left alone. Ongoing telemedicine guidance adjusts your care as your body responds."],
];

export default function Process() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const track = ref.current!.querySelector<HTMLElement>(`.${s.track}`)!;
        const dist = () => track.scrollWidth - innerWidth;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: `.${s.pin}`,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${dist()}`,
            invalidateOnRefresh: true,
          },
        });
        tl.to(track, { x: () => -dist(), ease: "none" }, 0)
          .fromTo(`.${s.vine}`, { drawSVG: "0%" }, { drawSVG: "100%", ease: "none" }, 0)
          .to(`.${s.bar} i`, { scaleX: 1, ease: "none" }, 0);
        // each step's number blooms as it reaches the center
        gsap.utils.toArray<HTMLElement>(`.${s.step}`).forEach((el) => {
          gsap.from(el.querySelectorAll(`.${s.num}, h3, p`), {
            y: 60,
            opacity: 0,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              containerAnimation: tl,
              start: "left 85%",
              end: "left 45%",
              scrub: true,
            },
          });
        });
      });
      mm.add("(max-width: 900px), (prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray<HTMLElement>(`.${s.step}`).forEach((el) =>
          gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%" } })
        );
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="process" className={s.process}>
      <div className={s.pin}>
        <div className={s.track}>
          <svg className={s.vineSvg} viewBox="0 0 2000 200" preserveAspectRatio="none" aria-hidden>
            <path
              className={s.vine}
              d="M0 120 C 150 40, 300 180, 500 110 S 800 30, 1000 110 S 1300 190, 1500 100 S 1800 40, 2000 110"
            />
          </svg>
          <div className={s.head}>
            <p className="eyebrow">How it works</p>
            <h2>
              A simple, <em>supportive</em> path forward.
            </h2>
            <p>
              Understand your symptoms, look deeper at what may be driving them, then build a plan that feels made
              for you.
            </p>
          </div>
          {steps.map(([t, d], i) => (
            <article key={t} className={s.step}>
              <span className={s.num}>0{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
        <div className={`${s.bar} wrap`} aria-hidden>
          <i />
        </div>
      </div>
    </section>
  );
}

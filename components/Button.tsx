"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import s from "./Button.module.css";

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "light" | "ghost" | "ghostLight";
  arrow?: boolean;
  className?: string;
};

// Magnetic pill: the whole button drifts toward the pointer, the label drifts further.
export default function Button({ children, href, variant = "primary", arrow = true, className = "" }: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  useGSAP(() => {
    const el = ref.current!;
    if (!matchMedia("(pointer: fine)").matches) return;
    const label = el.querySelector("span")!;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const lx = gsap.quickTo(label, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const ly = gsap.quickTo(label, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * 0.22); yTo(dy * 0.3); lx(dx * 0.08); ly(dy * 0.1);
    };
    const leave = () => { xTo(0); yTo(0); lx(0); ly(0); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  });

  const inner = (
    <span className={s.label}>
      {children}
      {arrow && (
        <svg className={s.arrow} viewBox="0 0 20 20" width="16" height="16" aria-hidden>
          <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      )}
    </span>
  );
  const cls = `${s.btn} ${s[variant]} ${className}`;

  // No href = placeholder CTA. Booking, forms and payments are intentionally not connected.
  if (!href)
    return (
      <button ref={ref} type="button" className={cls}>
        {inner}
      </button>
    );
  const external = href?.startsWith("http");
  return (
    <a ref={ref} href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
      {inner}
    </a>
  );
}

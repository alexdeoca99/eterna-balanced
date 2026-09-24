"use client";
import { useEffect, useRef } from "react";
import { gsap } from "./gsap";
import s from "./Cursor.module.css";

// Soft follower dot that swells over interactive elements. Fine pointers only.
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (!matchMedia("(pointer: fine)").matches) return;
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      el.dataset.on = "1";
      const hit = (e.target as HTMLElement).closest("a, button, [data-cursor]");
      el.dataset.hover = hit ? "1" : "";
    };
    const leave = () => (el.dataset.on = "");
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);
  return <div ref={ref} className={s.cursor} aria-hidden />;
}

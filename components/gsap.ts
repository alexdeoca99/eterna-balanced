"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);

/** Resolves once web fonts are loaded (capped at 2s), so SplitText measures the real font, not the fallback. */
export const fontsReady = () =>
  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2000))]).catch(() => undefined);

export { gsap, ScrollTrigger, SplitText, useGSAP };

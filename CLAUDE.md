@AGENTS.md

# Eterna Balanced — ground-up redesign of eternabalanced.com

## Rules
- Stack: Next.js (app router), CSS Modules, GSAP (+ScrollTrigger, SplitText, DrawSVG via @gsap/react), Lenis, Three.js hero. User chose GSAP for this project; no Motion.
- User asked for this build with no skills (impeccable etc.) other than GSAP.
- Never connect forms, scheduling/booking tools, or payments (no Typeform, no booking pages, no checkout links). CTAs are placeholder buttons (Button with no href).

## Fixed bugs — don't reintroduce
- 2026-09-24: Pricing "Single visits" tab crashed page → free plan has no [data-price] node → guard null before count-up.

- 2026-09-24: Placeholder CTAs rendered white with invisible text → <button> kept UA default background → `.btn { background: none }`.

- 2026-09-30: Hero/headings flashed then re-animated on first (uncached) load → text rendered before GSAP hid it, and SplitText ran on the fallback font → hero `[data-intro]` pre-hidden via `html.js` (6s CSS safety net), splits wait for `fontsReady()` in `components/gsap.ts`.
- 2026-09-30: Founder name broke mid-word ("Rou/se") → `type: "chars"` split lets lines break between letters → split `words,chars`.
- 2026-09-30: Process vine showed fully drawn → `vector-effect: non-scaling-stroke` breaks DrawSVG length math → removed it.
- 2026-09-30: Closing infinity trace jumped at the right tip on each loop → drawSVG `0–8%` → `92–100%` restarted → dash pattern with `pathLength={100}` and a looping `strokeDashoffset`.

## Current status
- Single-page homepage done: hero, marquee, mission, symptoms checker, pinned process, root diagram, founder, services, pricing, quiz, FAQ, closing, footer.
- No DESIGN.md / impeccable passes yet (skipped per user request).

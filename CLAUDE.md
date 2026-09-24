@AGENTS.md

# Eterna Balanced — ground-up redesign of eternabalanced.com

## Rules
- Stack: Next.js (app router), CSS Modules, GSAP (+ScrollTrigger, SplitText, DrawSVG via @gsap/react), Lenis, Three.js hero. User chose GSAP for this project; no Motion.
- User asked for this build with no skills (impeccable etc.) other than GSAP.
- Booking CTAs link to the live WP booking pages on eternabalanced.com; quiz is the existing Typeform (gKsyCc7u) in a native <dialog>.

## Fixed bugs — don't reintroduce
- 2026-09-24: Pricing "Single visits" tab crashed page → free plan has no [data-price] node → guard null before count-up.
- 2026-09-24: Typeform live-embed script rendered blank iframe → use direct form.typeform.com iframe instead.

## Current status
- Single-page homepage done: hero, marquee, mission, symptoms checker, pinned process, root diagram, founder, services, pricing, quiz, FAQ, closing, footer.
- No DESIGN.md / impeccable passes yet (skipped per user request).

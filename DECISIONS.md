# Decisions

## Static markup, imperative motion

Sections are server components that render static markup. All motion lives in `src/motion/` as plain TypeScript run once from a single client component (`components/motion.tsx`).
The ball, grid and scroll scenes coordinate across every section and re-measure the DOM each frame; porting that to per-component React state would add re-renders without benefit.
Each module registers its listeners, observers and frame loops on a shared `Env`, and GSAP work runs inside `gsap.context`, so unmount (and React Strict Mode's double effect) cleans up fully.

## `js` class set before paint

An inline script in `<head>` adds `html.js` so reveal states apply before first paint. `<html>` carries `suppressHydrationWarning` for that class change. Without JS, headings show a static orange dot and content is visible.

## Dropped from the prototype

The A/B demo, "everywhere" and "rolling statement" controllers, the HUD/cue and their CSS were dead in the prototype and were not ported. Geist Mono was only referenced by those rules and was dropped.

## Still placeholders

Pricing contents, FAQ answers, the illustrative brief/film copy and all five work pieces are concept content. The contact form only shows a local thank-you and is not wired to email or a CRM.

## Work index auto-advance

A piece's turn ends on its timeline's `onRepeat`, so one full loop is one play. The easing editor has no natural end, so its turn is a fixed 6.6s (two preset changes).
Auto-advance runs only at desktop widths: on mobile the rows are an accordion and opening the next one would move the page while someone reads. Under reduced motion nothing plays, so nothing advances.
The hand-over waits while the cursor is on the piece itself (the 3D and easing pieces are interactive), and hover picks a row once per entry so the cycle can move on while the cursor rests on a title.

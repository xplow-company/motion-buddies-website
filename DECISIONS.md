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

## How we work section

Ported from the approved split files into `src/motion/how-we-work.ts` with copy, layout and timing unchanged.
The canvases read the logo from the site's existing `#mb` symbol rather than a second `#mbm` copy, and resolve the hashed `next/font` family name at runtime for canvas text.
The heading's full stop is a `data-buddy` anchor, so the site's ball lands on it like every other section heading. Global `gsap.defaults` from the original script was dropped because every tween already sets its own ease and duration.

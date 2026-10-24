# Changelog

## Unreleased

- Reloading the page always opens on the hero instead of restoring the old scroll position or jumping to a `#section` left in the URL. Shared links like `/#pricing` still open at that section.
- "Five ways to make it move" now auto-advances on desktop: each piece plays once from the start, then the next row opens. Hovering or clicking a row plays it from the start and continues the cycle from there.
- Replace the "From brief to final frame" process section with the "How we work" bento: six canvas scenes that each play once on arrival, then rest, with a calm replay rotation and hover replay.
- Drop the Caveat font, which only the old process section used.
- Replace the homepage with the Motion Buddies design: hero with the bouncing full-stop ball and reactive dot grid, scroll-lit premise, pinned "brief to final frame" process, five live work pieces, FAQ, pricing and contact flood.
- Switch fonts to Instrument Sans and Caveat via `next/font`.
- Add GSAP 3.12.5 as a dependency.

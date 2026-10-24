# Motion Buddies website

Marketing site for Motion Buddies, a motion design studio for AI and SaaS products. Next.js (App Router) + GSAP.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Layout

- `src/app/` — layout (fonts, metadata), page, global styles.
- `src/components/` — static section markup (`sections.tsx`, `work.tsx`) and the `Motion` client component.
- `src/motion/` — the motion runtime: the full-stop ball (`buddy.ts`), hero dot grid (`grid.ts`), how-we-work canvas scenes (`how-we-work.ts`), work pieces (`work.ts`), reveals/scroll/FAQ/form (`page.ts`).

See `DECISIONS.md` for why motion is imperative and what is still placeholder content.

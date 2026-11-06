# AFTERHOURS®

A new React landing page for an independent listening club. Built from scratch with Vite, TypeScript, GSAP and `@gsap/react`.

## Run

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Vercel reads `vercel.json` and deploys the Vite output from `dist/`.

## Creative direction

Acid yellow, ink black, pale pink and warm paper. Condensed editorial typography, a layered vinyl record and tonearm made with CSS/SVG, three original geometric sleeve designs, and a printed club card. No stock imagery, WebGL, Three.js, UI kits, or other animation libraries.

## Motion from the supplied animation reference

| Supplied pattern | Implementation |
| --- | --- |
| Cinematic Brand Reveal / Fullscreen Mask Unveil | Asterisk intro and curtain opening |
| Oversized Split-Line Headline Reveal | Three staggered, masked headline lines |
| Layered Hero Depth Parallax | Scroll-scrubbed record movement |
| Scroll-Scrubbed Headline Reveal | Manifesto word opacity progression |
| Horizontal Pinned Gallery | Three record sleeves travel across a desktop pinned section |
| Fullscreen Curtain Menu | Native dialog with a GSAP curtain and staggered menu links |
| Magnetic Button Attraction | Pointer-following CTA displacement and elastic return |
| Hover Image Perspective Tilt | Sleeve lift and rotation on fine-pointer hover |
| Seamless Infinite Ticker | Continuous typography strip |
| Circular Text / Decorative SVG Motion | Spinning record label and scroll-linked card asterisk |
| Oversized Footer Typography Reveal | Staggered footer letter reveal |

All motion uses GSAP. `useGSAP` scopes animations and reverts them on unmount; `matchMedia` removes desktop pinning at small sizes. The operating system's reduced-motion setting is respected, and the footer has a motion toggle. The document remains readable with motion disabled.

Only the official GSAP core, timeline, React and ScrollTrigger skills were consulted. The user-supplied animation reference informed the creative effects.

## Interactions

- Sound starts only after an explicit button press. The sound control and every record dialog share one audio player.
- Each record opens an accessible native dialog with its own original 24-second preview.
- Escape closes dialogs, focus is trapped by the browser, background scrolling is locked, and focus returns on dismissal.
- Keyboard focus on the desktop gallery moves its corresponding sleeve into view.
- Mobile and reduced-motion layouts use a vertical collection without scroll pinning.
- “Count me in” saves a club-card preference in local storage only. It does not send data or subscribe anyone to a service.
- This is a fictional listening-club concept, not a real venue or ticketing service.

## Audio

The three previews are original synthesized sketches with no sampled recordings. The MP3 files are committed for reliable playback. To reproduce them, run `python scripts/generate-audio.py` with NumPy and ffmpeg installed. Those tools are not needed to build the website.

Fonts are bundled locally through Fontsource. No external font or media hosts are required at runtime.

## Checks

`npm run build` runs TypeScript checking and creates the production bundle. GitHub Actions repeats that build on pushes to `main` and pull requests.

The previous implementation was replaced in a normal Git commit, preserving the prior source in repository history.

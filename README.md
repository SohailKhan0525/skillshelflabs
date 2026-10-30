# Qofeno — One click. Zero friction.

## Still — Frontend UI UX Pro Plus demonstration

The additional route **[/frontend-ui-ux-pro-plus-skill/](https://skillshelflabs.vercel.app/frontend-ui-ux-pro-plus-skill/)** is an original editorial landing page for **Still**, a fictional lighting studio. The existing Qofeno homepage remains available at `/`.

The demo applies the `frontend-ui-ux-pro-plus` skill's design-system, composition, animated-illustration, motion, accessibility, and review guidance:

- Paper, terracotta, and olive colors; serif display typography paired with the existing self-hosted Manrope family; varied editorial sections instead of repeated cards.
- An original SVG Arc 01 lamp with three finishes, adjustable brightness, on/off feedback, and two lighting moods that reposition its shade.
- Motion.dev 14.9.0 powers a four-second lamp choreography, replay/stop controls, SVG drawing, scroll reveals, and spring feedback. Product controls interrupt the sequence and settle to the current selection. A page-wide motion switch and system reduced-motion preference provide static alternatives. GSAP remains only for the existing Qofeno homepage.
- The embedded motion collection provides 240 searchable, replayable configurations across 24 executable families, including shared layout, SVG paths/morphs, timelines, drag, scroll progress, and kinetic text. Only the selected preview runs, with no indefinite ambient loops. Copy configuration JSON or inspect it in place.
- Native radio controls, range input, disclosures, and a modal dialog. Every visible action has a working destination or local state transition.
- Saving creates an in-memory snapshot. “Your saved light” restores that exact combination after further exploration. Nothing is ordered, persisted across reloads, or sent to a server.
- Scoped CSS keeps the new art direction separate from the existing homepage. The page includes its own metadata and responsive layouts.

`src/components/still/` contains the illustration and interaction implementation, `src/lib/still-light.ts` contains the selection model, and `src/app/frontend-ui-ux-pro-plus-skill/` contains the route and scoped styling. `tests/still-light.test.tsx` tests server-rendered semantics, selection, dimming, reduced-motion control state, and save/restore behavior. `tests/motion-library.test.tsx` checks all 240 records and 480 server renders (normal/reduced), search, exported configurations, and control semantics. These are 240 configurations of 24 implementations, not 240 independently browser-verified techniques. DOM tests do not establish browser focus containment, rendered layout, or accessibility conformance.

The product, brand, and specifications are explicitly a design concept. This page does not claim real manufacturing, stock, sustainability certification, customer reviews, or commerce capabilities.

---

A code-only Qofeno hero based on the supplied animation reference, using React, inline SVG, and GSAP on Next.js. All illustration geometry is authored in `src/components/KeyboardScene.tsx` and `src/lib/keyboard-geometry.ts`; there are no raster images, rendered videos, external embeds, or 3D assets.

## Development

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
```

The production build prerenders the hero into the standard Next.js `.next/` output. `vercel.json` configures installation and build commands for the existing Vercel project.

## The illustration

- Isometric projection maps keyboard coordinates into SVG paths.
- Rounded polygon tops and extruded lower faces form the case and keycaps.
- Gradients, outlines, and a subtle SVG noise filter shade the display.
- GSAP timelines animate automatic START/Connect/Enter key presses, the selection cursor, typed tooltip, display meters, signal, wallet bob, and knob indicator.
- SVG attributes are updated directly so animation does not overwrite isometric projection transforms. Key sidewalls compress with their tops.
- Click keys or type START. Manual presses blend with automatic presses without fighting over transforms.
- Keys respond to pointer and keyboard activation. Connect opens a demo wallet flow; Learn more opens an explanation.
- Watch Demo restarts the animation; the circular control pauses it.
- System reduced-motion preferences disable autoplay. Watch Demo or Play explicitly opts into animation.
- Replay/unmount restores all original SVG attributes before recreating the timelines, preventing cumulative transform or meter-height changes.
- `npm test` runs animation regression tests against the rendered SVG DOM, including repeated playback and cleanup.
- Native dialogs support focus containment, Escape, and backdrop dismissal.

The connection is an explicitly labelled UI demonstration. It does not access a wallet, transfer funds, or connect to a blockchain. State resets on reload.

The supplied reference informed the composition and animation. This implementation redraws its shapes in code; it does not claim pixel-identical reconstruction or affiliation with the reference's creator.

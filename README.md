# Minto — One click. Zero friction.

A code-only recreation of the supplied Minto hero animation, built with React, inline SVG, and GSAP on Next.js. All illustration geometry is authored in `src/components/KeyboardScene.tsx`; there are no raster images, rendered videos, external embeds, or 3D assets.

## Development

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
npm run typecheck
npm run build
```

The production build prerenders the hero into the standard Next.js `.next/` output. `vercel.json` configures installation and build commands for the existing Vercel project.

## The illustration

- Isometric projection maps keyboard coordinates into SVG paths.
- Rounded polygon tops and extruded lower faces form the case and keycaps.
- Gradients, outlines, and a subtle SVG noise filter shade the display.
- GSAP timelines animate the selection cursor, typed tooltip, display meters, signal, and knob orbit.
- Keys respond to pointer and keyboard activation. Connect opens a demo wallet flow; Learn more opens an explanation.
- Watch Demo restarts the animation; the circular control pauses it.
- System reduced-motion preferences disable the looping animation.
- Native dialogs support focus containment, Escape, and backdrop dismissal.

The connection is an explicitly labelled UI demonstration. It does not access a wallet, transfer funds, or connect to a blockchain. State resets on reload.

The supplied reference informed the composition and animation. This implementation redraws its shapes in code; it does not claim pixel-identical reconstruction or affiliation with the reference's creator.

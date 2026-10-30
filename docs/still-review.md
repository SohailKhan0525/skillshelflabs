# Still: design decisions and validation

## Skill applied

Built using `frontend-ui-ux-pro-plus` after reading its entry point and the design-system, layout/composition, animated-illustration, motion, accessibility, and quality-rubric references. The task is a standalone product concept on an existing site. Its audience should be able to discover the object, explore its appearance and light, and save a local combination without mistaking it for a real store.

The chosen direction is warm editorial product design: paper, olive, terracotta, serif display type, and the repository's existing self-hosted Manrope. The object is the focal point. Dense dashboard composition would weaken the story; a dark technology aesthetic would work against the material and quiet domestic setting. The root Qofeno page, shared dependencies, and deployment configuration are preserved.

| Device | Purpose | Cost and simpler alternative |
| --- | --- | --- |
| Original SVG lamp | Makes finish and lighting decisions directly visible | Small authored SVG; a static picture would not communicate the interactive states |
| Short shade rotation | Shows the change between reading and unwinding | Existing GSAP, no new library; immediate final state under reduced motion |
| Warm light gradient | Explains the switch and dimmer | Bounded SVG paint; flat opacity would provide less spatial context |
| Serif/italic display contrast | Establishes a quiet, tactile identity and hierarchy | System font; no added font requests |
| Technical drawing | Explains the fictional object's proportions | Static SVG with a textual equivalent in the specification list |
| Editorial rows and varied section lengths | Separates product choice, rationale, specification, and questions | Plain responsive CSS; no carousel or card-grid dependency |

No ambient loops, delayed hero content, scroll hijacking, invented customer claims, real commerce actions, external image services, or persistent user data were added. The concept is labelled next to the primary interaction and explained in the FAQ.

## Actual evidence

- Nine Node/JSDOM tests passed: six existing keyboard-animation regressions and three new tests covering server-rendered semantics, selection rules, and the complete lamp/configuration interaction flow.
- The local production compiler, TypeScript check, and static prerender passed. The managed executor required a temporary, external shim for an unavailable libuv memory-telemetry call. That shim is not part of this repository or deployment.
- GitHub Actions completed the unchanged clean CI pipeline successfully for the initial feature commit: install, typecheck, all nine tests, and the normal production build.
- Vercel completed a production build and served the new route on the existing domain.
- The live Chromium page was exercised at a 1363 × 936 CSS-pixel viewport. Finish selection, mood change, on/off behavior, keyboard range adjustment, opening the native dialog, saving, changing the selection, restoring the saved snapshot, Escape dismissal, and return of focus to the invoking button were checked.
- Desktop hero, dialog, and lower-page screenshots were visually inspected. The document had no horizontal overflow at the tested viewport. A visual refinement moved the book onto the illustrated plinth instead of leaving it apparently unsupported.
- The first FAQ disclosure was opened in the live browser and its explanatory content verified.

## Remaining limits

No automated browser accessibility scan, screen-reader session, physical mobile-device session, cross-browser run, field performance measurement, or mobile viewport screenshot is claimed. The browser interface did not expose viewport resizing; desktop overflow results do not establish mobile reflow. Responsive rules are authored for narrow, tablet, and wide layouts. Reduced-motion final states and cleanup were exercised in DOM tests, not with an emulated operating-system preference in the live browser.

The saved combination exists only in memory and resets on refresh. The fictional brand, product, dimensions, and material idea are demonstration content, not manufacturing or sales claims.

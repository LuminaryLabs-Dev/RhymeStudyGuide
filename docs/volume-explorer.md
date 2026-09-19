# Rhyme Study Guide — fixed visual reader

The homepage fits one viewport. Volume 01 is selected on entry; `#volume-01` through `#volume-12` restore a selection. A complete, flat cover sits beside its reading focus on desktop and above it on mobile. Thumbnails, arrows, keyboard arrows, wheel gestures, and cover swipes issue the same selection command. The cover and summary settle after roughly 480 ms; reduced motion removes the transition.

Wheel input accumulates to a threshold, selects once per burst, then waits for both a 220 ms quiet gap and a 650 ms cooldown. Reading panels, menus, links, controls, and the thumbnail strip keep their own gestures. Ctrl-wheel remains available for browser zoom. A swipe begins on the cover; multiple touches cancel selection so pinch zoom remains available. The first and last volume are bounded.

Volumes, Reading activities, Resources, and About are explicit views inside the shell. Supporting content and expanded reading panels can scroll internally. The document stays fixed. The standard reading layout is a normal scrolling list, also used when JavaScript is unavailable. Forty static companion and learning pages remain available at their existing routes.

## Domain ownership

| Source | Responsibility |
| --- | --- |
| `src/domains/volumes/catalog.mjs` | Public reading-focus records and asset paths |
| `src/domains/volumes/view-model.mjs` | Selected volume, current view, expansion, transition, and hash state |
| `src/domains/volumes/view.mjs` | Homepage and companion HTML from prepared records |
| `src/domains/volumes/controller.mjs` | Bind DOM controls, history, focus, motion and state |
| `src/domains/volumes/input.mjs` | Translate wheel bursts and touch swipes into selection commands |
| `src/domains/volumes/style.css` | Fixed layout, cover sizing and responsive presentation |
| `src/domains/atmosphere/world.mjs` | Shared Three.js scene for browser and native rendering |
| `src/domains/atmosphere/world-renderer.mjs` | Canvas sizing, visibility, motion and WebGL lifecycle |

The existing content repository and page MVVM pipeline still own the other reading pages. No new framework, dependency, generic service layer, or event bus was added. Build scripts publish generated HTML and assets at the repository root.

## Content boundary

The twelve entries are original reading focuses with concept cover art. They are not summaries of Dylan’s books. `bookTitle` and `bookSummary` remain null until approved public material is supplied. No manuscript, private answer notes, fabricated quotations, or purchase claims are published.

## Validation

Run `npm run build`, `npm test`, and `npm run validate`. Run `QA_CHROMIUM_PATH=/path/to/chromium QA_MODULE_ROOT=/path/to/browser-runtime npm run test:browser` for local interaction, viewport, fallback and accessibility checks. The external QA runtime supplies Playwright and axe; it is not part of the deployed website.

`scripts/render-world.mjs` imports the same production scene through the native headless Three.js renderer. It checks deterministic still output and a changing animated frame. The existing Mesa/Vulkan runtime supplies that renderer; no renderer dependency is shipped to the browser.

`validation/release/fixed-reader/` contains the five-pass review ledger, source snapshots, before/after captures and exact check results. Automated Chromium checks do not establish physical-device, screen-reader, Safari or Firefox coverage.

## Clouds and birds (2.2.0)

The atmosphere domain also owns `clouds.mjs`, `style.css`, and `flock.mjs`. Cloud HTML is rendered in a fixed `.foreground-atmosphere` layer above the reader and outside `world-art`; `pointer-events: none` keeps all controls clickable. CSS transforms move three alpha WebP images across the upper half of the screen over 120–190 seconds. Their resets occur outside the viewport. Two layers remain visible on mobile. Cloud animation pauses for reduced motion, the visible motion toggle, hidden documents and standard reading layout.

Seven generated bird rigs (four on narrow screens) follow two joined cubic Bézier segments in a closed 60-second path. Each rig is composed from a separate body, left wing, and right wing sprite. The path controls position; horizontal tangent direction controls facing; vertical tangent direction produces only a limited ±0.16 rad bank, so birds never rotate upside down. The wing phase rotates both wings from their attachment points. Phase offsets create cohesion and alternating lateral slots maintain separation without a simulation or new dependency. This is a lightweight guided flock, not a general-purpose boids simulation. The same orientation helper is used by the Three.js flock helper for native validation. The overlay is z-indexed above the reader, uses transparent alpha assets, and passes all pointer input through to the controls. Local browser captures validate the cloud layers, bird parts, upright orientation, overlap and pointer pass-through.

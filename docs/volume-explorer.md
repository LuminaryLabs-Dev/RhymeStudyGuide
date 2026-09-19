# Rhyme Study Guide — volume explorer

## Delivered experience

The homepage follows the approved navy, cobalt, parchment, red, and gold editorial reference. The public name is **Rhyme Study Guide**. Twelve illustrated covers form a perspective book deck. Volume 11 is initially selected to match the reference; `#volume-01` through `#volume-12` override that selection.

Every selection changes the raised cover, summary, progress marker, accessible selected state, and URL. Previous/next buttons stop at the ends. Arrow keys, Home, and End work when the carousel has focus. Mouse dragging moves one volume; mobile uses native horizontal scrolling with snapping and preserves vertical page scrolling. The detail panel can be hidden and reopened. The full-screen navigation traps focus, closes on Escape, and returns focus to its trigger.

Twelve permanent `volumes/NN/` pages link to existing reading activities. The complete collection is rendered in HTML, so navigation and reading remain available without JavaScript. Forty static pages are generated in total.

## Content distinction

The repository contains no approved book titles, summaries, manuscripts, or author biography. The twelve numbered entries therefore contain **original reading focuses**, not invented descriptions of Dylan’s books. Each volume page and the collection explain this distinction. The art is conceptual, not a representation of published covers. `bookTitle` and `bookSummary` remain null in the data model until approved public content is supplied. No purchase links, publication claims, or fabricated quotations are added.

## Source ownership

- `src/content/volumes.mjs`: twelve serializable reading-companion records and asset paths.
- `src/viewmodels/explorer.mjs`: selection, boundaries, panel/menu state, URL parsing, subscription model, and prepared display records.
- `src/views/explorer.mjs`: static homepage and volume page rendering.
- `src/services/explorer.mjs`: DOM bindings, gestures, focus, history, motion preference, and responsive layout.
- `src/scene/world.mjs`: shared production Three.js scene, also used by the native renderer.
- `src/services/world-renderer.mjs`: browser WebGL lifecycle, canvas sizing, pause/resume, visibility, and context recovery.
- `src/styles/explorer.css`: responsive deck, paper panel, parallax layers, entrance and state animations.

Views do not fetch data. Models are public static records. The ViewModel owns interactive selection. Services adapt browser input to the ViewModel.

## Four independent visual layers

1. Ink field: dark atmospheric background with a small depth offset.
2. Environment: generated landscape, ruins, moon, globe, and desk, optimized to WebP.
3. Three.js objects: curved double-sided pages with individual line meshes, a faceted gold compass star, and seeded dust. Toon materials use a four-step lighting ramp.
4. Foreground: independent transparent red and blue paint fragments and gold marks.

The cards and paper panel remain live HTML above the scene. Layers respond to pointer and scroll with bounded movement. On mobile, pointer tilt is removed and the environment uses a smaller image. There is no scroll hijacking or timed barrier to reading.

## Motion and lifecycle

- Intro content enters progressively over approximately 0.9 seconds.
- Card selection uses a 650 ms transform transition.
- Summary content reveals over 450 ms with a short internal stagger.
- Ambient pages and particles move slowly at a capped 30 frames per second.
- Rendering pauses when the scene leaves the viewport, the tab is hidden, or motion is disabled.
- Device reduced-motion preferences override decorative animation; a visible motion control saves the user’s choice where browser storage is available.
- WebGL failure leaves the illustrated background and all reading functions intact.
- No canvas or asset-loading overlay blocks navigation.

## Static delivery

`npm ci && npm run build` bundles the interaction controller and a separately loaded Three.js chunk using pinned dependencies. No browser requests to npm or a third-party CDN are required. Assets and HTML are committed at the existing `main / (root)` GitHub Pages source. No workflow or Pages configuration change is needed.

The project URL is `https://luminarylabs-dev.github.io/RhymeStudyGuide/`. All generated internal links preserve `/RhymeStudyGuide/`. Direct volume routes work without SPA rewrites. `asset-manifest.json` lists production assets and sizes.

## Validation

Run `npm test`, `npm run validate`, and `node scripts/explorer-qa.mjs` with `QA_MODULE_ROOT` and `QA_CHROMIUM_PATH` pointing to the external QA installation. QA starts the exact repository build on localhost and exercises real browser state, routes, accessibility, mobile layout, history, motion preferences, and fallbacks.

`node scripts/render-world.mjs` separately validates the actual production scene through native WGPU/Vulkan using `@headless-three/renderer`. Set `RENDER_MODULE_ROOT`, `VK_ICD_FILENAMES`, `LD_LIBRARY_PATH`, `XDG_RUNTIME_DIR`, and `MESA_SHADER_CACHE_DIR` for the local rendering runtime. It compares deterministic PNG hashes and an animated frame. Browser UI screenshots are additional evidence, not a substitute for the native 3D render.

Evidence in `validation/release/` records the actual tested scope. Automated Chromium coverage does not establish testing in native Safari or Firefox, a physical device, or a screen reader.

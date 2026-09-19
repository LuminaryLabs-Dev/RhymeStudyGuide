# Release validation — 2.0.0

Source: Rhyme Study Guide root static build, 2026-09-19.

- 13 content and ViewModel tests passed.
- 40 generated routes and 879 internal links passed validation.
- 43 browser checks passed in headless Chromium against the exact localhost build.
- All 12 book covers were clicked and verified against their selected card, summary, and URL.
- Real touch input, desktop dragging, keyboard navigation, focus trapping, history, reloads, mobile centering, and six viewport widths were exercised.
- Cover-loading and WebGL failures preserve reading and navigation.
- Automated WCAG A/AA checks found no violations on the desktop homepage, mobile homepage, or volume page. This is not a claim of a complete manual accessibility audit.
- No uncaught browser errors.
- Native WGPU/Vulkan rendered the shared production Three.js scene through Mesa Lavapipe; repeated frames matched SHA-256 and animation changed the framebuffer.
- Existing reading notes, discussion prompts, and no-JavaScript navigation were verified.

Desktop and mobile WebP files are fresh browser screenshots. Native PNGs are actual Three.js renderer output. Native Safari, Firefox, physical-device, and screen-reader testing were not performed in this environment.

Official book titles and book-specific summaries are still awaiting approved author content. The delivered volume pages explicitly contain original general reading activities and concept artwork.

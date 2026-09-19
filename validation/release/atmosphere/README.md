# Clouds and flock — 2.2.0

Baseline: 08a8196dfbe07517d8a912b1d79c74851f1f1196.

54 local Chromium checks passed, including the existing reader tests, cloud loading, motion/pause, reduced motion, hidden-document freezing, pointer isolation and mobile cloud reduction. Seventeen unit/content tests passed, including flock spacing and seamless path/heading/wingbeat checks. Forty static routes and 905 links passed.

The actual production Three.js scene rendered through native WGPU/Vulkan on Mesa Lavapipe. Repeated still frames match, animated frames differ, and isolated flock renders at 0 and 60 seconds match exactly. The isolated flock image uses a neutral light background to make the silhouettes inspectable. Browser screenshots show the transparent cloud artwork within the actual localhost site; native rendering verifies the bird geometry, not the DOM cloud images.

No automated accessibility violations or uncaught browser errors. Physical-device, screen-reader, Safari and Firefox behavior was not tested. Generated image prompts and production asset paths are in docs/assets.md.

# Foreground atmosphere review — 2.4.0

Baseline: 52dc80eed125d1af283d05b45fe01ee33f8ad08d.

The clouds and birds now occupy a fixed transparent foreground overlay across the upper half of the viewport. The overlay is above the book and reading panel visually and uses `pointer-events: none` so every control remains clickable.

The local browser suite passed 56 checks, including the existing reader tests, foreground z-index and pointer pass-through, cloud loading and drift, pause motion, reduced motion, hidden-document freezing, desktop/mobile bird counts, layered bird asset loading, overlap, and all existing reader interactions. Seventeen unit/content tests passed. Forty static routes and 926 links passed.

The actual Three.js scene rendered through native WGPU/Vulkan on Mesa Lavapipe. The shared flock path renders at the same pose at the loop boundary, with deterministic native output. Browser captures validate the transparent image and layered bird foreground; native rendering validates the shared path and Three.js flock helper.

Physical-device, screen-reader, Safari and Firefox behavior was not tested.

# Artwork

The built-in image generation tool produced two standalone illustrations; both were verified to contain a real varying alpha channel. No chroma-key processing was needed because the backgrounds were already transparent. The original PNGs were preserved outside the repository; production derivatives are optimized transparent WebP images.

- `assets/open-book.webp`: 1200 × 800; open antique book, cream pages, indigo binding, brass light, botanical engraving. Independent background/middle parallax layer.
- `assets/botanical.webp`: 600 × 900; indigo-stem botanical sprig, cream leaves, ochre seedpods. Independent foreground parallax layer.

These are decorative learning-space artwork, not representations of Dylan’s book covers or source manuscripts. They have empty alt text inside an aria-hidden decorative composition.

## Generation prompts

Book: “Use case: illustration-story. Create a premium editorial illustration asset for a literary educational website: a single open antique book floating in three-quarter view, its cream pages curling gently upward, indigo cloth binding, subtle engraved botanical details, warm golden edge light, delicate ink-and-watercolor illustration with sophisticated fine texture, restrained midnight blue and brass palette. Subject centered, isolated, fully inside frame, generous transparent padding. No letters or text anywhere. Genuine transparent background with alpha, no checkerboard baked in, no floor or backdrop, no drop shadow backdrop. Landscape 3:2. This is a standalone compositing layer, not a web page or mockup.”

Botanical: “Use case: illustration-story. Standalone foreground compositing asset for a premium literary educational website. A graceful botanical sprig curving diagonally upward, fine deep-indigo stems, cream leaves and tiny ochre seedpods, subtle antique botanical engraving meets watercolor texture. Sophisticated understated illustration, crisp beautiful silhouette. Subject isolated and fully inside frame, ample transparent padding, genuinely transparent background alpha, no checkerboard, no backdrop, no text, no border. Portrait composition. Designed as a movable parallax layer around an illustrated open book.”

## Cel-shaded collection (2.0.0)

The hero and twelve-cover atlas were generated from the approved visual reference. `assets/world/hero.webp` is the clean scene without embedded UI. `hero-mobile.webp` is its optimized responsive export. `cover-atlas.webp` is the source for `scripts/export-covers.py`; all 12 covers have large and small WebP exports. Covers are conceptual and contain live HTML volume numbers. Transparent foreground marks and paper grain are local SVG assets. Animated paper and star meshes are constructed in `src/domains/atmosphere/world.mjs`. No image contains functional interface text.

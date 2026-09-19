# Architecture and MVVM boundaries

This site is a zero-runtime-dependency static generator written in ECMAScript modules. It produces a real HTML document per route; refresh and deep links do not depend on a client router or server rewrites.

1. `src/content/public.mjs` contains public domain content only.
2. `src/models/validate.mjs` validates identities, required fields, publication gates, and references.
3. `src/repositories/content-repository.mjs` owns retrieval and collection relationships.
4. `src/viewmodels/pages.mjs` resolves related content, route URLs, card display data, and previous/next boundaries.
5. `src/views/pages.mjs` and `src/components/html.mjs` render prepared ViewModels with escaped text.
6. `src/services/site.js` enhances existing HTML with local interaction state. It does not fetch source content or know the book domain repository.

The build-time ViewModel is pure and testable. The browser service acts as a small interaction controller for DOM-local state: prompt selection, menu expansion, motion preference, and note state. It is separate from domain data and never mixes private content into a public page.

## Motion contract

- Entrance reveals are brief, once-per-section, and never a prerequisite to reading content.
- Text is present and visible before JavaScript, with no forced loading sequence.
- Book and botanical assets are separate transparent layers with different bounded pointer/scroll depths.
- Pointer effects only run on fine-pointer devices; scroll effects do not capture scrolling.
- There is no permanent animation loop, autoplay video, flashing, or scroll hijacking.
- System reduced motion and the local Motion control disable decorative motion.
- Links, buttons, questions, prompts, and supported native page transitions have short state feedback.
- Print expands question hints and removes decoration/navigation.

## Privacy

The hosting root and GitHub repository are public. Never store private/draft material here, even if it is excluded from a ViewModel. Browser notes remain in localStorage on this browser profile, are not encrypted, and are not synced. The interface explains the shared-device limitation and supports clearing each note.

## Page families

Home; bookshelf; study overview; reading-practice overview and three activities; themes and three detail pages; vocabulary and eight detail pages; discussion; resources and two print sheets; about, author, and project; and a genuine 404 document.

Book, book-study, chapter, and chapter-discussion templates generate only when approved book/chapter records exist. Test fixtures prove these paths without publishing fictional catalog content.

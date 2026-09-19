# Public content authoring

Only add content approved for public distribution. Keep manuscripts, unpublished notes, review feedback, and private answer notes outside this repository.

The current general-purpose activities are original guidance, not Dylan quotations, summaries, or confirmed book themes. Keep this distinction clear in public language.

## Add a book

Add a public `books` entry in `src/content/public.mjs` with:

- `slug`: lowercase kebab-case, unique among books; reserve `reading-practice` for the built-in activity path.
- `title`, `author`, `summary`: approved public text.
- `publicationApproved: true`: explicit publish gate for supplied material.
- Optional `cover`: URL under `/RhymeStudyGuide/assets/` for a cleared-for-use cover asset.
- Optional `themes`: slugs from the theme collection, only if supported by the book.

Add chapters with unique `slug`, `title`, `book` slug, numeric `order`, `introduction`, `questions` (title/hint objects), and optional `discussion` prompts. Do not put private answer notes into hints. Public questions should use only cleared excerpts; the initial activities use no book excerpts.

Run build, unit tests, and link validation. Review the actual new pages and content before an authorized release. Confirm the completeness of book and chapter coverage with the content owner; a valid build alone does not prove editorial completeness.

## Biography and materials

Replace `author.biography` only with approved biography text. Do not invent photographs, credentials, reviews, reading levels, book counts, titles, or publications. Current AI-generated decorative illustrations are not book covers.

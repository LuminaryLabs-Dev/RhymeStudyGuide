# Rhyme Study Guide

An illustrated, animated reading companion for Dylan’s Books, with a twelve-volume explorer and forty static pages.

Live target: https://luminarylabs-dev.github.io/RhymeStudyGuide/

## Build and run

Requires Node 22 or newer. Install the pinned Three.js and esbuild dependencies with `npm ci`. The deployed site has no backend or CDN dependencies.

```sh
npm ci
npm run build
npm test
npm run validate
npm start
```

Open `http://127.0.0.1:4173/RhymeStudyGuide/`.

## Deployment

Generated HTML, `assets/`, and `.nojekyll` are committed at the `main` branch root, matching the existing GitHub Pages `main / (root)` publishing source. Do not point Pages at `src/`, change the hostname, or add a second project-name directory. Rebuild before committing changes to the source.

## Content boundary

The initial release includes original, general reading-practice activities, discussion questions, three exploration lenses, eight glossary entries, and printable worksheets. No book titles, manuscripts, summaries, chapter content, or author biography were supplied. Those are not invented. Book and chapter templates exist and are tested with nonpublished fixtures.

This is a **public repository and public static root**. Everything committed can be downloaded, including source and documentation. Never commit private notes, draft manuscripts, answer keys, credentials, private trackers, or Drive exports. ViewModel filtering is not access control.

See `docs/architecture.md`, `docs/content-authoring.md`, `docs/deployment.md`, and `docs/assets.md`.

## Illustrated volume explorer

The homepage uses MVVM selection, twelve generated cover concepts, native mobile swipe, keyboard controls, deep links, a layered Three.js scene, and a reduced-motion option. Each volume has a permanent reading-companion page. No official book titles or summaries were supplied; original reading focuses are explicitly distinguished from book-specific content. See `docs/volume-explorer.md` and `validation/release/` for architecture and verification evidence.

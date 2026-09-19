# Rhyme Study Guide

A warm, progressively enhanced reading companion for Dylan’s Books.

Live target: https://luminarylabs-dev.github.io/RhymeStudyGuide/

## Build and run

Requires Node 22 or newer. The production build has no package dependencies or backend.

```sh
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

# Working in RhymeStudyGuide

- Repository: LuminaryLabs-Dev/RhymeStudyGuide; production branch: main, root publishing.
- Run `npm ci`, edit `src/`, then run `npm run build`; generated HTML, CSS, and JavaScript bundles are tracked root output. Never edit generated bundles directly.
- The public name is Rhyme Study Guide. The volume data describes original reading focuses until approved book metadata is supplied.
- See `docs/volume-explorer.md` for the shared Three.js scene, browser QA, and native rendering validation.
- Keep volume changes inside `src/domains/volumes/` and decorative Three.js changes inside `src/domains/atmosphere/`. Do not add generic services for domain-local behavior.
- Preserve Model → Repository → ViewModel → View separation. Views receive prepared relationships, not raw storage.
- Never invent book facts. Only put public, publication-approved material in this repository.
- Do not include private source files in this root-published repository; hidden links are not privacy.
- Preserve no-JavaScript reading, keyboard support, reduced motion, project-base links, and print styles.
- Run tests and route validation, plus browser interaction and responsive checks, before publication.
- All external writes need current user authorization. Never force-push.

# GitHub Pages deployment

Repository: `LuminaryLabs-Dev/RhymeStudyGuide`.
Publishing source: `main`, `/(root)`.
URL: `https://luminarylabs-dev.github.io/RhymeStudyGuide/`.

The supplied settings screenshot shows branch-root publication. This build preserves that setup: generated HTML is at the root, not inside `dist/` or another nested `RhymeStudyGuide/` directory. `.nojekyll` tells Pages to serve the prebuilt artifacts. No custom domain or workflow change is required.

1. Inspect current branch and remote revision; preserve unrelated changes.
2. Run `npm run build`, `npm test`, `npm run validate`.
3. Serve the exact checkout and test desktop, mobile, keyboard, reduced motion, no JavaScript, links, prints, notes, and discussion state.
4. Commit source plus generated output. Do not include node_modules, credentials, temporary evidence videos, or private content.
5. With explicit permission, fast-forward push to main; never force-push or bypass branch protection.
6. Verify the Pages deployment for that revision, then compare live document/asset hashes and exercise a live interaction.

The local server mirrors the project base path. Static content has no server functions, no API keys, and no authentication requirements. Font loading uses local assets when available; system serif/sans fallbacks keep content readable if a font fails.

Rollback: make an authorized revert commit of the release and push normally, preserving history. Verify the reverted live deployment. Do not delete the repository or rewrite branch history.

Reference: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

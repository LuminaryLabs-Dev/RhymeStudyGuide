# Release validation — 2026-09-19

Local build checked against the exact RhymeStudyGuide checkout, based on remote revision `780a6e7fd93ba08ffcc744a401db76077e68982a` plus this release's changes.

- Static build: 28 pages.
- Unit tests: 10 passed, including missing/duplicate content, non-public metadata rejection, relationships, escaping, and book/chapter template fixtures.
- Internal links and assets: 567 checked, no missing targets.
- Browser render: all 28 pages loaded, one H1 each, no broken images, no desktop overflow.
- Responsive: all 28 pages checked at 390px and 320px, no horizontal overflow.
- Automated accessibility: axe WCAG 2 A/AA and 2.1 AA scan on all 28 desktop pages, zero reported violations after contrast corrections.
- Interactions: separate parallax layers, discussion prompt selection, question disclosure, local note save/refresh/clear, persisted motion setting, system reduced motion, mobile menu Escape/focus, print-to-PDF, and no-JavaScript reading/navigation passed.
- Browser console and failed network requests: none in the successful run.
- Visual review: desktop homepage, mobile homepage/reading, and discussion layout inspected from fresh captures.

Run ID: `local-2026-09-19T05-03-01-620Z`. Screenshots and the detailed report are task-local QA artifacts, excluded from the published site. Public routes contain no internal ticket or workflow links.

This is a bounded engineering validation, not a guarantee of perfection, a complete manual assistive-technology audit, or editorial approval of unsupplied book content.

## Remaining editorial scope

Dylan’s actual books, summaries, chapters, approved biography, book-specific themes, and final book materials are not supplied. No fabricated catalog or author facts were published. Templates support future approved records. General practice material is explicitly described as original, book-independent learning guidance.

# Campaign Git publication

Date: 2026-10-31. Status: **DONE**. Branch `feat/complete-five-room-campaign` is pushed; [PR #3](https://github.com/thaideptrai218/mat-ma-dien-bien-phu/pull/3) is open against `main`. Main has not been merged and hosting was not performed.

## Scope and ancestry

- Initial canonical HEAD: `11b36a004685d241d74e6017b15b56249a033080`.
- Refreshed remote baseline: `5ff03c241a35bfe4137bc8fd5bebd43079450648`, containing Bảo's merged PRs #1/#2.
- Feature `a9c3ec3`: completed five-room campaign, original Bảo adapter, local assets/fonts, independent previews, meaningful tests and intentional legacy runtime/map retirement.
- Documentation `6125bb4`: current product docs, dated implementation/QA evidence and source-path privacy cleanup.
- Normal merge `2040b4e`: remote baseline is an ancestor. Expected README/index conflicts keep the accepted campaign; legacy modify/delete conflicts keep intentional retirement. No ours strategy or force push used.
- Bảo's remote design documents, all three SVG diagrams and Quang character-animation rename match remote baseline exactly. Room 2 adapter content did not change during that merge.
- Fidelity fix `a1d4613`: `.gitattributes` disables text conversion for `src/room-two/bao/**`. Restaging only that snapshot preserves captured bytes across clone platforms; ignoring EOL, no source logic changed. Donor/hash manifests and assertions were not changed.
- Final publication metadata links this PR from the plan, README and campaign journal. Existing collaborator invitation was not repeated.

## Verification

- After normal merge: **105/105 tests pass** and **all five production entries build**. Known Phaser chunk-size advisory remains; no build errors.
- Actual native five-room acceptance precedes publication; see [campaign QA](campaign-qa.md) and [review GO](code-review.md). No repeat journey needed for animation labels or byte-preservation metadata.
- Protected donor read-only SHA-256 checks: **8/8 match** provenance. No donor source, process or save modified.
- Raw committed `git show HEAD:path` bytes match working files for **5/5** provenance-hashed adapted renderers/art/CSS after the fidelity fix.
- Extracted full committed Git archive under ignored `tmp/`; **13/13 Room 2 tests pass** there, including unmodified renderer/CSS byte-hash assertions, registry/geometry fidelity and original evaluators. This verifies committed content rather than only the Windows working tree.
- Previously uploaded `docs/game-story-v2.pdf` and `docs/game-story.docx` blobs remain unchanged. Remote contribution preservation and ancestry checks pass.
- Branch diff whitespace check passes with CR-at-EOL recognized for intentionally byte-preserved donor files. Four incidental whitespace issues were trimmed before the feature commit; no behavior changed.

## Publication audit

- Exact staged/branch additions scanned for credential assignments, access tokens, private keys, connection strings and absolute personal user-home paths: no matches.
- No private PDF4, raw personal transcript, dotenv, key, dependencies, build output or temporary files added. New plain text assets are font licenses; public font-author attribution retained.
- Plan/report personal home prefixes replaced with `<USER_HOME>`; private source PDF filename/path replaced with a generic supplied-source description. Source hashes and relative evidence links preserved.
- Scoped feature/docs/fidelity/status commits published. Preview server remains running; no reset, clean, stash, force push or direct main merge performed.

Status: DONE
Summary: Completed campaign published as an ancestry-preserving reviewable PR, with post-merge tests/build and committed donor-byte verification.
Unresolved questions: none blocking publication. Main review/merge and hosting remain separate future actions.

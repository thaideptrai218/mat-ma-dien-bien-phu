# Git publication preparation

Date: 2026-10-31. Status: **PREPARED; waiting for lead's final QA/documentation GO**. No branch, index, commit, remote ref, donor source, process or save modified during preparation. Lead additionally authorized privacy cleanup of source-path metadata in plan reports.

## Verified baseline

- Canonical `main` HEAD: `11b36a004685d241d74e6017b15b56249a033080`.
- Observed `origin/main`: `5ff03c241a35bfe4137bc8fd5bebd43079450648`, a descendant of canonical HEAD. Refresh remote immediately before publication.
- Remote adds Bảo's design documents/diagrams, Room 2 implementation and Quang rename through merged PRs #1/#2. No matching open issue was returned by the repository issue listing.
- Canonical working tree contains the authorized replacement campaign and legacy module/map retirement; no staged paths at preparation time. Other workers are actively completing documentation and actual-route QA.
- Existing tracked `docs/game-story-v2.pdf` and `docs/game-story.docx` remain unchanged. No new PDF, DOCX, dotenv, key, credential file or private source text appeared among publishable untracked paths. New `.txt` files are font licenses.
- Targeted credential assignment/token/private-key/connection-string scan of candidate textual project content found no matches. Repeat on exact staged additions before committing; this is not a claim about ignored private files.
- Read-only SHA-256 checks against all eight protected donor source files match `src/room-two/bao/provenance.json`. Protected checkout remains untouched.

## Publication strategy for lead review

1. Wait for final browser acceptance and documentation reconciliation, then freeze edits and recheck the exact candidate manifest. Exclude ignored `tmp`, `dist`, dependencies, personal PDF4/text sources, dotenv and credentials. Stage only agreed artifact groups.
2. Create a descriptive feature branch from canonical HEAD. Commit replacement game/assets/config/tests as one cohesive feature; commit reviewed documentation/evidence separately where useful. Use conventional commit subjects, no artificial intelligence references.
3. Merge refreshed `origin/main` normally into the feature branch. Resolve only understood conflicts: retain intentional legacy-module/map removals and current campaign entry/README; preserve Bảo's remote-only design documents/SVGs, Quang portrait rename and shared character-animation rename. Existing added synth voices match the remote addition already.
4. Do not use an `ours` strategy: that would hide lost remote-only files. Do not force push, reset, stash, clean, edit the protected donor, or merge feature into `main` without verified scope.
5. After conflict resolution, rerun meaningful full tests/build and inspect final diff against `origin/main`. Verify remote ancestry, eight-source provenance, retired runtime absence and unchanged historical PDF/DOCX blobs.
6. Push the feature branch; create a reviewable PR against `main`, using the remote comparison and final QA evidence. Publishing source is separate from hosting. Existing collaborator invitation must not be repeated.

## Publication concerns

- Privacy cleanup completed under lead authorization: replaced absolute user-home prefixes in plan/report metadata with `<USER_HOME>` and replaced the personal PDF4 path/filename with a generic supplied-source description. No absolute user-home path, personal download path or email address remains in Markdown under `plans/`. Source hashes/content and relative links remain unchanged; no personal source file was added.
- Older journals/plan reports describe superseded scopes and no-push decisions. Preserve their dated provenance; current README/architecture/roadmap must clearly describe the accepted completed campaign.
- Final staged audit, final remote refresh, conflict resolution, integration tests, commit hashes, branch URL and PR URL remain pending. Preparation does not claim publication or whole-campaign browser acceptance.

Status: DONE_WITH_CONCERNS
Summary: Read-only publication audit and ancestry-preserving feature/PR strategy prepared; waiting for lead GO.
Concerns/Blockers: Final browser QA/documentation and reviewed stage manifest pending; source-path privacy concern resolved.

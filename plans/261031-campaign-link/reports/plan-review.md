# Campaign integration plan review

Date: 2026-10-31. Verdict: **GO for implementation**. No blocking contract inconsistency found.

Scope: reviewed `plan.md`, `lifecycle-scout.md` and `bao-adapter-scout.md`; inspected no new product implementation. Only this report written. Other contributors' files unchanged. This approves the implementation approach, not unimplemented behavior or eventual release.

## Why the contracts fit

- Existing `(root)` constructors and private standalone saves remain compatible. Explicit injected storage, including null, maps ordinary room save calls to the campaign envelope; session class imports avoid standalone main side effects. New `room-one.html` preserves the original standalone entry while index owns the campaign.
- Parent runtime has one session/Game at a time, asynchronous idempotent destroy, pre-Phaser scene cleanup, disposed callback guards and import/transition epochs. These address the concrete installed-Phaser DESTROY versus SHUTDOWN finding. Lifecycle ownership is clear: shared helper/scene/UI belong to the lifecycle worker; root owns campaign transitions and shared audio; room workers consume the shared contract.
- Shared audio is a deliberate extension of the scout's minimal per-room proposal. The plan supplies the necessary ownership rule: parent owns shared controller/status callback, children neither close it nor claim permission from saved preference. Parent pause is included in scene and audio state, which permits a global journal without leaving the active room running.
- Room 2 uses the actual donor renderers, evaluators, texts and map with restricted exports and deep donor comparisons. It avoids old applyAction/save validation, museum/Him Lam fabrication and external-tab progress shortcuts. Final fold awards II; eastern door interaction advances to canonical Room 3. This matches donor semantics without changing its protected checkout.
- Fragment sources remain distinct: I from opened chest, II from valid final fold, III/IV from actual pickup. Campaign stage derives from contiguous validated exits, so owning a fragment does not skip its door or create a later room.
- Room 5 requires all four owned fragments and previous exits, then ordered assembly → authored conversation/reflection → deliberate continue → physical exit → museum return → ending acknowledgment. Optional personal text is outside intents/save and has no correctness grade. The plan does not replace reflection with an ideological answer or mark the campaign finished after Room 4.

## Implementation acceptance notes

These are concrete checks under the existing plan, not requests to expand scope or obtain user approval:

1. Treat envelope settings as authoritative when creating every room adapter and when merging writes. A room's default/restored flat audio fields must not overwrite current shared settings during a later room's first save. If fragment/current-room cache fields are serialized, recompute them from sanitized room snapshots rather than trusting their stored values.
2. Room 2 `fragmentCollected` must be a derived consequence of the validated four-puzzle prefix and required clues. A stored true flag cannot substitute for completed fold. Preserve original outro text and early-close semantics; do not silently add outro completion as a new door prerequisite. UI/live callbacks still require the active narrative/puzzle context.
3. Room 5 local sanitization checks assembly/reflection/exit prefix; campaign sanitization independently checks predecessor exits and owned fragments before accepting any Room 5 snapshot, returned or endingSeen. Neither the `fragments` constructor option nor boolean return/ending flags can mint missing prior progress.
4. A room reset retains earlier validated rooms and clears current-derived fragment plus all downstream snapshots/return/ending flags. Global restart clears only the campaign envelope and invalidates pending import/destroy transitions; it must leave standalone and donor keys untouched.
5. Bảo's donor was dirty with authorized font fixes when scouted. Preserve that working tree and 4180 process. Copy current source assets, make import-only renderer adaptations, and compare the extracted registries against that current donor. Route rewriting applies in the new adapter only.
6. Await Game DESTROY completion before mounting a fresh session; create no successor synchronously inside an exit commit/storage callback or DESTROY event callback. Shared AudioController remains alive across room disposal and is closed only by its parent owner. New Room 2 document listeners, global live-region hooks and final-room listeners require the same disposal coverage.
7. Full browser acceptance must exercise the real final route and first transition timing, not only reducer fixtures: final fold/outro/door, III/IV pickup versus chest-open, blank optional reflection, required authored continue, door and ending acknowledgment. Read-only diagnostics remain read-only.

## Small editorial clarification

`plan.md` says “SourcePDF5 question” in the final-room paragraph while its stated historical source is supplied PDF4. Interpret this as the **Room 5 question from the supplied PDF4**, not a new fifth PDF. Spell that out when assigning the final-room content work; no source search or user decision is needed.

Unresolved questions: None blocking implementation.

Status: DONE
Summary: GO. The plan defines compatible donor, state, lifecycle and final-reflection boundaries; enforce the listed acceptance checks during implementation/review.
Concerns/Blockers: None.

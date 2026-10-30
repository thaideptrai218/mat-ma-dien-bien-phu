---
title: "PDF 4 canonical rebuild preserving Bao Room 2"
description: "Current milestone: standalone playable Room 1; remaining PDF 4 campaign planned separately."
status: pending
priority: P2
branch: "main"
tags: [frontend, game, pdf-four]
blockedBy: []
blocks: []
created: "2026-10-30T10:18:07.604Z"
createdBy: "ck:plan"
source: skill
---

# PDF 4 canonical rebuild preserving Bao Room 2

## Overview

**Current milestone: standalone Room 1 complete and verified.** User supplied `lich su.txt` and authorized the early-1953 comparison design. [Room 1 QA](reports/room-one-qa.md) records24 passing tests, fresh single-entry build, actual full keyboard journey, paper/mobile/input/audio/save checks and independent review. Follow [Room 1 implementation phase](phase-room-one-playable.md); this milestone overrides earlier waiting clauses. No internet research, commit/push or deployment. Whole-campaign status remains pending for later rooms/integration.

Canonical `/` becomes a new standalone Room 1 in `src/room-one/`: early 1953 → compare Vietnamese/French positions → introduce Nava. Complete the first picture-fragment challenge, then show an explicit link to preserved Bảo on port 4180. Do not claim or simulate completion of Rooms 3–5, implement the two-step Nava plan here, or transfer/start Bảo save automatically. All old primary active maps/routes retire after the replacement is ready and verified; separate Bảo checkout, its Room 2, font fix and preview remain untouched.

Later whole-campaign target remains pending: Quang, museum painting, four historical challenges, four picture fragments, fifth assembly/reflection room, return to museum. Preserve actual Bảo `navarre-plan` map, seven clues, four puzzles and stories when later integrating that campaign; separate Bảo checkout and font fix untouched.

Sources and contracts: [PDF audit](reports/pdf-requirements.md), [code scout](reports/code-scout.md), [technical review](reports/plan-review.md). Earlier completed plans remain historical records; this plan replaces their active campaign/route decisions after implementation, with no unfinished cross-plan dependency.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Preserve and define contracts](./phase-01-preserve-and-define-contracts.md) | Pending |
| 2 | [Rebuild content world and interface](./phase-02-rebuild-content-world-and-interface.md) | Pending |
| 3 | [Integrate verify and document](./phase-03-integrate-verify-and-document.md) | Pending |

## Dependencies

- Current Room 1 requirements/source supplied; implementation may proceed under its phase/review. Later rooms require their remaining content decisions. No newly researched historical material enters product content.
- Primary project only; Bảo checkout is a read-only donor for protected Room 2 and compatible engine/font assets.
- Phaser/Vite/local assets and existing scripts remain; no Git push, deployment, or PDF upload.

## Whole-campaign acceptance — later milestone

- One active campaign: `museum → foundation → navarre-plan → preparation → victory → peace → ending`.
- Five room completion flags; exactly four fragment rooms and four visible fragments. Assembly precedes reflection; completing `peace-outro` precedes ending entry.
- Bảo Room 2 data/evaluation behavior and Vietnamese font barrier preserved and compared against donor.
- Unique rebuilt layouts for every other room; all required interactions/checkpoints reachable; walking, animation, camera, audio, Shift/M/N/Q work with modal/focus safeguards.
- Paper documents separate from Quang's deductions; only final-line confirmation collects a clue; protected Bảo dossier wording stays verbatim.
- New PDF campaign save key; forged progress, predecessor bypass, late narrative callback and premature ending rejected.
- Retired main maps, chapter-four entry/tree and executable wireframe absent only after replacement is complete and verified; fresh build contains one game entry.
- Focused rules/save/font/reachability tests, complete real browser journey, offline fonts and current documentation pass before delivery.

## Pending later content

Current Room 1 replaces the unspecified campaign-card sequence with the user-approved comparison chain; `2413`, A1Z26 `HENRINAVARRE` and chest `NAVA` are accepted game mechanics, not claimed as exact historical evidence. Room 3 complete material/evidence and later full-campaign transitions remain pending. Earlier phase documents describe the longer target, not authorization to implement later rooms in this milestone.

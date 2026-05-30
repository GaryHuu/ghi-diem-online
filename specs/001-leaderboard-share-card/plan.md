# Implementation Plan: Leaderboard Share Card

**Branch**: `001-leaderboard-share-card` | **Date**: 2026-05-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-leaderboard-share-card/spec.md`

## Summary

Add a Share action to the end-of-match result / leaderboard view. Tapping it opens a dialog that renders the full match standings (rank, avatar, name, score for every player) plus the match's creation date/time as a polaroid-style card (slight rotation, theme-aware). The user downloads the card as a PNG. The card image is produced entirely client-side with the native HTML Canvas API (no new dependency), and the exact image that downloads is shown in the preview so there is one source of truth.

## Technical Context

**Language/Version**: TypeScript 5.5, React 18

**Primary Dependencies**: Existing only — `@mui/material` + `@emotion`, `react-i18next`, `dayjs`, Redux Toolkit. Rendering uses the browser-native `HTMLCanvasElement` 2D API (no library added).

**Storage**: None new. Reads existing match data from Redux (`state.match.matchDetail`), which is backed by `localStorage`. The share card is transient and never persisted.

**Testing**: Manual verification via `npm run build` + `npm run lint`; no automated test framework exists in the repo.

**Target Platform**: Mobile-first web SPA (Vite), runs fully offline.

**Project Type**: Single-project client-only React SPA (frontend in `src/`).

**Performance Goals**: Card generation + PNG ready within 3s on a typical mobile device (SC-002); in practice canvas draw of < ~20 rows is sub-100ms plus async avatar image decode.

**Constraints**: Must work offline (FR-011); no new runtime dependency (Constitution II); avatars are Base64 data URLs (same-origin, so `canvas.toBlob` is not tainted).

**Scale/Scope**: One new feature folder (`ShareCard`), a small edit to `LeaderBoard.tsx` header, and i18n keys. Player counts range 1..N (typical card-game sizes).

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                       | Status | Notes                                                                                                                                                                                                                              |
| ------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Pattern Conformity           | PASS   | New unit is `ShareCard/` with `ShareCard.tsx` (thin view), `useShareCard.ts` (logic), `styles.ts`, `index.ts` barrel. `@/` alias imports. Logic-in-hook split preserved.                                                           |
| II. No New Dependencies         | PASS   | PNG is generated with the native Canvas 2D API. No `html2canvas`/`html-to-image` or any other package added.                                                                                                                       |
| III. Established Styling System | PASS   | Dialog/buttons use MUI `sx` + co-located `styles.ts` theme-aware functions. The polaroid frame is drawn on canvas; its colors are read from the live MUI theme (`useTheme()`), so dark mode stays coherent. No new styling system. |
| IV. Layered State & Data Flow   | PASS   | Reads from Redux via the existing `usePlaying` hook; no business-rule logic added. PNG generation + open/close are transient UI state, kept in the component hook (not Redux). No service/DB change.                               |
| V. Spec/Plan Separation         | PASS   | `spec.md` stays tech-agnostic; all component/canvas/library detail lives here.                                                                                                                                                     |

**Result**: All gates PASS. No Complexity Tracking entries required.

## Project Structure

### Documentation (this feature)

```text
specs/001-leaderboard-share-card/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── ui-contract.md   # Phase 1 output (UI behavior contract)
└── checklists/
    └── requirements.md  # From /speckit-specify
```

### Source Code (repository root)

```text
src/
├── pages/PlayingPage/components/
│   ├── LeaderBoard/
│   │   └── LeaderBoard.tsx        # EDIT: add Share IconButton to the dialog header
│   └── ShareCard/                 # NEW feature folder
│       ├── ShareCard.tsx          # thin view: Dialog + <img> preview + Download/Close
│       ├── useShareCard.ts        # logic: draw canvas → dataURL, download PNG, open/close
│       ├── styles.ts              # MUI sx style objects (theme-aware)
│       └── index.ts               # barrel export
└── i18n/locales/
    ├── vi.json                    # EDIT: add components.shareCard.* (active language)
    └── en.json                    # EDIT: mirror keys to keep files structurally identical
```

**Structure Decision**: Single-project React SPA. The feature is a self-contained component folder under `PlayingPage/components/` (sibling to `LeaderBoard`, `TopOne`, `Transactions`), matching the established feature-folder + barrel + logic-in-hook conventions. Only `LeaderBoard.tsx` (entry point) and the two locale files are touched outside the new folder.

## Complexity Tracking

> No Constitution Check violations. Section intentionally empty.

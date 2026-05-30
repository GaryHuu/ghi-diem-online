---
description: 'Task list for Leaderboard Share Card implementation'
---

# Tasks: Leaderboard Share Card

**Input**: Design documents from `/specs/001-leaderboard-share-card/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md, quickstart.md

**Tests**: No automated test framework exists in this repo and the spec did not request TDD. No test tasks are generated; verification is via `npm run build` + `npm run lint` + manual quickstart flow.

**Organization**: Tasks are grouped by user story. US1 (P1) is the MVP. US2 (P2) is an incremental enhancement.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 / US2 (maps to spec.md user stories)
- Exact file paths are included in each task.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the feature folder skeleton and i18n keys all later work depends on.

- [ ] T001 [P] Create the `ShareCard` feature folder with placeholder barrel and empty style/hook/view files: `src/pages/PlayingPage/components/ShareCard/index.ts`, `ShareCard.tsx`, `useShareCard.ts`, `styles.ts` (match sibling folder conventions, e.g. `TopOne/`).
- [ ] T002 [P] Add a `components.shareCard` block with keys `title`, `shareAction`, `download` to `src/i18n/locales/vi.json` (Vietnamese, active language).
- [ ] T003 [P] Mirror the identical `components.shareCard` keys (English values) in `src/i18n/locales/en.json` to keep both locale files structurally identical.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the canvas rendering engine and styles that BOTH user stories consume.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T004 Implement the card view-model builder and offscreen-canvas renderer in `src/pages/PlayingPage/components/ShareCard/useShareCard.ts`: read `leaderBoardPlayers` + `match.data.id` from `usePlaying`, read colors from `useTheme()`, format scores with `useFormatCurrency`, format date `dayjs(match.data.id).format('HH:mm DD/MM/YYYY')`; build `ShareCardModel` (title, dateText, rows) per `data-model.md`; draw a polaroid frame with a slight rotation (FR-005), one row per player (rank badge, avatar or `stringToColor`+`getShortName` placeholder, name with truncation, score), theme-aware colors (FR-006). Expose `{ dataUrl, isReady }`.
- [ ] T005 [P] Add theme-aware MUI style objects in `src/pages/PlayingPage/components/ShareCard/styles.ts` (dialog header layout, preview `<img>` sizing/centering, action buttons) following the co-located `styles.ts` `SxProps`/`(theme)=>{}` pattern.

**Checkpoint**: The hook can produce a card data URL from current standings; styles ready.

---

## Phase 3: User Story 1 - Download a polaroid standings card (Priority: P1) 🎯 MVP

**Goal**: From the leaderboard, tap Share → see the polaroid card → download it as a PNG.

**Independent Test**: Open a finished match's leaderboard, tap Share, confirm the card shows all players (rank, avatar/placeholder, name, score) + match date/time with polaroid rotation, tap Download, confirm a PNG saves matching the preview.

### Implementation for User Story 1

- [ ] T006 [US1] Implement the PNG download in `src/pages/PlayingPage/components/ShareCard/useShareCard.ts`: `canvas.toBlob` → temporary `<a download>` + `URL.createObjectURL`, filename `bang-xep-hang-YYYYMMDD-HHmm.png` (FR-012); wrap in try/catch surfacing a localized `toast.error(translateError(...))` on failure (FR-010). Expose `download()`. (depends on T004)
- [ ] T007 [US1] Build the `ShareCard.tsx` view in `src/pages/PlayingPage/components/ShareCard/ShareCard.tsx`: shared `Dialog` (`isOpen`/`onClose`), title `t('components.shareCard.title')`, preview `<img src={dataUrl}>`, Download button `t('components.shareCard.download')` calling `download()`, Close button `t('common.buttons.cancel')`; wire to `useShareCard` and `styles.ts`. (depends on T005, T006)
- [ ] T008 [US1] Export `ShareCard` from the barrel `src/pages/PlayingPage/components/ShareCard/index.ts`. (depends on T007)
- [ ] T009 [US1] Add a Share `IconButton` (`t('components.shareCard.shareAction')`) to the leaderboard dialog header in `src/pages/PlayingPage/components/LeaderBoard/LeaderBoard.tsx`, manage open state with `useBoolean`, and render `<ShareCard isOpen onClose />`. (depends on T008)

**Checkpoint**: MVP complete — Share generates and downloads the standings PNG.

---

## Phase 4: User Story 2 - Preview before downloading (Priority: P2)

**Goal**: The user sees a faithful preview with clear loading/ready states and can dismiss without downloading.

**Independent Test**: Tap Share → preview appears (loading then ready), Download disabled until ready; tap Close → no file downloads, returns to leaderboard.

### Implementation for User Story 2

- [ ] T010 [US2] Add loading/ready handling in `src/pages/PlayingPage/components/ShareCard/ShareCard.tsx` (and `useShareCard.ts` if needed): show a loading indicator in the preview area while `isReady` is false and disable the Download button until the image is ready. (depends on T007)
- [ ] T011 [US2] Guarantee dismiss safety in `src/pages/PlayingPage/components/ShareCard/ShareCard.tsx`: Close/`onClose` closes the dialog with no download; confirm opening is idempotent so rapid repeated Share taps cannot stack dialogs/downloads (edge case). (depends on T007)

**Checkpoint**: Preview UX complete; US1 still works independently.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Edge-case verification and gate checks before commit.

- [ ] T012 [P] Manually verify edge cases per `quickstart.md`: player without avatar shows initials placeholder; long name truncates without breaking layout; single-player match still renders with date; negative and zero scores show correct sign/format.
- [ ] T013 [P] Verify dark mode: card colors follow the theme in both light and dark (FR-006).
- [ ] T014 Run `npm run lint` and `npm run format`; fix any issues in the new/edited files.
- [ ] T015 Run `npm run build` to confirm the production build passes, then complete the `quickstart.md` manual verification flow end to end.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup (needs the folder files). BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational. The MVP.
- **User Story 2 (Phase 4)**: Depends on US1's view (`ShareCard.tsx`, T007) since it builds on the same dialog.
- **Polish (Phase 5)**: Depends on the user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Independent once Foundational is done. Delivers standalone value.
- **US2 (P2)**: Enhances the US1 dialog; not independently shippable without US1 in this design (single-dialog source of truth), but independently testable.

### Within Each Story

- US1: download fn (T006) → view (T007) → barrel (T008) → leaderboard wiring (T009).
- US2: both tasks depend on the US1 view (T007).

### Parallel Opportunities

- Setup: T001, T002, T003 all `[P]` (different files).
- Foundational: T005 `[P]` with T004 (different files; T004 = hook, T005 = styles).
- Polish: T012, T013 `[P]` (manual checks).
- T006–T009 are sequential (chained dependencies / shared files).

---

## Parallel Example: Setup

```bash
# Launch setup tasks together (different files):
Task: "Create ShareCard folder skeleton files"            # T001
Task: "Add components.shareCard keys to vi.json"          # T002
Task: "Mirror components.shareCard keys in en.json"       # T003
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup (folder + i18n).
2. Phase 2: Foundational (canvas renderer + styles) — CRITICAL, blocks stories.
3. Phase 3: User Story 1 (preview + download).
4. **STOP and VALIDATE**: tap Share → download a correct PNG.
5. Demo if ready.

### Incremental Delivery

1. Setup + Foundational → engine ready.
2. US1 → test → MVP shippable.
3. US2 → loading/dismiss polish → test.
4. Polish phase → edge cases + lint/build gates.

---

## Notes

- [P] = different files, no dependency on incomplete tasks.
- No new runtime dependency is added at any step (Constitution II); PNG via native Canvas API.
- All display text via `t(...)`; `vi.json` and `en.json` kept structurally identical.
- Commit after logical groups; `npm run lint` + `npm run format` must pass (pre-commit gate).

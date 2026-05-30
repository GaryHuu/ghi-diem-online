# Phase 0 Research: Leaderboard Share Card

## R1. How to produce a downloadable PNG without a new dependency

**Decision**: Render the card onto an offscreen `<canvas>` using the native Canvas 2D API, then export with `canvas.toBlob(blob => ...)` and trigger a download via a temporary `<a download>` + `URL.createObjectURL`.

**Rationale**:

- Constitution Principle II prohibits new runtime dependencies. The usual DOM-to-image libraries (`html2canvas`, `html-to-image`, `dom-to-image`) are therefore disallowed.
- The Canvas 2D API is browser-native, works fully offline (FR-011), and gives exact pixel control for the polaroid look.
- A standings card is a simple, mostly-vertical layout (a title, a date, and N rows of avatar + rank + name + score) — well within what manual canvas drawing handles cleanly.

**Alternatives considered**:

- `html2canvas` / `html-to-image`: rejected — adds a dependency, violates Constitution II, and pulls in significant bundle weight for a single feature.
- SVG → `data:` URL → draw to canvas: rejected — extra serialization step and foreignObject font quirks across browsers; no benefit over drawing directly.

## R2. Avatars on the canvas (Base64 + placeholder)

**Decision**: For each player, if `avatar` (a Base64 data URL) exists, load it via `new Image()` and `await` its `decode()`/`onload`, then draw it clipped to a circle. If absent, draw a filled circle using `helpers.stringToColor(name)` with the initials from `helpers.getShortName(name)` — mirroring the existing MUI `<Avatar>` fallback in `LeaderBoard`/`TopOne`.

**Rationale**:

- FR-013 requires avatars with a placeholder; reusing `stringToColor` + `getShortName` keeps the card visually consistent with the on-screen leaderboard.
- Base64 data URLs are same-origin, so the canvas is **not** tainted and `toBlob` succeeds.
- A failed image load falls back to the initials placeholder so a broken avatar never blocks generation (FR-010, FR-013, edge case).

**Alternatives considered**:

- Skipping avatars to avoid async image loading: rejected by clarification (avatars = included).

## R3. Theme-aware colors / dark mode

**Decision**: Read colors from the live MUI theme via `useTheme()` in the hook and pass them into the draw routine (background, polaroid frame paper color, primary accent for the rank badge, text colors). No hardcoded hex.

**Rationale**: Constitution III requires theme/dark-mode coherence and forbids hardcoding colors the theme provides. Drawing with `theme.palette.*` keeps the card matching the app's current light/dark mode (FR-006).

**Alternatives considered**: Fixed polaroid white regardless of theme — rejected; a pure-white card clashes in dark mode and the spec requires consistency with the app's visual style.

## R4. Match date/time source and formatting

**Decision**: Use the match's creation timestamp, which is the timestamp-based match id (`match.data.id`, a `dayjs().valueOf()`). Format with `dayjs(match.data.id).format('HH:mm DD/MM/YYYY')`.

**Rationale**: Clarification fixed the date as the match creation timestamp. The id already encodes it (per the existing timestamp-id convention, Constitution Technology Constraints), so no new field or migration is needed (FR-004). `dayjs` is already a dependency.

**Alternatives considered**: A separate `createdAt` field — rejected; redundant with the timestamp id and would require a migration.

## R5. Entry point and preview

**Decision**: Add a Share `IconButton` to the existing `LeaderBoard` dialog header (the result view), alongside the existing back and payment-chart buttons. It opens a `ShareCard` dialog (built on the shared `Dialog` wrapper) showing the generated PNG as an `<img>` with a Download action and a Close action.

**Rationale**:

- Clarification fixed availability to the result/leaderboard view only.
- Showing the canvas output (its data URL) as the preview image guarantees the preview equals the downloaded file (FR / User Story 2), with a single source of truth (the canvas), avoiding a duplicate DOM layout.
- Reuses `Dialog`, `useBoolean`, `useFormatCurrency`, `usePlaying` — Constitution I/II "reach for existing utilities first."

**Alternatives considered**:

- Persistent share button during play: rejected by clarification.
- Separate DOM polaroid for preview + canvas for download: rejected — two layouts to keep in sync; drift risk.

## R6. Number / currency formatting and edge values

**Decision**: Format scores with the existing `useFormatCurrency().formatCurrency`, identical to the leaderboard, so unit/locale/sign handling (negative, zero) is consistent (FR-008). Pass the formatted strings into the draw routine.

**Rationale**: Single formatting source already used by `LeaderBoard`/`TopOne`; honors Constitution I/II.

## R7. Localization

**Decision**: Add a `components.shareCard` block to `vi.json` (active) and mirror it in `en.json` (kept structurally identical even though English is currently disabled). All card/dialog text via `t('...')`.

**Rationale**: Constitution Technology Constraints require all display text through i18n; prior project practice keeps `en.json` and `vi.json` structurally identical.

## R8. Robustness (rapid taps, generation failure)

**Decision**: Generate the image when the dialog opens (effect keyed on open + standings). Guard the download with a try/catch that surfaces a localized `toast.error` on failure (FR-010) and leaves the leaderboard usable. Opening the dialog is idempotent (boolean state), so repeated taps cannot stack downloads.

**Rationale**: Matches existing error-handling pattern (`toast.error(translateError(...))`) and the edge cases in the spec.

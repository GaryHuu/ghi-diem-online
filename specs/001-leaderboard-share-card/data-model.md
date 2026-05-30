# Phase 1 Data Model: Leaderboard Share Card

No persisted data is added. The feature is read-only over existing match state and builds transient, in-memory view models. No `localStorage` schema change, so no migration is required (Constitution Technology Constraints).

## Existing inputs (read-only)

### Match (Redux: `state.match.matchDetail.data`)

| Field     | Type       | Use in feature                                                                           |
| --------- | ---------- | ---------------------------------------------------------------------------------------- |
| `id`      | `number`   | Match creation timestamp (`dayjs().valueOf()`). Source of the card's date/time (FR-004). |
| `name`    | `string`   | Optional context; not required on the card.                                              |
| `players` | `Player[]` | Source of standings rows.                                                                |

### PlayerLeaderBoard (already derived by `usePlaying.leaderBoardPlayers`)

Computed as total score per player, sorted descending. Reused as-is.
| Field | Type | Notes |
|-------|------|-------|
| `id` | `number` | React key. |
| `name` | `string` | Displayed on the row; basis for placeholder color/initials. |
| `score` | `number` | Total across games; formatted via `useFormatCurrency`. |
| `avatar?` | `string` | Base64 data URL; placeholder used when absent. |

## Transient view models (in-memory only)

### ShareCardRow

Derived per standings entry for drawing. Not stored.
| Field | Type | Derivation |
|-------|------|------------|
| `rank` | `number` | 1-based index in the sorted `leaderBoardPlayers`. |
| `name` | `string` | From `PlayerLeaderBoard.name`. |
| `scoreText` | `string` | `formatCurrency(score)` — same formatting as the leaderboard (FR-008). |
| `avatar?` | `string` | From `PlayerLeaderBoard.avatar`. |
| `placeholderColor` | `string` | `helpers.stringToColor(name)` when no avatar. |
| `initials` | `string` | `helpers.getShortName(name)` when no avatar. |

### ShareCardModel

The complete card description passed to the canvas draw routine.
| Field | Type | Derivation |
|-------|------|------------|
| `title` | `string` | `t('pages.playing.leaderboard')` ("Bảng xếp hạng"). |
| `dateText` | `string` | `dayjs(match.data.id).format('HH:mm DD/MM/YYYY')`. |
| `rows` | `ShareCardRow[]` | Mapped from `leaderBoardPlayers`. |
| theme colors | `{ background, paper, accent, contrast, text, subtext }` | From `useTheme().palette`. |

## Output artifact (transient)

- An `HTMLCanvasElement` rendered in memory → `toDataURL()` for preview and `toBlob()` for download.
- A PNG `Blob` downloaded as a file named e.g. `bang-xep-hang-YYYYMMDD-HHmm.png` (FR-012). The file is never written to app storage; it goes to the user's device download target.

## Validation rules

- Standings ordering MUST equal `leaderBoardPlayers` order (FR-003); no re-sorting in the feature.
- Empty/absent avatar → placeholder; never blocks generation (FR-013).
- Single player → one row still rendered with date (edge case).

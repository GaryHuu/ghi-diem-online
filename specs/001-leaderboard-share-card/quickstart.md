# Quickstart: Leaderboard Share Card

## What this feature adds

A Share button on the end-of-match leaderboard that generates a polaroid-style PNG of the full standings (rank, avatar, name, score + match date/time) and lets the user download it. Pure client-side, offline, no new dependencies.

## Run locally

```bash
cd ghi-diem-online
npm install            # if not already
npm run dev            # start Vite dev server
```

## Manual verification flow

1. Create a match with 2+ players and enter scores so totals are non-trivial (include a negative total to check sign handling).
2. End the match → the leaderboard result view opens.
3. Tap the **Share** icon in the leaderboard header.
4. Confirm the Share Card dialog opens and shows a polaroid-style card (slightly rotated) listing every player with rank, avatar (or initials placeholder), name, and score, plus the match date/time (`HH:mm DD/MM/YYYY`).
5. Tap **Download** → a PNG saves to the device. Open it and confirm it matches the preview exactly.
6. Toggle dark mode (Settings) and repeat steps 3-5 → card colors follow the theme.
7. Edge checks: a player with no avatar shows initials; a long name is truncated, not overflowing; a single-player match still renders with the date.

## Verify build/lint before commit

```bash
npm run build
npm run lint
```

## Key files

- `src/pages/PlayingPage/components/ShareCard/` — new feature folder (view + hook + styles + barrel)
- `src/pages/PlayingPage/components/LeaderBoard/LeaderBoard.tsx` — share button entry point
- `src/i18n/locales/vi.json`, `en.json` — `components.shareCard.*` keys

## Notes

- The card image is drawn with the native Canvas 2D API; the preview `<img>` and the downloaded PNG come from the same canvas (one source of truth).
- The date is derived from the match's timestamp id (`match.data.id`); no new stored field.

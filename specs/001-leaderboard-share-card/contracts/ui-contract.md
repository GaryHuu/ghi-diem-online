# UI Contract: Leaderboard Share Card

This is a client-only SPA; the relevant contract is the UI behavior surface, not a network API.

## Entry point: Share action (LeaderBoard dialog header)

- **Location**: Inside the existing `LeaderBoard` full-screen result dialog header, alongside the back button and the payment-chart button. Visible only when the result/leaderboard view is open (FR-001; clarification: result view only).
- **Affordance**: An `IconButton` (share icon) with an accessible/localized label `t('components.shareCard.shareAction')`.
- **Behavior**: On tap → opens the Share Card dialog. Idempotent (boolean open state); repeated taps do not stack dialogs or downloads.

## Share Card dialog

| Element              | Contract                                                                                                                                                                                 |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Container            | Built on the shared `Dialog` wrapper (`isOpen`, `onClose`).                                                                                                                              |
| Title                | `t('components.shareCard.title')`.                                                                                                                                                       |
| Preview              | An `<img>` whose `src` is the generated card's data URL. It MUST be the exact image that downloads. Shown with the polaroid look (rotation is baked into the rendered image per FR-005). |
| Download action      | Button labeled `t('components.shareCard.download')`. On tap → saves the PNG to the device.                                                                                               |
| Close/dismiss action | Button labeled `t('common.buttons.cancel')` (or a close icon) → closes dialog, downloads nothing (User Story 2).                                                                         |
| Loading state        | While the image is being generated, the preview area shows a loading indicator; the Download action is disabled until ready.                                                             |
| Error state          | If generation or download fails → localized `toast.error`; dialog/leaderboard remain usable (FR-010).                                                                                    |

## Generated card (PNG) content contract

The rendered card MUST contain:

1. A title (the leaderboard heading).
2. The match creation date/time, formatted `HH:mm DD/MM/YYYY` (FR-004).
3. One row per player, in `leaderBoardPlayers` (descending-score) order (FR-003), each with:
   - rank number,
   - avatar image or initials placeholder (FR-013),
   - player name (truncated if it would overflow the card width — edge case),
   - formatted score using the app's currency/unit formatting, correct sign for negative/zero (FR-008).
4. A polaroid presentation: a card/frame drawn with a slight rotation (FR-005), themed to match light/dark mode (FR-006).

## Download contract

- Output format: PNG (FR-007).
- File name: recognizable, includes a standings reference and date, e.g. `bang-xep-hang-YYYYMMDD-HHmm.png` (FR-012).
- Works offline; no network calls (FR-011).

## Non-goals (out of contract)

- No direct posting to any social network / no platform share API (clarification: download PNG only).
- No persistence of the generated image.
- No share entry point during active play.

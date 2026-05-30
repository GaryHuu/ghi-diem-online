# Feature Specification: Leaderboard Share Card

**Feature Branch**: `001-leaderboard-share-card`

**Created**: 2026-05-30

**Status**: Draft

**Input**: User description: "Add a Share to social media feature to the existing leaderboard. When a user taps share, generate a nicely designed share card showing their rank, score, and the date/time, with a slight rotation for a polaroid-style look. Let the user download it as a PNG."

## Clarifications

### Session 2026-05-30

- Q: Which date/time should the share card display? → A: The match's creation timestamp (when the match was started).
- Q: Where/when is the share action available? → A: Only on the end-of-match result / leaderboard view.
- Q: Should player avatars appear on the card? → A: Yes, include each player's avatar, with a placeholder when a player has none.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Download a polaroid standings card (Priority: P1)

A player finishes a match and wants to keep or post the final results. From the leaderboard, they tap a share action. The app generates a single, nicely designed card that lists the full ranked standings (every player with their rank and score) along with the match date and time, styled like a slightly rotated polaroid. The player downloads it as a PNG image to their device and can then post it to social media manually.

**Why this priority**: This is the entire feature. Without the ability to generate and download the standings card, there is nothing to deliver. It is independently valuable on its own.

**Independent Test**: Open a completed match's leaderboard, tap share, confirm a polaroid-style card with all players' ranks, scores, and the match date/time appears, and confirm a PNG file is saved to the device.

**Acceptance Scenarios**:

1. **Given** a match leaderboard with multiple players and final scores, **When** the user taps the share action, **Then** a polaroid-style card is generated showing each player's rank and score in ranked order plus the match date and time.
2. **Given** the share card has been generated, **When** the user confirms download, **Then** a PNG image of the card is saved to the user's device.
3. **Given** the generated card, **When** the user views it, **Then** the card is displayed with a slight rotation to evoke a polaroid look.

---

### User Story 2 - Preview before downloading (Priority: P2)

Before committing to a download, the player sees a preview of the card so they can confirm it looks right (correct players, scores, date) and then choose to download or dismiss.

**Why this priority**: Improves trust and reduces wasted downloads, but the core value (getting a PNG) is already delivered by P1. A direct-to-download flow would still be usable without this.

**Independent Test**: Tap share, confirm a preview of the card is shown with a download action and a way to dismiss, then dismiss without a file being saved.

**Acceptance Scenarios**:

1. **Given** the user tapped share, **When** the preview appears, **Then** it shows the card exactly as it will be downloaded, with a download action and a dismiss/close action.
2. **Given** the preview is open, **When** the user dismisses it, **Then** no file is downloaded and the user returns to the leaderboard.

---

### Edge Cases

- **Single player**: The card renders a one-row standings list and still includes the date/time.
- **Tied scores**: Players with equal scores are shown with a consistent, deterministic ordering and rank labels that match the on-screen leaderboard.
- **Long player names**: Names that exceed the card width are truncated (or wrapped) so the layout stays intact and the rank/score columns remain readable.
- **Many players**: A large roster still fits on a single card; the card grows or scales so all rows are visible and legible.
- **Negative / zero scores**: Negative scores (and zero) are displayed with correct sign and the same currency/unit formatting used elsewhere in the app.
- **Avatar absence**: Avatars are shown on the card; when a player has none, a placeholder is used. A missing image never blocks generation or download.
- **Generation failure**: If the card image cannot be generated, the user is shown a clear, localized error message and the leaderboard remains usable.
- **Rapid repeated taps**: Tapping share repeatedly does not produce duplicate downloads or broken cards.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The end-of-match result / leaderboard view MUST provide a clearly labeled share action that the user can tap to start generating a share card. The share action is available only on this view, not during active play.
- **FR-002**: When the share action is triggered, the system MUST generate a single share card representing the full ranked standings of the current match.
- **FR-003**: The share card MUST display, for every player, their rank and their score in ranked order, matching the ordering shown on the on-screen leaderboard.
- **FR-004**: The share card MUST display the match's creation date and time (the timestamp recorded when the match was started).
- **FR-005**: The share card MUST be styled with a slight rotation to produce a polaroid-style appearance.
- **FR-006**: The share card design MUST be visually polished and consistent with the app's existing visual style (including light/dark theme where applicable).
- **FR-007**: The user MUST be able to download the generated card as a PNG image file to their device.
- **FR-008**: Score values on the card MUST use the same number/currency/unit formatting the app uses elsewhere, including correct handling of negative and zero values.
- **FR-009**: All user-facing text on the card and in the share flow MUST be localized using the app's existing language (Vietnamese), consistent with the rest of the app.
- **FR-010**: If card generation or download fails, the system MUST display a clear, localized error message and leave the leaderboard in a usable state.
- **FR-011**: The share flow MUST function without any network connectivity, consistent with the app's offline, on-device nature.
- **FR-012**: The downloaded PNG file MUST have a recognizable, sensible file name (e.g., including a reference to the standings and date).
- **FR-013**: The share card MUST display each player's avatar next to their standings row, using a placeholder image when a player has no avatar. A missing avatar MUST NOT block card generation or download.

### Key Entities _(include if feature involves data)_

- **Share Card**: A generated visual artifact (not persisted) representing one match's standings. Composed from existing match data: the ranked list of players (rank, name, score) and the match date/time. Has presentation attributes (polaroid rotation, theme styling). Exists only transiently for preview and download.
- **Standings Entry**: One row of the card derived from an existing player record: rank position, player avatar (or placeholder), player name, and formatted score for the match.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: From the leaderboard, a user can generate and download a standings PNG in 3 taps or fewer.
- **SC-002**: Card generation completes and the PNG is ready to download within 3 seconds on a typical mobile device.
- **SC-003**: The downloaded PNG correctly reflects 100% of the players, ranks, scores, and the date/time shown on the leaderboard at the moment of sharing.
- **SC-004**: In informal testing, at least 90% of users correctly identify the card as shareable to social media and successfully save the image on their first attempt.
- **SC-005**: The downloaded image is legible (all names, ranks, and scores readable) for matches ranging from 1 to the app's maximum supported number of players.

## Assumptions

- "Share to social media" is delivered as a downloadable image that the user posts manually; no direct integration with any social network or platform API is in scope (per clarification: download PNG only).
- The card represents the full leaderboard standings (all players), not a single player's individual card (per clarification: full standings).
- The match date/time shown is the match's creation timestamp (existing match data, e.g. the timestamp-based match id); no new timestamp tracking is introduced (per clarification).
- The feature reuses the app's existing match/leaderboard data and existing score/currency formatting; no new persisted data is created.
- The feature targets the existing mobile-first web experience and works offline, consistent with the localStorage-based, client-only app.
- Language is Vietnamese only, consistent with the app's current i18n state.
- Player avatars are included in the card design, with a placeholder for players who have none (per clarification).

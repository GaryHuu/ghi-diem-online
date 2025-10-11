# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Ghi Điểm Online" (https://www.ghidiem.online/) - a Vietnamese score-tracking web application for multi-player card games. The app allows users to create matches, add players, track scores across multiple games, and view leaderboards. All data is persisted in browser localStorage.

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Redux Toolkit (@reduxjs/toolkit + react-redux)
- **UI Framework**: Material-UI (MUI) v5 with Emotion
- **Form Handling**: React Hook Form with Yup validation
- **Drag & Drop**: react-beautiful-dnd
- **Styling**: SASS modules + MUI styled components
- **Analytics**: Vercel Analytics

## Development Commands

```bash
npm run dev          # Start development server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run pre-commit   # Lint + format (used by Husky)
```

## Architecture Overview

### Data Layer

**localStorage-based Database**: The app uses a custom localStorage abstraction layer instead of a traditional backend:

- `src/db/match/index.ts` - Match and player CRUD operations
- `src/db/setting/index.ts` - User settings persistence
- `src/services/match/index.ts` - Business logic layer that validates operations before calling DB functions
- `src/services/setting/index.ts` - Settings service layer

**Key Constraint**: The score-tracking system enforces that the sum of all players' scores for each game must equal zero (zero-sum game rules). This validation occurs in `matchService.validateGameNumber`, `matchService.nextGame`, and `matchService.endGame`.

### State Management

Redux slices located in `src/redux/slices/`:

- `matchSlice.ts` - Manages current match state, including:
  - `matches[]` - List of all matches
  - `matchDetail` - Currently active match with `current` game number, `total` games, and match `data`
  - `isShowResult` - Controls result visibility
- `settingSlice.ts` - Manages user settings (unit and gap for scoring)

### Routing Structure

Three main routes defined in `src/routes/index.tsx`:

1. **HomePage** (`/`) - Landing page with match listing and creation
2. **CreatingPage** (`/creating`) - New match setup form
3. **PlayingPage** (`/match?id=<matchId>&gN=<gameNumber>`) - Active match scoring interface
   - Query params: `id` for match ID, `gN` for current game number
   - Main hook: `usePlaying` (src/pages/PlayingPage/hooks/usePlaying.ts) coordinates all match operations

### Component Architecture

- Components use TypeScript with explicit type imports from `@/utils/types`
- Barrel exports via `index.ts` files throughout the component tree
- Path alias `@/` maps to `src/` (configured in vite.config.js and tsconfig.json)
- MUI styled components are defined in separate `styles.ts` files
- SASS modules use `.module.scss` extension

### Key Data Flow Pattern

1. User action triggers handler in page-level hook (e.g., `usePlaying`)
2. Handler calls service layer (`matchService`) which validates business rules
3. Service calls database layer (`matchDB`) to persist to localStorage
4. Service returns updated data
5. Hook dispatches Redux action to update global state
6. Components re-render from Redux store via `useAppSelector`

## Data Migration

`src/migration.js` runs on app initialization (called in App.tsx) to migrate localStorage keys from older versions. This ensures backward compatibility with existing user data.

## Important Patterns

- **Error Handling**: Services throw errors with Vietnamese messages, caught in hooks and displayed via `react-toastify`
- **Player Management**: Players are identified by timestamp-based IDs (`dayjs().valueOf()`)
- **Score Tracking**: Each player has a `scores[]` array where index represents game number (0-indexed)
- **Drag & Drop**: Player order can be rearranged using react-beautiful-dnd in PlayingPage
- **Form Validation**: Uses Yup schemas (e.g., `src/pages/CreatingPage/utils/schemas.ts`)

## Testing Notes

- No test suite currently configured
- Manual testing should verify:
  - Zero-sum validation across all game numbers
  - localStorage persistence after page reload
  - Player name uniqueness within matches (case-insensitive)
  - Score input validation and auto-fill feature

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Ghi Điểm Online" (https://www.ghidiem.online/) - a Vietnamese score-tracking web application for multi-player card games. The app allows users to create matches, add players, track scores across multiple games, and view leaderboards. All data is persisted in browser localStorage.

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
- `settingSlice.ts` - Manages user settings (unit, gap, and language preference)

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

## Internationalization (i18n)

The app supports **English** and **Vietnamese** languages:

- **Configuration**: `src/i18n/index.ts` - i18next setup with automatic language detection
- **Translation Files**:
  - `src/i18n/locales/en.json` - English translations
  - `src/i18n/locales/vi.json` - Vietnamese translations
- **Language Detection Priority**:
  1. Saved user preference in settings (localStorage `GHIDIEM_ONLINE_SETTING_KEY`)
  2. Browser language (`navigator.language`)
  3. Fallback to Vietnamese
- **Usage**: Components use `useTranslation()` hook from `react-i18next` to access translations via `t('key')`
- **Error Translation**: Custom error translator in `src/utils/helpers/errorTranslator.ts` handles error message translation
- **Validation Messages**: Yup schemas use i18n with interpolation support for dynamic error messages

## Data Migration

`src/migration.js` runs on app initialization (called in App.tsx) to migrate localStorage keys from older versions. This ensures backward compatibility with existing user data.

## Important Patterns

- **Error Handling**: Services throw errors with translated messages, caught in hooks and displayed via `react-toastify`
- **Player Management**: Players are identified by timestamp-based IDs (`dayjs().valueOf()`)
- **Score Tracking**: Each player has a `scores[]` array where index represents game number (0-indexed)
- **Drag & Drop**: Player order can be rearranged using react-beautiful-dnd in PlayingPage
- **Form Validation**: Uses Yup schemas with i18n support (e.g., `src/pages/CreatingPage/utils/schemas.ts`)

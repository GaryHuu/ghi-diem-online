# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Ghi Điểm Online" (https://www.ghidiem.online/) - a Vietnamese score-tracking web application for multi-player card games. The app allows users to create matches, add players, track scores across multiple games, and view leaderboards. Match data is persisted through a backend API (the `ghi-diem-api` Django Ninja repo); user settings stay in browser localStorage.

## Development Commands

```bash
npm run dev          # Start development server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint (js/jsx only — does NOT cover .ts/.tsx files)
npm run format       # Format code with Prettier
npm run pre-commit   # Lint + format (used by Husky)
```

**Verification gotcha**: `npm run lint` uses `--ext js,jsx` so it lints only 2 JS files, and the Vite build strips types without checking them. To actually gate TypeScript changes, run `npx tsc --noEmit` plus `npx eslint --max-warnings 0 <changed files by path>` (path-passed files are linted regardless of `--ext`; `react-hooks/exhaustive-deps` is warn-level, so `--max-warnings 0` is required for it to bite). There is no test runner in this repo.

## Architecture Overview

### Data Layer

**Backend API for match data, localStorage for settings**: The `db` layer is a thin client over the backend REST API:

- `src/api/client.ts` - `apiClient` fetch wrapper; base URL from `VITE_API_URL` (dev: `http://localhost:8000`, run the `ghi-diem-api` repo via `docker compose up -d`)
- `src/db/match/index.ts` - Match and player CRUD via `/api/matches/...` endpoints
- `src/db/setting/index.ts` - User settings persistence in localStorage (with migration for missing fields like `uiMode`)
- `src/services/match/index.ts` - Business logic layer that runs client-side input validation before calling DB functions
- `src/services/setting/index.ts` - Settings service layer

**Key Constraint**: The score-tracking system enforces that the sum of all players' scores for each game must equal zero (zero-sum game rules). Client-side helpers live in `src/utils/validators/matchValidator.ts` (`validateSingleGameScore`, `validateAllGameScores` - used e.g. when navigating between games); the backend enforces the rules on writes.

### Player Data Model

```typescript
interface Player {
	id: number; // Timestamp-based ID (dayjs().valueOf())
	name: string;
	scores: number[]; // Index = game number (0-indexed)
	gap?: number; // Per-player gap override
	autoFill?: boolean; // Auto-fill flag (highlighted, disabled from scoring)
	avatar?: string; // Base64-encoded profile image
}
```

### State Management

Redux slices located in `src/redux/slices/`:

- `matchSlice.ts` - Manages current match state, including:
  - `matches[]` - List of all matches
  - `matchDetail` - Currently active match with `current` game number, `total` games, and match `data`
  - `isShowResult` - Controls result visibility
- `settingSlice.ts` - Manages user settings (unit, gap, UI mode, and language preference)
  - `uiMode` - `'compact' | 'full'` controls interface density (drag handles visible only in full mode)
  - `updateUIMode` action to switch between modes

### Routing Structure

Routes defined in `src/routes/index.tsx` (paths in `src/routes/constants.ts`):

1. **HomePage** (`/`) - Landing page with match listing and creation
2. **CreatingPage** (`/match/create`) - New match setup form
3. **PlayingPage** (`/match/:id?gN=<gameNumber>`) - Active match scoring interface
   - `gN` query param = current game number
   - Main hook: `usePlaying` (src/pages/PlayingPage/hooks/usePlaying.ts) coordinates all match operations
4. **SharedViewPage** (`/share/:token`) - Read-only live view of a shared match
5. **DashboardPage** (`/dashboard`, `/dashboard/:id`) - Admin match management (delete/restore)

### Component Architecture

- Components use TypeScript with explicit type imports from `@/utils/types`
- Barrel exports via `index.ts` files throughout the component tree
- Path alias `@/` maps to `src/` (configured in vite.config.js and tsconfig.json)
- MUI styled components are defined in separate `styles.ts` files
- SASS modules use `.module.scss` extension

### Key Components

- **PlayerModifierDialog** (`src/components/PlayerModifierDialog/`) - Player create/edit dialog with avatar upload (image resizing to 200x200, Base64 encoding)
- **SettingDialog** (`src/components/SettingDialog/`) - Settings for unit, gap, and UI mode (language selection currently disabled)
- **Player** (`src/pages/PlayingPage/components/Player/`) - Player card with score input, trend indicators, autofill toggle, per-player gap setting, drag handle (right side, full mode only)
- **Transactions** (`src/pages/PlayingPage/components/Transactions/`) - Payment flow visualization using `@xyflow/react`
- **TopOne** (`src/pages/PlayingPage/components/TopOne/`) - Winner display with crown icon and avatar
- **LeaderBoard** (`src/pages/PlayingPage/components/LeaderBoard/`) - Rankings table integrated with Transactions

### Key Hooks

- `usePlaying` - Main match orchestration (score updates, game navigation, player management). Called independently by many components (9 call sites), so per-match logic that must run exactly once belongs in `PlayingPage`, not here
- `usePlayingFetcher` - Data fetching for match state
- `useDraggablePlayer` - Drag and drop reordering logic
- `useTransactions` - Calculates payment flows between players
- `useNextGameReminder` - Reminds players to press "Ván mới" when the current round stays balanced (sum = 0) and untouched for 90s; once per round, wired once in `PlayingPage`
- Shared hooks in `src/hooks/`: `useBoolean`, `useFormatCurrency`, `useScrollToTop`, `useAddQueryParams`, `usePlayingTour` (driver.js onboarding tour, exposes `isTourActive`)

### Key Data Flow Pattern

1. User action triggers handler in page-level hook (e.g., `usePlaying`)
2. Handler calls service layer (`matchService`) which validates business rules
3. Service calls database layer (`matchDB`) which hits the backend API (score writes are optimistic in Redux and debounced 400ms before the API call)
4. Service returns updated data
5. Hook dispatches Redux action to update global state
6. Components re-render from Redux store via `useAppSelector`

## Internationalization (i18n)

Currently **Vietnamese only** (English is temporarily disabled in `src/i18n/index.ts`):

- **Configuration**: `src/i18n/index.ts` - Language is forced to `'vi'` (TODO: re-enable English later)
- **Translation Files**:
  - `src/i18n/locales/en.json` - English translations (exist but unused)
  - `src/i18n/locales/vi.json` - Vietnamese translations (active)
- **Language selection** in SettingDialog is currently commented out
- **Usage**: Components use `useTranslation()` hook from `react-i18next` to access translations via `t('key')`
- **Error Translation**: Custom error translator in `src/utils/helpers/errorTranslator.ts` handles error message translation
- **Validation Messages**: Yup schemas use i18n with interpolation support for dynamic error messages

## Data Migration

`src/migration.js` runs on app initialization (called in App.tsx) to migrate localStorage keys from older versions. `src/db/setting/index.ts` also handles migration for missing fields (e.g., `language`, `uiMode`) when reading settings.

## Important Patterns

- **Error Handling**: Services throw errors with translated messages, caught in hooks and displayed via `react-toastify` (progress bar hidden)
- **Player Management**: Players are identified by timestamp-based IDs (`dayjs().valueOf()`)
- **Score Tracking**: Each player has a `scores[]` array where index represents game number (0-indexed)
- **Trend Indicators**: Player component shows previous game score trend (TrendingUp/Down icons, color-coded green/red/gray)
- **AutoFill**: Players flagged with `autoFill` are highlighted (#e3f2fd) and disabled from manual scoring
- **Per-Player Gap**: Individual gap override via speed icon badge with popover editor
- **Avatar Upload**: Images resized to max 200x200px and sent to the backend as Base64
- **Dialogs & Overlays**: All dialogs go through the shared `Dialog` wrapper (`src/components/Dialog/`), which registers itself in `openDialogRegistry.ts` (`useOverlayLock`/`hasOpenOverlay`). Self-opening UI (e.g. the next-game reminder) checks this registry so it never stacks on an open overlay; a new overlay that bypasses the wrapper must call `useOverlayLock` itself
- **Next-Game Reminder**: `useNextGameReminder` + reused `ConfirmModal` (`confirmKey`/`cancelKey`/`autoFocusCancel` options); dialog cannot be closed via backdrop/ESC (the wrapper's default noop `onClose`)
- **Drag & Drop**: Player order can be rearranged using react-beautiful-dnd (drag handle on right side, visible only in full UI mode)
- **UI Modes**: Compact mode hides drag handles; full mode shows all controls
- **Form Validation**: Uses Yup schemas with i18n support (e.g., `src/pages/CreatingPage/utils/schemas.ts`)

<!-- SPECKIT START -->

## Active Feature Plan

- `specs/001-leaderboard-share-card/plan.md` — Leaderboard Share Card (polaroid standings PNG, native Canvas, no new deps)
<!-- SPECKIT END -->

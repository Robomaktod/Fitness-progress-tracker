# Fitness Progress Tracker

Expo Router / React Native fitness app: activity logging, nutrition logging, progress
tracking, social/friends. TypeScript, NativeWind (Tailwind for RN), TanStack Query for
server state, Clerk for auth, axios for HTTP.

## Stack cheat sheet

- **Routing**: `expo-router`, file-based. Everything under `app/` is a route.
- **Styling**: NativeWind — use `className`, not `StyleSheet`, unless a native prop
  requires a raw value (e.g. `color="#fff"` on an icon).
- **Server state**: TanStack Query only, via hooks in `api/`. No direct `apiClient`
  calls from components/screens.
- **Auth**: Clerk (`@clerk/clerk-expo`). `@clerk/nextjs` is in `package.json` but this
  is not a Next.js app — don't import from it; it should eventually be removed (see
  Known Gaps).
- **Types**: `types/health.ts` and `types/social.ts` hold shared domain types,
  re-exported through `types/index.ts`. `types/type.d.ts` holds cross-cutting UI prop
  types (`ButtonProps`, `GradientTextProps`, etc.) — it uses `declare interface` but
  still requires an explicit `import { X } from "@/types/type"` because the file has
  top-level imports, which makes it a module rather than a global ambient file.

## Commands

```
npm run start       # dev server
npm run typecheck   # tsc --noEmit — must be clean
npm run lint         # eslint --ext .ts,.tsx (prettier + import/order baked in)
npm test             # jest
```

Run `typecheck` and `lint` before considering any change done. Use `npm run lint --
--fix` to auto-apply formatting/import-order instead of hand-formatting.

## Code style

Most of this is enforced by `npm run lint` — if the linter disagrees with something
below, fix the code, not the lint config, unless you're deliberately changing the rule.

- **Quotes/semicolons/indent**: double quotes, semicolons, 2 spaces. Prettier's job —
  don't hand-format, run `lint --fix`.
- **Import order**: builtin → external → internal → parent/sibling/index → type,
  alphabetized within each group, blank line between groups. Let `eslint --fix` do
  this; don't hand-order imports.
- **Filenames**: hooks/utilities are `camelCase.ts` (`useFoodQueries.ts`), components
  are `PascalCase.tsx`. This is a hard rule, not a preference — a stray capital in a
  hook filename (`UseNutritionQueries.ts`) caused real inconsistency across imports.
- **No `any`.** Give every API hook's request/response payload a real (even minimal)
  `interface` declared just above the hook — see any file in `api/` for the pattern.
  Don't create a shared "API types" mega-file; keep the type next to the hook that
  uses it unless it's genuinely shared across multiple hooks.
- **No stray `console.log`.** `console.error`/`console.warn` inside a `catch` block are
  fine; anything else is a debugging leftover and should be deleted before you're
  done — not commented out "just in case."
- **No commented-out code left in place.** Delete it; git history is the backup. (This
  repo previously had ~70 lines of a pasted debug object dump and several
  commented-out alternate implementations sitting in committed files — don't
  reintroduce that pattern.)
- **Don't add a feature disguised as a bug fix.** If a handler is intentionally
  unfinished, make that legible: a real TODO comment or a disabled control, not a
  button that looks live but silently no-ops. Several bugs in this codebase were
  exactly that (see Known Gaps) — a label promising one behavior with a handler doing
  another (or nothing).

## Architectural conventions

### Data fetching

- All server state goes through a `useX` hook in `api/`, built on TanStack Query.
  Screens/components never call `apiClient` directly.
- **One resource, one hook, one endpoint.** Don't let two hooks target the same
  resource through different URLs. If a screen and a modal it renders both need the
  same list, fetch it once in the screen and pass it down as a prop — don't let the
  modal independently re-fetch. (This exact mistake — `AddActivityModal` and
  `AddExerciseModal` re-fetching from a different endpoint than the parent screen used
  to resolve names on save — silently saved activities with blank category names.)
- Env-specific values (API base URL, keys) go through `EXPO_PUBLIC_*` env vars,
  documented in `.env.example`. Never hardcode an IP/URL/key in source.

### Navigation & modals

- A file directly under `app/` is a route (expo-router file-based routing) *even if
  you also import it as a plain component elsewhere* — e.g. `app/(root)/add-food.tsx`
  is both the `/add-food` modal route and a component imported directly by
  `nutrition.tsx` and `HeroSection.tsx`. If a component under `app/` takes props like
  `isVisible`/`onClose`/`onSave`, it's designed to be rendered directly as a
  controlled component — routing to it with `router.push` will not supply those props
  and will produce a broken screen.
- Auth gating lives in `app/index.tsx`: signed-in → `/(root)/(tabs)/home`, signed-out →
  `/(auth)/welcome`, gated on Clerk's `isLoaded`. Don't add a second, competing auth
  check elsewhere (this file previously redirected to the same route in both branches,
  which meant there was no auth gate at all — double check this file still branches
  correctly if you touch it).

### Before committing

1. `npm run typecheck` clean.
2. `npm run lint` clean.
3. If you touched a screen with real user interaction (buttons, forms, modals), open it
   in the app and tap through the golden path. Several bugs here only existed because
   a button's label, its `onPress` handler, and its `accessibilityLabel` had each been
   edited independently and drifted apart — type-checking alone won't catch that.

## Known gaps (found, deliberately not auto-fixed — product/backend decisions needed)

These are real but out of scope for a bug-fix pass because fixing them "for real"
means deciding product behavior or backend contracts I can't infer from the frontend
alone:

- **Social tab is 100% mock data** (`app/(root)/(tabs)/social.tsx`): friend
  requests/friends list are hardcoded arrays; accept/reject/search are `Alert` stubs.
  Needs real endpoints wired through `api/useFriendComparison.ts` or a new hook file.
- **Nutrition tab has two disconnected data paths**: the screen computes
  `mealSections` from `useAllFood()` (the food *catalog*, filtered by a `mealName`
  field catalog items don't have, so it's always empty) while `MealSectionCard`
  ignores that prop entirely and independently fetches+filters via
  `useAllNutritionLogs` per card. Loading/error UI on the screen reflects the catalog
  fetch, not the logs each card actually renders. Needs the log-fetching lifted to the
  parent, grouped by `mealType`, and passed down — a real refactor, not a one-line fix.
- **Nutrition and Social tabs are not reachable from the tab bar** — both
  `Tabs.Screen` entries are commented out in `app/(root)/(tabs)/_layout.tsx`. Decide
  whether to re-enable now or leave hidden until the above is resolved.
- **Duplicate category/exercise-type endpoints**: `api/useActivityTypes.ts` hits
  `/activity/activity-categories` and `/activity/exercise-types`; nothing else hits
  those exact paths now (the mismatched duplicates in `useActivityLogs.ts` were
  removed), but which path is actually correct on the backend hasn't been verified
  against a live server from this environment.
- **`googleOAuth`'s backend user-sync call** (`lib/auth.ts`) now posts to `/user`
  (via the shared `apiClient`) instead of a nonexistent `@/lib/fetch` module + Next.js
  style `/(api)/user` route, which was crashing on import. `/user` is a best guess —
  verify it against the real backend route.
- **Several `Alert.alert(..., "... TBD")` stubs are intentionally unfinished**: edit
  activity/food/avatar/fitness-goal, advanced activity filtering, the add-food search
  screen (`app/(root)/search-user.tsx` is a one-line placeholder wired into real
  navigation with a real header). These are honestly-labeled incomplete features, not
  bugs — left as-is.
- **`@clerk/nextjs`** is an unused dependency (this is not a Next.js app). Not removed
  automatically since removing a dependency is a call worth a second look — safe to
  drop when someone confirms nothing depends on it.
- **Dead components** (not imported anywhere): `components/ui/home/BottomTabBar.tsx`,
  `components/shared/WheelMenu.tsx`, `components/ui/activity/ActivityTypeCard.tsx`,
  `components/ui/activity/IntensitySelector.tsx`, `components/ui/shared/DatePicker.tsx`.
  Left in place (BottomTabBar's missing `@/theme/colors` import was fixed so the
  project still type-checks) rather than deleted, in case they're mid-build rather
  than abandoned.

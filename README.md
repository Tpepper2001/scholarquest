# Scholar Quest

A gamified physics practice app built from a WAEC/JAMB question bank — quests,
XP, streaks, badges, real accounts, and a shared leaderboard. React + Vite
frontend, Supabase for auth + data, deploys to Vercel straight from GitHub.

## Project structure

```
public/questions.json     4,215 WAEC/JAMB questions (fetched at runtime)
supabase_schema.sql       run this in Supabase's SQL Editor before first use
src/
  constants.js             levels, badges, avatars, XP logic
  supabaseClient.js        Supabase client, reads env vars
  hooks/useAuth.js         sign up / log in / sign out (Supabase Auth)
  hooks/useProfile.js      player profile — XP, streaks, badges (Supabase table)
  hooks/useLeaderboard.js  shared leaderboard (Supabase table)
  components/              Shell, MathText (KaTeX), Confetti
  screens/                 Auth, CreateProfile, Home, Setup, Quiz, Results, Leaderboard, Badges
  App.jsx                  auth flow + screen routing + quest completion logic
```

## 1. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com) — or use an
   existing one, since every table this app creates is prefixed
   `scholarquest_` so it won't collide with other projects in the same account.
2. Open the **SQL Editor** and run everything in `supabase_schema.sql`. It creates:
   - `scholarquest_profiles` — one private row per player (XP, streaks, badges).
     Row Level Security means a player can only ever read or write their **own** row.
   - `scholarquest_leaderboard` — readable by everyone, but each player can
     still only write their own row (enforced via `auth.uid()`).
3. Go to **Authentication → Providers** and confirm **Email** is enabled (it
   is by default).
4. Optional but recommended for quick local testing: under
   **Authentication → Settings**, you can turn **off** "Confirm email" so
   new sign-ups get a session immediately instead of needing to click a
   confirmation link first. Leave it **on** for a real deployment.
5. Go to **Project Settings → API** and copy the **Project URL** and
   **anon public key**.

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the two values from step 1:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

Without these, the app shows the sign-up screen but auth calls will fail —
Supabase is required now, since accounts and progress both depend on it.

## 3. Run locally

```bash
npm install
npm run dev
```

Sign up with any email/password (6+ characters). If email confirmation is
on, check your inbox, click the link, then log in. You'll land on a short
"pick your name and avatar" step — that creates your `scholarquest_profiles`
row — and then the quest map.

## 4. Push to GitHub

```bash
git init
git add .
git commit -m "Scholar Quest"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/scholar-quest.git
git push -u origin main
```

`.env.local` is gitignored on purpose and will **not** be pushed.

## 5. Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
2. Vercel auto-detects Vite — no build settings to change.
3. Before the first deploy, add the same two Supabase variables under
   **Project Settings → Environment Variables**.
4. Deploy. Every push to `main` redeploys automatically.

## How accounts work

- Sign up/log in use Supabase's built-in email/password auth — no custom
  backend code needed.
- A player's XP, streaks, badges, and quest counts live in
  `scholarquest_profiles`, one row per user, readable/writable only by that
  user (enforced by RLS, not just app logic).
- The leaderboard is a separate table so everyone can read all rows, but
  RLS still restricts each player to writing only their own row — so no one
  can inflate someone else's score even by calling the Supabase API directly.
- Progress now follows the account, not the browser — logging in on a
  different device picks up the same profile.

## Notes / possible follow-ups

- `updateProfile` currently writes to Supabase on every answer (for live XP
  feel). That's fine at this scale; if you add many concurrent players you
  may want to debounce it or batch the write until a quest finishes.
- Math notation in questions (`\( ... \)`) renders via KaTeX in `MathText.jsx`.
- If you previously created an unprefixed `leaderboard` table from an earlier
  version of this project, it's safe to drop — the app no longer uses it:
  `drop table if exists leaderboard;`

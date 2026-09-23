# SkillSwap

Student skill-exchange MVP — React + Vite + TypeScript + Tailwind CSS, with an optional Supabase backend.

> "Bilimingizni ulashing. Yangi narsa o'rganing. Birga rivojlaning."

## Quick start (demo mode — works immediately, no setup)

```bash
npm install
npm run dev
```

Open the printed localhost URL. The app runs in **demo mode**: all data (profiles,
matches, chat, SkillCoin, sessions, ratings) is stored in your browser's
localStorage, seeded with 4 demo students (Vali, Ali, Madina, Jasur).

- Register a new account, or log in as a demo user with any password:
  - `vali@fstu.uz`, `ali@fstu.uz`, `madina@fstu.uz`, `jasur@fstu.uz`
- Everything is fully clickable: Smart Matching, chat, marking sessions
  complete (SkillCoin moves automatically), ratings, profile editing.

This is enough to demo the whole product end-to-end for a competition
presentation without any backend setup.

## Going live with Supabase

1. Create a project at supabase.com.
2. In the SQL editor, run `supabase/schema.sql` — it creates all tables
   (profiles, skills, matches, conversations, messages, sessions, ratings,
   skillcoin_transactions) with Row Level Security policies.
3. Copy `.env.example` to `.env` and fill in your project's URL and anon key
   (Project Settings -> API).
4. Restart `npm run dev`. The app now uses real Supabase auth + Postgres
   instead of localStorage — no code changes needed, `src/lib/supabase.ts`
   detects the env vars automatically.

Note: live mode wires up auth, profile storage, and the query shape end to
end, but for production you'd extend `src/context/AuthContext.tsx` and add
Supabase-backed versions of the functions in `src/lib/store.ts` (matching,
chat, sessions, ratings), matched against `supabase/schema.sql`, and swap in
Supabase Realtime for the chat feed.

## Project structure

```
src/
  pages/        Landing, Login, Register, ProfileSetup, Dashboard, Matches, Chat, Profile
  components/   Navbar, SkillPicker, ProtectedRoute
  context/      AuthContext (demo/live mode aware)
  lib/          supabase.ts (client + mode detection), store.ts (demo data layer), matching.ts
  data/seed.ts  Demo users + skill suggestions
supabase/
  schema.sql    Full Postgres schema + RLS policies
```

## Smart Matching algorithm (MVP)

No external AI — a compatibility score based on mutual skill overlap: how
many of your wanted skills the other person teaches, plus how many of their
wanted skills you teach, as a percentage of total skills wanted between you
both. See `src/lib/matching.ts`.

## SkillCoin

- New users start with 50 SkillCoin.
- Completing a session: teacher +10, learner -10.
- Balance can't go negative; full transaction history on the Profile page.

## Design

Dark, glassmorphism, violet/indigo gradient accents — styled to read as a
modern SaaS product rather than a school project. See `src/index.css`.

## Out of scope for this MVP

Video/voice calls, university admin dashboard, company recruitment, a real
AI matching API, public posts/events, coworking rooms, native mobile app,
payments — per the original spec, these are future versions.

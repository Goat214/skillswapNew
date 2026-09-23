import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// SkillSwap runs in two modes:
// 1. DEMO MODE (default) — no Supabase credentials set. All data lives in
//    localStorage so the app is fully clickable/demoable out of the box.
// 2. LIVE MODE — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in a .env
//    file (see .env.example and supabase/schema.sql) and the app talks to
//    real Supabase auth + Postgres instead.
export const isLiveMode = Boolean(url && anonKey);

export const supabase = isLiveMode ? createClient(url as string, anonKey as string) : null;

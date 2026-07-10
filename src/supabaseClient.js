import { createClient } from '@supabase/supabase-js';

// Set these in a .env.local file (see .env.example) and as Environment
// Variables in your Vercel project settings. The anon key is safe to expose
// in client code — access is governed by the RLS policies on the
// `leaderboard` table (see README.md for the setup SQL).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

if (!supabase) {
  console.warn(
    'Supabase is not configured — the leaderboard will stay empty until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set. See .env.example.'
  );
}

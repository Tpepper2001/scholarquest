import { createClient } from '@supabase/supabase-js';

// These values are safe to hardcode — the anon key is the public client key,
// not the secret service key. Access is governed by Supabase RLS policies.
// VITE_ env vars take priority if set (e.g. for a different Supabase project
// in staging/preview), but fall back to the production values below.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://ghlnenmfwlpwlqdrbean.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdobG5lbm1md2xwd2xxZHJiZWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTE0MDQsImV4cCI6MjA3OTk4NzQwNH0.rNILUdI035c4wl4kFkZFP4OcIM_t7bNMqktKm25d5Gg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

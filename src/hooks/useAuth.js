import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

/**
 * session is undefined while the initial check is in flight, null when
 * signed out, and a Supabase session object when signed in.
 */
export function useAuth() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    if (!supabase) {
      setSession(null);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email, password) => {
    if (!supabase) throw new Error('Supabase is not configured — see .env.example.');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data; // data.session is null if email confirmation is required
  }, []);

  const signIn = useCallback(async (email, password) => {
    if (!supabase) throw new Error('Supabase is not configured — see .env.example.');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  return { session, signUp, signIn, signOut };
}

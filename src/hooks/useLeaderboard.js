import { useCallback, useState } from 'react';
import { supabase } from '../supabaseClient';
import { levelFor } from '../constants';

export function useLeaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scholarquest_leaderboard')
        .select('name, avatar, xp, level')
        .order('xp', { ascending: false })
        .limit(20);
      if (error) { console.error(error); setEntries([]); return []; }
      setEntries(data || []);
      return data || [];
    } finally {
      setLoading(false);
    }
  }, []);

  const submitScore = useCallback(async (profile, session) => {
    if (!session?.user || !profile?.name) return;
    try {
      await supabase.from('scholarquest_leaderboard').upsert(
        {
          user_id: session.user.id,
          name: profile.name,
          avatar: profile.avatar,
          xp: profile.xp,
          level: levelFor(profile.xp).name,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
    } catch (e) {
      console.error('leaderboard save failed', e);
    }
  }, []);

  return { entries, loading, fetchLeaderboard, submitScore };
}

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function fromRow(row) {
  return {
    name: row.name, avatar: row.avatar, xp: row.xp,
    totalCorrect: row.total_correct, totalAnswered: row.total_answered,
    bestStreak: row.best_streak, badges: row.badges || [],
    jambQuests: row.jamb_quests, waecQuests: row.waec_quests, mixedQuests: row.mixed_quests,
  };
}

function toRow(userId, p) {
  return {
    user_id: userId, name: p.name, avatar: p.avatar, xp: p.xp,
    total_correct: p.totalCorrect, total_answered: p.totalAnswered,
    best_streak: p.bestStreak, badges: p.badges,
    jamb_quests: p.jambQuests, waec_quests: p.waecQuests, mixed_quests: p.mixedQuests,
    updated_at: new Date().toISOString(),
  };
}

export function useProfile(session) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session?.user) { setProfile(null); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('scholarquest_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle();
    if (error) console.error('load profile failed', error);
    setProfile(data ? fromRow(data) : null);
    setLoading(false);
  }, [session]);

  useEffect(() => { load(); }, [load]);

  const createProfile = useCallback(async ({ name, avatar }) => {
    if (!session?.user) return null;
    const base = {
      name, avatar, xp: 0, totalCorrect: 0, totalAnswered: 0,
      bestStreak: 0, badges: [], jambQuests: 0, waecQuests: 0, mixedQuests: 0,
    };
    const { data, error } = await supabase
      .from('scholarquest_profiles')
      .insert(toRow(session.user.id, base))
      .select()
      .single();
    if (error) { console.error('create profile failed', error); return null; }
    const created = fromRow(data);
    setProfile(created);
    return created;
  }, [session]);

  const updateProfile = useCallback((updater) => {
    setProfile((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (session?.user && next) {
        supabase
          .from('scholarquest_profiles')
          .update(toRow(session.user.id, next))
          .eq('user_id', session.user.id)
          .then(({ error }) => { if (error) console.error('save profile failed', error); });
      }
      return next;
    });
  }, [session]);

  return { profile, loading, createProfile, updateProfile, reload: load };
}

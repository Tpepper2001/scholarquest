import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function fromRow(row) {
  return {
    name: row.name,
    avatar: row.avatar,
    xp: row.xp,
    totalCorrect: row.total_correct,
    totalAnswered: row.total_answered,
    bestStreak: row.best_streak,
    badges: row.badges || [],
    jambQuests: row.jamb_quests,
    waecQuests: row.waec_quests,
    mixedQuests: row.mixed_quests,
  };
}

function toRow(userId, profile) {
  return {
    user_id: userId,
    name: profile.name,
    avatar: profile.avatar,
    xp: profile.xp,
    total_correct: profile.totalCorrect,
    total_answered: profile.totalAnswered,
    best_streak: profile.bestStreak,
    badges: profile.badges,
    jamb_quests: profile.jambQuests,
    waec_quests: profile.waecQuests,
    mixed_quests: profile.mixedQuests,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Loads and persists the signed-in player's profile from
 * scholarquest_profiles. `profile` is null until createProfile() has run
 * for a brand-new user (first-time setup after sign up / confirmation).
 */
export function useProfile(session) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase || !session?.user) {
      setProfile(null);
      setLoading(false);
      return;
    }
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

  useEffect(() => {
    load();
  }, [load]);

  const createProfile = useCallback(
    async ({ name, avatar }) => {
      if (!supabase || !session?.user) return null;
      const base = {
        name, avatar, xp: 0, totalCorrect: 0, totalAnswered: 0,
        bestStreak: 0, badges: [], jambQuests: 0, waecQuests: 0, mixedQuests: 0,
      };
      const { data, error } = await supabase
        .from('scholarquest_profiles')
        .insert(toRow(session.user.id, base))
        .select()
        .single();
      if (error) {
        console.error('create profile failed', error);
        return null;
      }
      const created = fromRow(data);
      setProfile(created);
      return created;
    },
    [session]
  );

  // Accepts either a full profile object or an updater function, mirroring
  // the old localStorage-backed hook's API so screens didn't need to change.
  const updateProfile = useCallback(
    (updater) => {
      setProfile((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        if (supabase && session?.user && next) {
          supabase
            .from('scholarquest_profiles')
            .update(toRow(session.user.id, next))
            .eq('user_id', session.user.id)
            .then(({ error }) => {
              if (error) console.error('save profile failed', error);
            });
        }
        return next;
      });
    },
    [session]
  );

  return { profile, loading, createProfile, updateProfile, reload: load };
}

import { useEffect } from 'react';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard({ profile, entries, loading, fetchLeaderboard, onBack }) {
  useEffect(() => { fetchLeaderboard(); }, []); // eslint-disable-line

  return (
    <div className="max-w-lg mx-auto mt-4">
      <button onClick={onBack} className="text-sm font-bold text-[var(--navy-soft)] mb-4">
        &larr; Back to map
      </button>
      <div className="bg-white rounded-3xl shadow-lg border border-[#EAF0FB] p-6 sm:p-7">
        <h2 className="font-display font-extrabold text-2xl mb-1">🏅 Leaderboard</h2>
        <p className="text-xs text-[var(--navy-soft)] font-semibold mb-5">
          Top explorers across all quests. Names and scores are visible to everyone.
        </p>

        {loading && (
          <div className="text-center py-8 text-sm font-bold text-[var(--navy-soft)]">Loading scores…</div>
        )}

        {!loading && entries.length === 0 && (
          <div className="text-center py-8 text-sm font-bold text-[var(--navy-soft)]">
            No explorers yet — be the first on the board!
          </div>
        )}

        {!loading && entries.length > 0 && (
          <div className="space-y-2">
            {entries.map((e, i) => (
              <div
                key={e.name + i}
                className={`flex items-center gap-3 p-3 rounded-2xl ${
                  e.name === profile.name ? 'bg-violet-50 border-2 border-[var(--violet)]' : 'bg-[#F9FAFE]'
                }`}
              >
                <div className="w-7 text-center font-mono font-extrabold text-sm">{MEDALS[i] || i + 1}</div>
                <div className="text-xl">{e.avatar || '🦉'}</div>
                <div className="flex-1">
                  <div className="font-display font-bold text-sm">{e.name}</div>
                  <div className="text-[10px] text-[var(--navy-soft)] font-bold">{e.level || ''}</div>
                </div>
                <div className="font-mono font-extrabold text-sm text-[var(--gold-deep)]">{e.xp} XP</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

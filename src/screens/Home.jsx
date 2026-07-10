import { levelFor, nextLevel } from '../constants';

export default function Home({ profile, questions, onChooseWorld, onGoLeaderboard, onGoBadges }) {
  const lvl = levelFor(profile.xp);
  const nxt = nextLevel(profile.xp);
  const span = nxt ? nxt.min - lvl.min : 1;
  const into = nxt ? profile.xp - lvl.min : 1;
  const pct = nxt ? Math.max(4, Math.min(100, Math.round((into / span) * 100))) : 100;

  const worlds = [
    {
      key: 'jamb', title: 'JAMB Quest', desc: 'Recent & classic JAMB physics questions',
      icon: '🎯', color: 'from-[var(--violet)] to-[var(--violet-deep)]',
      count: questions.filter((q) => q.exam === 'jamb').length,
    },
    {
      key: 'waec', title: 'WAEC Quest', desc: 'WAEC objectives across the decades',
      icon: '📘', color: 'from-[var(--mint)] to-[var(--mint-deep)]',
      count: questions.filter((q) => q.exam === 'waec').length,
    },
    {
      key: 'mixed', title: 'Mixed Challenge', desc: 'A surprise mix of both exams',
      icon: '🌪️', color: 'from-[var(--gold)] to-[var(--gold-deep)]',
      count: questions.length,
    },
  ];

  return (
    <div>
      <div className="bg-white rounded-3xl shadow-lg border border-[#EAF0FB] p-6 sm:p-7 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{lvl.icon}</div>
            <div>
              <div className="font-display font-extrabold text-lg sm:text-xl">{lvl.name}</div>
              <div className="text-xs text-[var(--navy-soft)] font-bold">{profile.xp} XP total</div>
            </div>
          </div>
          <div className="flex-1 min-w-[180px]">
            <div className="flex justify-between text-[11px] font-bold text-[var(--navy-soft)] mb-1">
              <span>{lvl.name}</span>
              <span>{nxt ? nxt.name : 'Max level!'}</span>
            </div>
            <div className="h-3 rounded-full bg-[#EEF3FC] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-deep)] transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <div className="flex gap-3 font-mono text-xs">
            <div className="text-center bg-[#F4F7FD] rounded-xl px-3 py-2">
              <div className="font-bold text-base text-[var(--navy)]">{profile.bestStreak}</div>
              <div className="text-[10px] text-[var(--navy-soft)]">best streak</div>
            </div>
            <div className="text-center bg-[#F4F7FD] rounded-xl px-3 py-2">
              <div className="font-bold text-base text-[var(--navy)]">
                {profile.totalCorrect}/{profile.totalAnswered}
              </div>
              <div className="text-[10px] text-[var(--navy-soft)]">correct</div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="font-display font-extrabold text-xl sm:text-2xl mb-4">Choose your quest</h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {worlds.map((w) => (
          <button
            key={w.key}
            onClick={() => onChooseWorld(w.key)}
            className={`path-dot text-left rounded-3xl p-5 bg-gradient-to-br ${w.color} text-white shadow-lg`}
          >
            <div className="text-4xl mb-2">{w.icon}</div>
            <div className="font-display font-extrabold text-lg mb-1">{w.title}</div>
            <div className="text-xs text-white/90 font-semibold mb-3">{w.desc}</div>
            <div className="text-[11px] font-mono font-bold bg-white/20 inline-block px-2 py-1 rounded-lg">
              {w.count} questions available
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onGoLeaderboard}
          className="px-5 py-3 rounded-2xl bg-white border-2 border-[#E1EAF8] font-display font-bold hover:border-[var(--violet)] transition flex items-center gap-2"
        >
          🏅 Leaderboard
        </button>
        <button
          onClick={onGoBadges}
          className="px-5 py-3 rounded-2xl bg-white border-2 border-[#E1EAF8] font-display font-bold hover:border-[var(--violet)] transition flex items-center gap-2"
        >
          🎖️ My Badges
        </button>
      </div>
    </div>
  );
}

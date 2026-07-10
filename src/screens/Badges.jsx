import { BADGE_DEFS } from '../constants';

export default function Badges({ profile, onBack }) {
  return (
    <div className="max-w-lg mx-auto mt-4">
      <button onClick={onBack} className="text-sm font-bold text-[var(--navy-soft)] mb-4">
        &larr; Back to map
      </button>
      <div className="bg-white rounded-3xl shadow-lg border border-[#EAF0FB] p-6 sm:p-7">
        <h2 className="font-display font-extrabold text-2xl mb-1">🎖️ My badges</h2>
        <p className="text-xs text-[var(--navy-soft)] font-semibold mb-5">
          {profile.badges.length} of {BADGE_DEFS.length} unlocked
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGE_DEFS.map((b) => {
            const unlocked = profile.badges.includes(b.id);
            return (
              <div key={b.id} className={`text-center p-3 rounded-2xl bg-[#F9FAFE] ${unlocked ? '' : 'badge-locked'}`}>
                <div className="text-3xl mb-1">{b.icon}</div>
                <div className="font-display font-bold text-xs mb-1">{b.name}</div>
                <div className="text-[9px] text-[var(--navy-soft)] font-semibold leading-tight">{b.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Results({ result, profile, onPlayAgain, onGoHome, onGoLeaderboard }) {
  const { correct, total, xpEarned, sessionBestStreak, earnedBadges } = result;
  const pct = Math.round((correct / total) * 100);

  let msg = 'Nice effort! Every quest makes you sharper.';
  if (pct >= 90) msg = "Outstanding! You're basically a physics wizard!";
  else if (pct >= 70) msg = 'Great job! You really know your physics!';
  else if (pct >= 50) msg = "Solid work! Keep practicing and you'll master this!";

  return (
    <div className="max-w-md mx-auto mt-4 bg-white rounded-3xl shadow-lg border border-[#EAF0FB] p-7 text-center">
      <div className="text-6xl mb-2">{pct >= 70 ? '🎉' : '💪'}</div>
      <h2 className="font-display font-extrabold text-2xl mb-1">Quest complete!</h2>
      <p className="text-sm font-semibold text-[var(--navy-soft)] mb-5">{msg}</p>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-[#F4F7FD] rounded-2xl py-3">
          <div className="font-display font-extrabold text-xl">
            {correct}/{total}
          </div>
          <div className="text-[10px] font-bold text-[var(--navy-soft)]">correct</div>
        </div>
        <div className="bg-[#FFF8EA] rounded-2xl py-3">
          <div className="font-display font-extrabold text-xl text-[var(--gold-deep)]">+{xpEarned}</div>
          <div className="text-[10px] font-bold text-[var(--navy-soft)]">XP earned</div>
        </div>
        <div className="bg-[#F0FBF6] rounded-2xl py-3">
          <div className="font-display font-extrabold text-xl text-[var(--mint-deep)]">
            {sessionBestStreak > 0 ? sessionBestStreak : profile.bestStreak}
          </div>
          <div className="text-[10px] font-bold text-[var(--navy-soft)]">best streak</div>
        </div>
      </div>

      {earnedBadges?.length > 0 && (
        <div className="mb-6">
          <div className="font-display font-bold text-sm mb-2">
            New badge{earnedBadges.length > 1 ? 's' : ''} unlocked!
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            {earnedBadges.map((b) => (
              <div key={b.id} className="bg-[#FFF8EA] border-2 border-[var(--gold)] rounded-2xl px-3 py-2 pop-in">
                <div className="text-2xl">{b.icon}</div>
                <div className="text-[10px] font-bold">{b.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <button
          onClick={onPlayAgain}
          className="w-full py-3 rounded-2xl bg-[var(--violet)] hover:bg-[var(--violet-deep)] text-white font-display font-bold shadow-lg shadow-violet-200"
        >
          Play another quest
        </button>
        <button onClick={onGoHome} className="w-full py-3 rounded-2xl bg-white border-2 border-[#E1EAF8] font-display font-bold">
          Back to quest map
        </button>
        <button onClick={onGoLeaderboard} className="w-full py-3 rounded-2xl bg-white border-2 border-[#E1EAF8] font-display font-bold">
          View leaderboard 🏅
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import MathText from '../components/MathText';
import Confetti from '../components/Confetti';
import { pick, ENCOURAGE_CORRECT, ENCOURAGE_WRONG } from '../constants';

export default function Quiz({ questions, onQuit, onFinish, profile, updateProfile }) {
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [feedback, setFeedback] = useState(null); // { correct: bool, text: string }
  const [confettiKey, setConfettiKey] = useState(0);
  const [shake, setShake] = useState(false);

  const q = questions[idx];
  const total = questions.length;

  function selectAnswer(tag, isCorrect) {
    if (answered) return;
    setAnswered(true);
    setSelectedTag(tag);

    updateProfile((prev) => {
      const next = { ...prev, totalAnswered: prev.totalAnswered + 1 };
      if (isCorrect) {
        next.totalCorrect = prev.totalCorrect + 1;
        const newStreak = streak + 1;
        if (newStreak > prev.bestStreak) next.bestStreak = newStreak;
      }
      return next;
    });

    if (isCorrect) {
      const newStreak = streak + 1;
      const bonus = Math.min(newStreak * 2, 20);
      const gained = 10 + bonus;
      setStreak(newStreak);
      setCorrect((c) => c + 1);
      setXpEarned((x) => x + gained);
      updateProfile((prev) => ({ ...prev, xp: prev.xp + gained }));
      setFeedback({ correct: true, text: `✓ ${pick(ENCOURAGE_CORRECT)} +${gained} XP` });
      setConfettiKey((k) => k + 1);
    } else {
      setStreak(0);
      setFeedback({ correct: false, text: pick(ENCOURAGE_WRONG) });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  function next() {
    if (idx + 1 >= total) {
      onFinish({ correct, total, xpEarned, sessionBestStreak: streak });
      return;
    }
    setIdx((i) => i + 1);
    setAnswered(false);
    setSelectedTag(null);
    setFeedback(null);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <button onClick={onQuit} className="text-xs font-bold text-[var(--navy-soft)]">
          &larr; Quit quest
        </button>
        <div className="font-mono text-xs font-bold text-[var(--navy-soft)]">
          Question {idx + 1} / {total}
        </div>
      </div>
      <div className="h-2.5 rounded-full bg-[#EEF3FC] overflow-hidden mb-5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--mint)] to-[var(--mint-deep)] transition-all duration-300"
          style={{ width: `${Math.round((idx / total) * 100)}%` }}
        />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F4F7FD] text-[var(--navy-soft)]">
          {q.label || q.exam.toUpperCase()}
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-[var(--gold-deep)]">
            🔥 {streak} streak
          </div>
        )}
      </div>

      <div className={`relative bg-white rounded-3xl shadow-lg border border-[#EAF0FB] p-6 sm:p-7 mb-5 pop-in ${shake ? 'shake' : ''}`}>
        {feedback?.correct && <Confetti key={confettiKey} />}
        <div className="font-display font-bold text-lg sm:text-xl leading-snug mb-6">
          <MathText text={q.q} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {q.o.map(([tag, text, isCorrect]) => {
            let stateClasses = 'border-[#E1EAF8] bg-[#FAFBFF] hover:border-[var(--violet)]';
            let badgeClasses = 'bg-[#EEF3FC] text-[var(--navy-soft)]';
            let opacity = 1;
            if (answered) {
              if (isCorrect) {
                stateClasses = 'border-[var(--mint-deep)] bg-[#EAFBF5]';
                badgeClasses = 'bg-[var(--mint)] text-white';
              } else if (tag === selectedTag) {
                stateClasses = 'border-[var(--coral-deep)] bg-[#FFF1F1]';
                badgeClasses = 'bg-[var(--coral)] text-white';
              } else {
                opacity = 0.45;
              }
            }
            return (
              <button
                key={tag}
                disabled={answered}
                onClick={() => selectAnswer(tag, isCorrect)}
                style={{ opacity }}
                className={`option-btn text-left p-4 rounded-2xl border flex items-start gap-3 ${stateClasses}`}
              >
                <span className={`font-mono font-extrabold text-xs w-6 h-6 flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5 ${badgeClasses}`}>
                  {tag.toUpperCase()}
                </span>
                <span className="text-sm sm:text-[15px] font-semibold leading-snug">
                  <MathText text={text} />
                </span>
              </button>
            );
          })}
        </div>
        {feedback && (
          <div className={`mt-5 font-display font-bold text-base ${feedback.correct ? 'text-[var(--mint-deep)]' : 'text-[var(--coral-deep)]'}`}>
            {feedback.text}
          </div>
        )}
      </div>

      {answered && (
        <button
          onClick={next}
          className="w-full py-3.5 rounded-2xl bg-[var(--navy)] text-white font-display font-bold text-lg shadow-lg transition"
        >
          {idx + 1 >= total ? 'See results →' : 'Next question →'}
        </button>
      )}
    </div>
  );
}

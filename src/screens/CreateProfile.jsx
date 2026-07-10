import { useState } from 'react';
import { AVATARS } from '../constants';

export default function CreateProfile({ email, onCreate, onSignOut }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [nameError, setNameError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleStart() {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError(true);
      setTimeout(() => setNameError(false), 500);
      return;
    }
    setBusy(true);
    await onCreate({ name: trimmed.slice(0, 18), avatar });
    setBusy(false);
  }

  return (
    <div className="max-w-md mx-auto mt-6 sm:mt-14 bg-white rounded-3xl shadow-xl p-7 sm:p-9 border border-[#EAF0FB]">
      <div className="text-5xl mb-3 text-center">🦉✨</div>
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-center mb-2">
        One last step!
      </h1>
      <p className="text-center text-[var(--navy-soft)] font-semibold text-sm mb-1">
        You're signed in as {email}.
      </p>
      <p className="text-center text-[var(--navy-soft)] font-semibold text-sm mb-6">
        Pick your explorer name and avatar to begin your quest.
      </p>

      <label className="block font-bold text-sm mb-2" htmlFor="name-input">Your explorer name</label>
      <input
        id="name-input"
        maxLength={18}
        placeholder="e.g. Bola the Brave"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleStart()}
        className={`w-full px-4 py-3 rounded-2xl border-2 outline-none font-bold text-[var(--navy)] mb-5 transition ${
          nameError ? 'border-[var(--coral)] shake' : 'border-[#E1EAF8] focus:border-[var(--violet)]'
        }`}
      />

      <label className="block font-bold text-sm mb-2">Choose your avatar</label>
      <div className="grid grid-cols-6 gap-2 mb-6">
        {AVATARS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAvatar(a)}
            className={`text-2xl p-2 rounded-xl border-2 transition ${
              a === avatar ? 'border-[var(--violet)] bg-violet-50' : 'border-transparent bg-[#F4F7FD]'
            } hover:border-[var(--violet)]`}
          >
            {a}
          </button>
        ))}
      </div>

      <p className="text-[11px] text-[var(--navy-soft)] mb-4 leading-relaxed">
        Your name and score will appear on the public leaderboard so other explorers can cheer you on. Your email stays private.
      </p>

      <button
        onClick={handleStart}
        disabled={busy}
        className="w-full py-3.5 rounded-2xl bg-[var(--violet)] hover:bg-[var(--violet-deep)] disabled:opacity-60 text-white font-display font-bold text-lg shadow-lg shadow-violet-200 transition"
      >
        {busy ? 'Setting up…' : 'Begin my quest 🚀'}
      </button>

      <button onClick={onSignOut} className="w-full mt-3 text-xs font-bold text-[var(--navy-soft)]">
        Sign out
      </button>
    </div>
  );
}

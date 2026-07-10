import { useState } from 'react';

export default function Auth({ signUp, signIn }) {
  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmNotice, setConfirmNotice] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setConfirmNotice(false);
    if (!email.trim() || password.length < 6) {
      setError('Enter an email and a password of at least 6 characters.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signup') {
        const data = await signUp(email.trim(), password);
        if (!data.session) {
          // Email confirmation is turned on for this project — no session yet.
          setConfirmNotice(true);
        }
      } else {
        await signIn(email.trim(), password);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-6 sm:mt-14 bg-white rounded-3xl shadow-xl p-7 sm:p-9 border border-[#EAF0FB]">
      <div className="text-5xl mb-3 text-center">🦉✨</div>
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-center mb-2">
        {mode === 'signup' ? 'Create your explorer account' : 'Welcome back!'}
      </h1>
      <p className="text-center text-[var(--navy-soft)] font-semibold text-sm mb-6">
        {mode === 'signup'
          ? 'Sign up to save your progress and join the leaderboard.'
          : 'Log in to continue your physics quest.'}
      </p>

      <div className="flex bg-[#F4F7FD] rounded-2xl p-1 mb-6">
        <button
          type="button"
          onClick={() => { setMode('signup'); setError(''); setConfirmNotice(false); }}
          className={`flex-1 py-2 rounded-xl font-display font-bold text-sm transition ${
            mode === 'signup' ? 'bg-white shadow text-[var(--violet)]' : 'text-[var(--navy-soft)]'
          }`}
        >
          Sign up
        </button>
        <button
          type="button"
          onClick={() => { setMode('login'); setError(''); setConfirmNotice(false); }}
          className={`flex-1 py-2 rounded-xl font-display font-bold text-sm transition ${
            mode === 'login' ? 'bg-white shadow text-[var(--violet)]' : 'text-[var(--navy-soft)]'
          }`}
        >
          Log in
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="block font-bold text-sm mb-2" htmlFor="email-input">Email</label>
        <input
          id="email-input"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-2xl border-2 border-[#E1EAF8] focus:border-[var(--violet)] outline-none font-semibold text-[var(--navy)] mb-4"
        />

        <label className="block font-bold text-sm mb-2" htmlFor="password-input">Password</label>
        <input
          id="password-input"
          type="password"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          className="w-full px-4 py-3 rounded-2xl border-2 border-[#E1EAF8] focus:border-[var(--violet)] outline-none font-semibold text-[var(--navy)] mb-2"
        />

        {error && <p className="text-[var(--coral-deep)] text-sm font-semibold mb-3">{error}</p>}
        {confirmNotice && (
          <p className="text-[var(--mint-deep)] text-sm font-semibold mb-3">
            Almost there — check your email to confirm your account, then log in below.
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full mt-3 py-3.5 rounded-2xl bg-[var(--violet)] hover:bg-[var(--violet-deep)] disabled:opacity-60 text-white font-display font-bold text-lg shadow-lg shadow-violet-200 transition"
        >
          {busy ? 'Please wait…' : mode === 'signup' ? 'Create account 🚀' : 'Log in 🚀'}
        </button>
      </form>
    </div>
  );
}

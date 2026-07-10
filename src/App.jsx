import { useEffect, useState } from 'react';
import Shell from './components/Shell';
import Auth from './screens/Auth';
import CreateProfile from './screens/CreateProfile';
import Home from './screens/Home';
import Setup from './screens/Setup';
import Quiz from './screens/Quiz';
import Results from './screens/Results';
import Leaderboard from './screens/Leaderboard';
import Badges from './screens/Badges';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { useLeaderboard } from './hooks/useLeaderboard';
import { newBadges, shuffle } from './constants';

export default function App() {
  const { session, signUp, signIn, signOut } = useAuth();
  const { profile, loading: profileLoading, createProfile, updateProfile } = useProfile(session);
  const { entries, loading: lbLoading, fetchLeaderboard, submitScore } = useLeaderboard();

  const [questions, setQuestions] = useState(null);
  const [screen, setScreen] = useState('home'); // home | setup | quiz | results | leaderboard | badges
  const [pendingWorld, setPendingWorld] = useState('mixed');
  const [sessionQuestions, setSessionQuestions] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  // Load the question bank once on mount.
  useEffect(() => {
    fetch('/questions.json')
      .then((r) => r.json())
      .then(setQuestions)
      .catch((e) => console.error('Failed to load questions', e));
  }, []);

  // Reset to the home screen whenever a fresh profile becomes available
  // (e.g. right after finishing account setup).
  useEffect(() => {
    if (profile) setScreen('home');
  }, [profile?.name]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Loading state: waiting on auth check or question bank ----
  if (session === undefined || !questions) {
    return (
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-24 text-center">
        <div className="font-display font-bold text-lg text-[var(--navy-soft)]">Loading Scholar Quest…</div>
      </div>
    );
  }

  // ---- Signed out: show sign up / log in ----
  if (session === null) {
    return (
      <Shell profile={null} showProfile={false} onLogoClick={() => {}}>
        <Auth signUp={signUp} signIn={signIn} />
      </Shell>
    );
  }

  // ---- Signed in, but profile still loading or not yet created ----
  if (profileLoading) {
    return (
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-24 text-center">
        <div className="font-display font-bold text-lg text-[var(--navy-soft)]">Loading your quest…</div>
      </div>
    );
  }
  if (!profile) {
    return (
      <Shell profile={null} showProfile={false} onLogoClick={() => {}}>
        <CreateProfile email={session.user.email} onCreate={createProfile} onSignOut={signOut} />
      </Shell>
    );
  }

  // ---- Fully signed in with a profile: normal app flow ----
  function handleChooseWorld(world) {
    setPendingWorld(world);
    setScreen('setup');
  }

  function handleLaunch(n) {
    const pool = pendingWorld === 'mixed' ? questions : questions.filter((q) => q.exam === pendingWorld);
    setSessionQuestions(shuffle(pool).slice(0, n));
    setScreen('quiz');
  }

  function handleQuizFinish({ correct, total, xpEarned, sessionBestStreak }) {
    // `profile` here already reflects every per-question update Quiz made
    // via updateProfile, since each of those triggers a re-render of App.
    const before = profile;
    const next = { ...profile };
    if (pendingWorld === 'jamb') next.jambQuests = profile.jambQuests + 1;
    else if (pendingWorld === 'waec') next.waecQuests = profile.waecQuests + 1;
    else next.mixedQuests = profile.mixedQuests + 1;

    const earned = newBadges(before, next);
    next.badges = profile.badges.concat(earned.map((b) => b.id));

    updateProfile(next);
    setLastResult({ correct, total, xpEarned, sessionBestStreak, earnedBadges: earned });
    submitScore(next, session);
    setScreen('results');
  }

  return (
    <Shell
      profile={profile}
      showProfile={screen !== 'quiz'}
      onLogoClick={() => setScreen('home')}
      onProfileClick={() => setScreen('badges')}
      onSignOut={signOut}
    >
      {screen === 'home' && (
        <Home
          profile={profile}
          questions={questions}
          onChooseWorld={handleChooseWorld}
          onGoLeaderboard={() => setScreen('leaderboard')}
          onGoBadges={() => setScreen('badges')}
        />
      )}

      {screen === 'setup' && (
        <Setup world={pendingWorld} onBack={() => setScreen('home')} onLaunch={handleLaunch} />
      )}

      {screen === 'quiz' && sessionQuestions && (
        <Quiz
          questions={sessionQuestions}
          profile={profile}
          updateProfile={updateProfile}
          onQuit={() => setScreen('home')}
          onFinish={handleQuizFinish}
        />
      )}

      {screen === 'results' && lastResult && (
        <Results
          result={lastResult}
          profile={profile}
          onPlayAgain={() => setScreen('setup')}
          onGoHome={() => setScreen('home')}
          onGoLeaderboard={() => setScreen('leaderboard')}
        />
      )}

      {screen === 'leaderboard' && (
        <Leaderboard
          profile={profile}
          entries={entries}
          loading={lbLoading}
          fetchLeaderboard={fetchLeaderboard}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'badges' && <Badges profile={profile} onBack={() => setScreen('home')} />}
    </Shell>
  );
}

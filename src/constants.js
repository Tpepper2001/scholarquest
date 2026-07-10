export const LEVELS = [
  { name: 'Curious Explorer', min: 0, icon: '🔭' },
  { name: 'Bright Investigator', min: 60, icon: '🔍' },
  { name: 'Sharp Analyst', min: 160, icon: '📐' },
  { name: 'Physics Whiz', min: 360, icon: '⚡' },
  { name: 'Master Scholar', min: 700, icon: '🏆' },
  { name: 'Grand Physicist', min: 1400, icon: '🌟' },
  { name: 'Legendary Genius', min: 2600, icon: '👑' },
];

export const AVATARS = ['🦉', '🚀', '🦊', '🐢', '🐝', '🦁', '🐬', '🤖', '🧑‍🚀', '👩‍🔬', '🧠', '⭐'];

export const ENCOURAGE_CORRECT = [
  'Brilliant work!', "You nailed it!", 'Sharp thinking!', 'Excellent!',
  'Way to go!', 'Spot on!', 'Superb!', "That's the spirit!",
];

export const ENCOURAGE_WRONG = [
  'Good try — keep going!', "So close, next one is yours!",
  "Not quite, but you're learning!", 'Shake it off, try the next one!',
  'Nice effort — onward!',
];

export const BADGE_DEFS = [
  { id: 'first_spark', name: 'First Spark', icon: '✨', desc: 'Answer your first question correctly', check: (p) => p.totalCorrect >= 1 },
  { id: 'hot_streak', name: 'Hot Streak', icon: '🔥', desc: 'Get a streak of 5 in a row', check: (p) => p.bestStreak >= 5 },
  { id: 'lightning_streak', name: 'Lightning Streak', icon: '⚡', desc: 'Get a streak of 10 in a row', check: (p) => p.bestStreak >= 10 },
  { id: 'half_century', name: 'Half Century', icon: '🥈', desc: 'Answer 50 questions correctly', check: (p) => p.totalCorrect >= 50 },
  { id: 'century_club', name: 'Century Club', icon: '🥇', desc: 'Answer 100 questions correctly', check: (p) => p.totalCorrect >= 100 },
  { id: 'jamb_champ', name: 'JAMB Champion', icon: '🎓', desc: 'Complete 5 JAMB quests', check: (p) => p.jambQuests >= 5 },
  { id: 'waec_champ', name: 'WAEC Champion', icon: '📚', desc: 'Complete 5 WAEC quests', check: (p) => p.waecQuests >= 5 },
  { id: 'marathoner', name: 'Quiz Marathoner', icon: '🏃', desc: 'Answer 200 questions total', check: (p) => p.totalAnswered >= 200 },
];

export function defaultProfile() {
  return {
    name: '', avatar: '🦉', xp: 0, totalCorrect: 0, totalAnswered: 0,
    bestStreak: 0, badges: [], jambQuests: 0, waecQuests: 0, mixedQuests: 0,
    createdAt: Date.now(),
  };
}

export function levelFor(xp) {
  let cur = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.min) cur = l;
  return cur;
}

export function nextLevel(xp) {
  for (const l of LEVELS) if (xp < l.min) return l;
  return null;
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function newBadges(oldProfile, newProfile) {
  const earned = [];
  for (const b of BADGE_DEFS) {
    const had = oldProfile.badges.includes(b.id);
    const has = b.check(newProfile);
    if (has && !had) earned.push(b);
  }
  return earned;
}

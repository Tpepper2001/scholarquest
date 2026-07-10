import { useState } from 'react';

const LABELS = { jamb: 'JAMB Quest 🎯', waec: 'WAEC Quest 📘', mixed: 'Mixed Challenge 🌪️' };
const LENGTHS = [5, 10, 20];

export default function Setup({ world, onBack, onLaunch }) {
  const [n, setN] = useState(10);

  return (
    <div className="max-w-md mx-auto mt-4 bg-white rounded-3xl shadow-lg border border-[#EAF0FB] p-7">
      <button onClick={onBack} className="text-sm font-bold text-[var(--navy-soft)] mb-4">
        &larr; Back to map
      </button>
      <h2 className="font-display font-extrabold text-2xl mb-1">{LABELS[world]}</h2>
      <p className="text-sm text-[var(--navy-soft)] font-semibold mb-6">
        How many questions would you like to tackle?
      </p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {LENGTHS.map((len) => (
          <button
            key={len}
            onClick={() => setN(len)}
            className={`py-4 rounded-2xl border-2 font-display font-extrabold text-lg transition ${
              n === len ? 'border-[var(--violet)] bg-violet-50' : 'border-[#E1EAF8]'
            }`}
          >
            {len}
          </button>
        ))}
      </div>
      <button
        onClick={() => onLaunch(n)}
        className="w-full py-3.5 rounded-2xl bg-[var(--violet)] hover:bg-[var(--violet-deep)] text-white font-display font-bold text-lg shadow-lg shadow-violet-200 transition"
      >
        Launch quest 🚀
      </button>
    </div>
  );
}

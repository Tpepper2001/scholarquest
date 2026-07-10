const COLORS = ['#7C5CFC', '#FFB627', '#06D6A0', '#FF6B6B'];

// A burst of falling confetti pieces, re-mounted (via `burstKey` changing in
// the parent) each time a correct answer is given.
export default function Confetti({ pieceCount = 16 }) {
  const pieces = Array.from({ length: pieceCount }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 4 + Math.random() * 4,
    color: COLORS[i % COLORS.length],
    delay: Math.random() * 0.15,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

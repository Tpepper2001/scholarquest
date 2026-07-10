export default function Shell({ profile, showProfile = true, onLogoClick, onProfileClick, onSignOut, children }) {
  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 pb-16">
      <div className="bg-orb floaty" style={{ width: 280, height: 280, background: 'var(--gold)', top: -60, left: -60 }} />
      <div className="bg-orb floaty" style={{ width: 220, height: 220, background: 'var(--violet)', top: 200, right: -80, animationDelay: '1s' }} />
      <div className="bg-orb floaty" style={{ width: 180, height: 180, background: 'var(--mint)', bottom: 0, left: '10%', animationDelay: '2s' }} />

      <header className="pt-6 pb-4 flex items-center justify-between relative">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onLogoClick}>
          <div className="text-3xl">🧪</div>
          <div>
            <div className="font-display font-extrabold text-xl sm:text-2xl text-[var(--navy)] leading-none">Scholar Quest</div>
            <div className="text-[11px] sm:text-xs text-[var(--navy-soft)] font-bold tracking-wide">PHYSICS ADVENTURE · WAEC &amp; JAMB</div>
          </div>
        </div>
        {showProfile && profile?.name ? (
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-2 rounded-2xl shadow-sm border border-white cursor-pointer"
              onClick={onProfileClick}
            >
              <span className="text-xl">{profile.avatar}</span>
              <div className="text-left leading-tight">
                <div className="font-display font-bold text-sm">{profile.name}</div>
                <div className="font-mono text-[10px] text-[var(--gold-deep)] font-bold">{profile.xp} XP</div>
              </div>
            </div>
            <button
              onClick={onSignOut}
              title="Sign out"
              className="text-[11px] font-bold text-[var(--navy-soft)] hover:text-[var(--coral-deep)] px-2 py-2"
            >
              Sign out
            </button>
          </div>
        ) : null}
      </header>

      <main className="pop-in relative">{children}</main>
    </div>
  );
}

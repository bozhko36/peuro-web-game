export function BackgroundDecor() {
  return (
    <div className="decor-layer" aria-hidden="true">
      <div className="decor-icon decor-soccer">
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3">
          <circle cx="32" cy="32" r="26" />
          <path d="M32 18l8 6-3 10H27l-3-10 8-6z" />
          <path d="M24 24l-9 6m25-6 9 6M20 45l7-11m17 11-7-11m-10 0-7 5m24-5 7 5" />
        </svg>
      </div>
      <div className="decor-icon decor-card">
        <svg viewBox="0 0 64 80" fill="none" stroke="currentColor" strokeWidth="3">
          <rect x="10" y="8" width="44" height="64" rx="8" />
          <path d="M24 22c4-6 12-6 16 0-2 7-8 10-8 10s-6-3-8-10z" />
          <path d="M32 32v16" />
          <path d="M27 42h10" />
        </svg>
      </div>
      <div className="decor-icon decor-slot">
        <svg viewBox="0 0 72 72" fill="none" stroke="currentColor" strokeWidth="3">
          <rect x="14" y="10" width="38" height="50" rx="8" />
          <rect x="22" y="20" width="22" height="14" rx="3" />
          <path d="M22 42h22" />
          <path d="M57 22c5 0 7 3 7 7s-2 7-7 7" />
          <circle cx="58" cy="29" r="2.5" fill="currentColor" stroke="none" />
        </svg>
      </div>
      <div className="decor-icon decor-roulette">
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3">
          <circle cx="32" cy="32" r="24" />
          <circle cx="32" cy="32" r="6" />
          <path d="M32 8v18M32 38v18M8 32h18M38 32h18M15 15l13 13M36 36l13 13M49 15L36 28M28 36L15 49" />
        </svg>
      </div>
      <div className="decor-icon decor-coin">
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3">
          <circle cx="32" cy="32" r="22" />
          <circle cx="32" cy="32" r="14" />
          <path d="M38 22c-9-4-17 0-17 10s8 14 17 10" />
          <path d="M18 29h20M18 35h18" />
        </svg>
      </div>
      <div className="decor-icon decor-trophy">
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M22 12h20v9c0 11-5 18-10 18s-10-7-10-18v-9z" />
          <path d="M22 18H12c0 10 4 16 12 18M42 18h10c0 10-4 16-12 18" />
          <path d="M32 39v9M24 52h16M20 58h24" />
        </svg>
      </div>
    </div>
  );
}

function SciFiIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5.2" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.2" />
    </svg>
  )
}

function NoirIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <clipPath id="noir-head">
          <path d="M12 3.5c-3.2 0-5.5 2.6-5.5 6.1 0 2.1.8 3.5 1.7 4.8L7 20.5h10l-1.2-6.1c.9-1.3 1.7-2.7 1.7-4.8C17.5 6.1 15.2 3.5 12 3.5z" />
        </clipPath>
      </defs>
      <path
        d="M12 3.5c-3.2 0-5.5 2.6-5.5 6.1 0 2.1.8 3.5 1.7 4.8L7 20.5h10l-1.2-6.1c.9-1.3 1.7-2.7 1.7-4.8C17.5 6.1 15.2 3.5 12 3.5z"
        fill="#111111"
      />
      <g clipPath="url(#noir-head)">
        {[5, 7, 9, 11].map((y) => (
          <rect key={y} x="5" y={y} width="14" height="1.1" fill="#c8c8c8" />
        ))}
      </g>
    </svg>
  )
}

function ThrillerIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  )
}

const ICONS = {
  scifi: SciFiIcon,
  noir: NoirIcon,
  thriller: ThrillerIcon,
}

export default function GenreTag({ label, variant = 'scifi' }) {
  const Icon = ICONS[variant] || SciFiIcon

  if (variant === 'noir') {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-[#d4d4d4] px-3.5 py-2 text-xs font-semibold tracking-wide text-black shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </span>
    )
  }

  const neon =
    variant === 'thriller'
      ? {
          color: '#ff6a3d',
          border: 'rgba(255,106,61,0.85)',
          glow: '0 0 8px rgba(255,106,61,0.45), 0 0 18px rgba(255,90,40,0.25)',
        }
      : {
          color: '#5ec8ff',
          border: 'rgba(94,200,255,0.85)',
          glow: '0 0 8px rgba(94,200,255,0.45), 0 0 18px rgba(56,180,255,0.25)',
        }

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border bg-black/40 px-3.5 py-2 text-xs font-medium tracking-wide backdrop-blur-sm"
      style={{
        color: neon.color,
        borderColor: neon.border,
        boxShadow: neon.glow,
        textShadow: `0 0 8px ${neon.color}`,
      }}
    >
      <Icon
        className="h-4 w-4 shrink-0"
        style={{ filter: `drop-shadow(0 0 4px ${neon.color})` }}
      />
      {label}
    </span>
  )
}

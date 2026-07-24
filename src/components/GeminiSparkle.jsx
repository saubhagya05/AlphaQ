export default function GeminiSparkle({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient
          id="gemini-grad"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="45%" stopColor="#9B72CB" />
          <stop offset="100%" stopColor="#E61C38" />
        </linearGradient>
      </defs>
      <path
        d="M12 2c.4 3.7 1.6 6.4 3.6 8.4C17.6 12.4 20.3 13.6 24 14c-3.7.4-6.4 1.6-8.4 3.6C13.6 19.6 12.4 22.3 12 26c-.4-3.7-1.6-6.4-3.6-8.4C6.4 15.6 3.7 14.4 0 14c3.7-.4 6.4-1.6 8.4-3.6C10.4 8.4 11.6 5.7 12 2z"
        fill="url(#gemini-grad)"
        transform="scale(0.85) translate(2.1 -0.9)"
      />
    </svg>
  )
}

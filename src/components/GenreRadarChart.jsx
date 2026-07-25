import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'

const GENRE_RADAR_DATA = [
  { category: 'Sci-Fi', value: 94 },
  { category: 'Noir', value: 90 },
  { category: 'Thriller', value: 86 },
  { category: 'Drama', value: 46 },
  { category: 'Romance', value: 30 },
  { category: 'Action', value: 42 },
  { category: 'Mystery', value: 62 },
]

export const THEME_RADAR_DATA = [
  { category: 'Longing', value: 88 },
  { category: 'Tension', value: 82 },
  { category: 'Nostalgia', value: 90 },
  { category: 'Intimacy', value: 74 },
  { category: 'Secrets', value: 86 },
  { category: 'Hope', value: 58 },
  { category: 'Melancholy', value: 80 },
]

function GlowingDot(props) {
  const { cx, cy } = props
  if (cx == null || cy == null) return null

  return (
    <g>
      <circle cx={cx} cy={cy} r="7" fill="#E61C38" opacity="0.35" />
      <circle cx={cx} cy={cy} r="3.5" fill="#ffffff" />
      <circle
        cx={cx}
        cy={cy}
        r="3.5"
        fill="none"
        stroke="#ff6b88"
        strokeWidth="1"
        opacity="0.9"
      />
    </g>
  )
}

export default function GenreRadarChart({
  data = GENRE_RADAR_DATA,
  glowId = 'radar-neon-glow',
}) {
  return (
    <div className="genre-radar relative h-[510px] w-full sm:h-[600px] lg:h-[660px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="52%" outerRadius="68%">
          <defs>
            <filter
              id={glowId}
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
            >
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <PolarGrid
            stroke="#3a3a3a"
            strokeWidth={1}
            gridType="polygon"
            radialLines
          />
          <PolarAngleAxis
            dataKey="category"
            tick={{
              fill: '#f5f5f5',
              fontSize: 12,
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
            }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Mix"
            dataKey="value"
            stroke="#ff2d55"
            fill="#E61C38"
            fillOpacity={0.12}
            strokeWidth={2.5}
            isAnimationActive
            dot={<GlowingDot />}
            activeDot={false}
            style={{ filter: `url(#${glowId})` }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

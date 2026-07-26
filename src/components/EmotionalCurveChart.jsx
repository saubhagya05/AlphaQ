import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

// Placeholder arc shown until a real series is linked (no backend call made).
const DEFAULT_EMOTIONS = [
  { key: 'tension', label: 'Tension' },
  { key: 'melancholy', label: 'Melancholy' },
  { key: 'hope', label: 'Hope' },
]

const DEFAULT_POINTS = [
  { beat: 'E1', tension: 30, melancholy: 45, hope: 20 },
  { beat: 'E2', tension: 48, melancholy: 55, hope: 18 },
  { beat: 'E3', tension: 65, melancholy: 50, hope: 28 },
  { beat: 'E4', tension: 85, melancholy: 62, hope: 35 },
  { beat: 'E5', tension: 95, melancholy: 40, hope: 68 },
]

// Assigned by position, not by name — the backend picks story-specific
// emotion labels (e.g. "Betrayal", "Longing"), so colors can't be keyed off
// fixed English words like "tension"/"hope" anymore.
const PALETTE = ['#E61C38', '#60a5fa', '#4ade80', '#facc15', '#c084fc']

/**
 * Renders the top-N tracked emotions across the episode plan.
 *
 * Pass `emotions` (list of {key, label}) + `points` (list of {beat, [key]: 0-100})
 * from the real POCKET_FM `/studio/series/{id}/emotional-curve` response to
 * chart a live series. With no props, it falls back to illustrative mock data
 * so existing call sites keep working before a real series is linked.
 */
export default function EmotionalCurveChart({
  emotions,
  points,
  idPrefix = 'plot-curve',
}) {
  const series = useMemo(() => {
    const list = emotions?.length ? emotions : DEFAULT_EMOTIONS
    return list.map((emotion, i) => ({ ...emotion, color: PALETTE[i % PALETTE.length] }))
  }, [emotions])

  const data = points?.length ? points : DEFAULT_POINTS

  return (
    <div>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              {series.map((s) => (
                <linearGradient key={s.key} id={`${idPrefix}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke="#1f1f1f" strokeDasharray="3 3" />
            <XAxis
              dataKey="beat"
              tick={{ fill: '#737373', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis hide domain={[0, 100]} />
            {series.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                fill={`url(#${idPrefix}-${s.key})`}
                strokeWidth={2.5}
                dot={{ r: 2.5, fill: s.color, strokeWidth: 0 }}
                activeDot={false}
                isAnimationActive
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-neutral-500">
        {series.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}

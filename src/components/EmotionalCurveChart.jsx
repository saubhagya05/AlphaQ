import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

// Emotional curve across the entire plot, beat = episode
const PLOT_EMOTION_DATA = [
  { beat: 'E1', tension: 30, melancholy: 45, hope: 20 },
  { beat: 'E2', tension: 48, melancholy: 55, hope: 18 },
  { beat: 'E3', tension: 65, melancholy: 50, hope: 28 },
  { beat: 'E4', tension: 85, melancholy: 62, hope: 35 },
  { beat: 'E5', tension: 95, melancholy: 40, hope: 68 },
]

export default function EmotionalCurveChart({
  data = PLOT_EMOTION_DATA,
  idPrefix = 'plot-curve',
}) {
  return (
    <div>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`${idPrefix}-tension`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E61C38" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#E61C38" stopOpacity={0} />
              </linearGradient>
              <linearGradient id={`${idPrefix}-melancholy`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.32} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id={`${idPrefix}-hope`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
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
            <Area
              type="monotone"
              dataKey="tension"
              stroke="#E61C38"
              fill={`url(#${idPrefix}-tension)`}
              strokeWidth={2.5}
              dot={{ r: 2.5, fill: '#E61C38', strokeWidth: 0 }}
              activeDot={false}
              isAnimationActive
            />
            <Area
              type="monotone"
              dataKey="melancholy"
              stroke="#60a5fa"
              fill={`url(#${idPrefix}-melancholy)`}
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#60a5fa', strokeWidth: 0 }}
              activeDot={false}
              isAnimationActive
            />
            <Area
              type="monotone"
              dataKey="hope"
              stroke="#4ade80"
              fill={`url(#${idPrefix}-hope)`}
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#4ade80', strokeWidth: 0 }}
              activeDot={false}
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-neutral-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#E61C38]" /> Tension
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Melancholy
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Hope
        </span>
      </div>
    </div>
  )
}

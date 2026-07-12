import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function DailyVolumeLineChart({ data }: { data: { date: string; count: number }[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-ink-muted">No email volume yet.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
        <CartesianGrid stroke="#dadce0" vertical={false} />
        <XAxis dataKey="date" stroke="#80868b" fontSize={12} tickLine={false} />
        <YAxis stroke="#80868b" fontSize={12} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: '#ffffff', border: '1px solid #dadce0', borderRadius: 8 }}
          itemStyle={{ color: '#202124' }}
        />
        <Line type="monotone" dataKey="count" stroke="#1a73e8" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

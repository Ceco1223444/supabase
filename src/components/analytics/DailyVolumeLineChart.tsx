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
        <CartesianGrid stroke="#2c2c2a" vertical={false} />
        <XAxis dataKey="date" stroke="#898781" fontSize={12} tickLine={false} />
        <YAxis stroke="#898781" fontSize={12} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: '#1a1a19', border: '1px solid #2c2c2a', borderRadius: 8 }}
          itemStyle={{ color: '#ffffff' }}
        />
        <Line type="monotone" dataKey="count" stroke="#3987e5" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

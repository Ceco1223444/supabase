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
        <CartesianGrid stroke="#efece4" vertical={false} />
        <XAxis dataKey="date" stroke="#8b8578" fontSize={12} tickLine={false} />
        <YAxis stroke="#8b8578" fontSize={12} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: '#ffffff',
            border: '1px solid #efece4',
            borderRadius: 12,
            boxShadow: '0 4px 16px rgb(62 55 38 / 0.08)',
          }}
          itemStyle={{ color: '#201e19' }}
        />
        <Line type="monotone" dataKey="count" stroke="#1a73e8" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

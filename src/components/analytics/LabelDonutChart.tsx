import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { CATEGORY_HEX, CATEGORY_ORDER } from '@/lib/categoryColors'

export function LabelDonutChart({ counts }: { counts: Record<string, number> }) {
  const data = CATEGORY_ORDER.filter((label) => counts[label] > 0).map((label) => ({
    name: label,
    value: counts[label],
  }))

  if (data.length === 0) {
    return <p className="text-sm text-ink-muted">No categorized emails yet.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={CATEGORY_HEX[entry.name]} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: '#1a1a19', border: '1px solid #2c2c2a', borderRadius: 8 }}
          itemStyle={{ color: '#ffffff' }}
        />
        <Legend wrapperStyle={{ color: '#c3c2b7', fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

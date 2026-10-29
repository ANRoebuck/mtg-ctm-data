import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Panel } from './Panel'
import { LoadingSpinner } from './LoadingSpinner'
import { ConnectionWarning } from './ConnectionWarning'
import type { CountsByDate } from '../types'

interface Props {
  title: string
  label: string
  data: CountsByDate | null
  loading: boolean
  error: string | null
}

// Dates arrive as UTC YYYY-MM-DD strings, oldest first
function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', timeZone: 'UTC' })
}

export function CountsByDatePanel({ title, label, data, loading, error }: Props) {
  const points = data ? Object.entries(data).map(([date, count]) => ({ date, count })) : []
  const total = points.reduce((s, p) => s + p.count, 0)
  const average = points.length > 0 ? total / points.length : 0

  return (
    <Panel title={title}>
      {total > 0 && <p className="total-label">Total: <strong>{total}</strong> {label.toLowerCase()} · Average: <strong>{average.toFixed(1)}</strong> per day</p>}

      {loading && <LoadingSpinner />}
      {error && <ConnectionWarning message={error} />}

      {!loading && !error && data && total === 0 && (
        <p className="empty-state">No {label.toLowerCase()} in this period.</p>
      )}

      {total > 0 && (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={points} margin={{ left: 4, right: 20, top: 4, bottom: 4 }}>
            <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} minTickGap={16} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={32} />
            <Tooltip labelFormatter={(d) => formatDate(String(d))} formatter={(val) => [val, label]} />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <ReferenceLine y={average} stroke="var(--warn)" strokeDasharray="4 4" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Panel>
  )
}

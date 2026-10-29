import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Panel } from './Panel'
import { LoadingSpinner } from './LoadingSpinner'
import { ConnectionWarning } from './ConnectionWarning'
import type { CountsByDate } from '../types'

interface Props {
  title: string
  searches: CountsByDate | null
  clickThroughs: CountsByDate | null
  loading: boolean
  error: string | null
}

// Dates arrive as UTC YYYY-MM-DD strings, oldest first
function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', timeZone: 'UTC' })
}

export function ClickThroughRatePanel({ title, searches, clickThroughs, loading, error }: Props) {
  const points = searches && clickThroughs
    ? Object.entries(searches).map(([date, searchCount]) => {
        const clicks = clickThroughs[date] ?? 0
        // Days with no searches have no meaningful rate, so leave a gap rather than plotting 0
        return { date, searchCount, clicks, rate: searchCount > 0 ? (clicks / searchCount) * 100 : null }
      })
    : []
  const totalSearches = points.reduce((s, p) => s + p.searchCount, 0)
  const totalClicks = points.reduce((s, p) => s + p.clicks, 0)
  const overall = totalSearches > 0 ? (totalClicks / totalSearches) * 100 : 0

  return (
    <Panel title={title}>
      {totalSearches > 0 && (
        <p className="total-label">Average: <strong>{overall.toFixed(1)}%</strong> of searches led to a click-through</p>
      )}

      {loading && <LoadingSpinner />}
      {error && <ConnectionWarning message={error} />}

      {!loading && !error && searches && clickThroughs && totalSearches === 0 && (
        <p className="empty-state">No searches in this period.</p>
      )}

      {totalSearches > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={points} margin={{ left: 4, right: 20, top: 4, bottom: 4 }}>
            <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} minTickGap={16} />
            <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} width={44} />
            <Tooltip
              labelFormatter={(d) => formatDate(String(d))}
              formatter={(val, _name, item) => {
                const { clicks, searchCount } = item.payload as { clicks: number; searchCount: number }
                return [`${Number(val).toFixed(1)}% (${clicks} / ${searchCount})`, 'Click-through rate']
              }}
            />
            <ReferenceLine y={overall} stroke="var(--warn)" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={2} dot={{ r: 2 }} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Panel>
  )
}

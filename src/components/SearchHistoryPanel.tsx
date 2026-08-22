import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Panel } from './Panel'
import { LoadingSpinner } from './LoadingSpinner'
import { ConnectionWarning } from './ConnectionWarning'
import type { SearchHistoryEntry } from '../types'

const DAY_OPTIONS = [
  { label: 'All time', value: undefined },
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
]

interface Props {
  history: SearchHistoryEntry[] | null
  loading: boolean
  error: string | null
  days: number | undefined
  onDaysChange: (days: number | undefined) => void
  topN: number
  onTopNChange: (n: number) => void
}

export function SearchHistoryPanel({ history, loading, error, days, onDaysChange, topN, onTopNChange }: Props) {
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const visible = history ? history.slice(0, topN) : []

  return (
    <Panel title="Search History">
      <div className="panel-controls">
        <div className="control-group">
          <label>Period</label>
          <div className="btn-group">
            {DAY_OPTIONS.map(opt => (
              <button
                key={opt.label}
                className={`btn-small ${days === opt.value ? 'active' : ''}`}
                onClick={() => onDaysChange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="control-group">
          <label>Show top</label>
          <select value={topN} onChange={e => onTopNChange(Number(e.target.value))} className="select-small">
            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="control-group">
          <label>View</label>
          <div className="btn-group">
            <button className={`btn-small ${view === 'chart' ? 'active' : ''}`} onClick={() => setView('chart')}>Chart</button>
            <button className={`btn-small ${view === 'table' ? 'active' : ''}`} onClick={() => setView('table')}>Table</button>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ConnectionWarning message={error} />}

      {!loading && !error && visible.length === 0 && (
        <p className="empty-state">No search history found.</p>
      )}

      {visible.length > 0 && view === 'chart' && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={visible} layout="vertical" margin={{ left: 120, right: 20, top: 4, bottom: 4 }}>
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="term" width={120} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(val) => [val, 'Searches']} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {visible.map((_, i) => (
                <Cell key={i} fill={`hsl(${220 + i * 8}, 70%, ${55 - i * 2}%)`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {visible.length > 0 && view === 'table' && (
        <table className="data-table">
          <thead>
            <tr><th>Term</th><th>Searches</th><th>Last searched</th></tr>
          </thead>
          <tbody>
            {visible.map(row => (
              <tr key={row.term}>
                <td>{row.term}</td>
                <td>{row.count}</td>
                <td>{new Date(row.lastSearchedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  )
}

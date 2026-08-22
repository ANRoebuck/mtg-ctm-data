import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Panel } from './Panel'
import { LoadingSpinner } from './LoadingSpinner'
import { ConnectionWarning } from './ConnectionWarning'
import type { ClickThroughEntry, ClickThroughBySeller } from '../types'

const DAY_OPTIONS = [
  { label: 'All time', value: undefined },
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
]

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#f5f3ff', '#4f46e5']

interface Props {
  allSellers: ClickThroughEntry[] | null
  allSellersLoading: boolean
  allSellersError: string | null
  bySeller: ClickThroughBySeller[] | null
  bySellerLoading: boolean
  bySellerError: string | null
  days: number | undefined
  onDaysChange: (days: number | undefined) => void
  topN: number
  onTopNChange: (n: number) => void
}

export function CardsBySellerPanel({
  allSellers, allSellersLoading, allSellersError,
  bySeller, bySellerLoading, bySellerError,
  days, onDaysChange, topN, onTopNChange,
}: Props) {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar')
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null)

  const isAllSellers = selectedSeller == null
  const cards = isAllSellers ? allSellers : bySeller?.find(d => d.seller === selectedSeller)?.cards ?? []
  const loading = isAllSellers ? allSellersLoading : bySellerLoading
  const error = isAllSellers ? allSellersError : bySellerError

  const visible = cards ? cards.slice(0, topN) : []
  const total = visible.reduce((s, d) => s + d.count, 0)

  return (
    <Panel title={isAllSellers ? 'Click-throughs by Card' : `Click-throughs by Card — ${selectedSeller}`}>
      <div className="panel-controls">
        <div className="control-group">
          <label>Seller</label>
          <select
            value={selectedSeller ?? ''}
            onChange={e => setSelectedSeller(e.target.value === '' ? null : e.target.value)}
            className="select-small"
          >
            <option value="">All sellers</option>
            {bySeller?.map(d => (
              <option key={d.seller} value={d.seller}>{d.seller}</option>
            ))}
          </select>
        </div>
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
            {[5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="control-group">
          <label>Chart</label>
          <div className="btn-group">
            <button className={`btn-small ${chartType === 'bar' ? 'active' : ''}`} onClick={() => setChartType('bar')}>Bar</button>
            <button className={`btn-small ${chartType === 'pie' ? 'active' : ''}`} onClick={() => setChartType('pie')}>Pie</button>
          </div>
        </div>
      </div>

      {total > 0 && <p className="total-label">Total: <strong>{total}</strong> click-throughs</p>}

      {loading && <LoadingSpinner />}
      {error && <ConnectionWarning message={error} />}

      {!loading && !error && visible.length === 0 && (
        <p className="empty-state">No click-through data found{isAllSellers ? '' : ` for ${selectedSeller}`}.</p>
      )}

      {visible.length > 0 && chartType === 'bar' && (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={visible} layout="vertical" margin={{ left: 120, right: 20, top: 4, bottom: 4 }}>
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(val) => [val, 'Click-throughs']} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {visible.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {visible.length > 0 && chartType === 'pie' && (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={visible} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
              {visible.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip formatter={(val) => [val, 'Click-throughs']} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Panel>
  )
}

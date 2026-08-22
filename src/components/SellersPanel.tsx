import { Panel } from './Panel'
import { LoadingSpinner } from './LoadingSpinner'
import { ConnectionWarning } from './ConnectionWarning'
import type { Seller, HealthCheckResult } from '../types'

const REGION_ORDER = ['UK', 'Europe', 'North America', 'Rest of World']

interface Props {
  sellers: Seller[] | null
  loading: boolean
  error: string | null
  health: HealthCheckResult | null
  healthLoading: boolean
  healthError: string | null
  onRecheck: () => void
}

export function SellersPanel({ sellers, loading, error, health, healthLoading, healthError, onRecheck }: Props) {
  const grouped = sellers
    ? REGION_ORDER.reduce<Record<string, Seller[]>>((acc, region) => {
        const inRegion = sellers.filter(s => s.region === region)
        if (inRegion.length) acc[region] = inRegion
        return acc
      }, {})
    : {}

  return (
    <Panel title="Sellers">
      {sellers && (
        <div className="panel-controls">
          <button className="btn-reload" onClick={onRecheck} disabled={healthLoading}>
            {healthLoading ? 'Checking…' : 'Recheck health'}
          </button>
          <span className="hint">Tests each seller with a known card search</span>
        </div>
      )}

      {loading && <LoadingSpinner />}
      {error && <ConnectionWarning message={error} />}

      {sellers && (
        <div className="sellers-grid">
          {Object.entries(grouped).map(([region, list]) => (
            <div key={region} className="seller-region">
              <h3 className="region-label">{region}</h3>
              <ul className="seller-list">
                {list.map(s => {
                  const result = health?.[s.name]
                  const statusClass = result ? (result.status === 'ok' ? 'ok' : 'fail') : ''
                  return (
                    <li key={s.name} className={`seller-item ${statusClass}`}>
                      <div className="seller-item-main">
                        <span className="seller-name">{s.name}</span>
                        <span className="seller-status-icon">
                          {result && <span className="health-status-dot" />}
                          {!result && healthLoading && (
                            <span className="spinner-inline" aria-label="Checking seller health" />
                          )}
                        </span>
                        <span className="health-status-label">{result ? result.status : ''}</span>
                      </div>
                      {result?.status === 'ok' && (
                        <div className="health-detail">
                          {result.resultCount} results for "{result.searchTerm}"
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
          {healthError && <p className="health-warning">⚠ Health check unavailable: {healthError}</p>}
        </div>
      )}
    </Panel>
  )
}

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
  onCheck: () => void
}

function isHealthy(health: HealthCheckResult | null, name: string): boolean {
  return health?.[name]?.status === 'ok'
}

function bySellerHealth(health: HealthCheckResult | null) {
  return (a: Seller, b: Seller): number => {
    const aOk = isHealthy(health, a.name)
    const bOk = isHealthy(health, b.name)
    if (aOk !== bOk) return aOk ? 1 : -1
    return a.name.localeCompare(b.name)
  }
}

export function SellersPanel({ sellers, loading, error, health, healthLoading, healthError, onCheck }: Props) {
  const grouped = sellers
    ? REGION_ORDER.reduce<Record<string, Seller[]>>((acc, region) => {
        const inRegion = sellers
          .filter(s => s.region === region)
          .sort(bySellerHealth(health))
        if (inRegion.length) acc[region] = inRegion
        return acc
      }, {})
    : {}

  const healthyCount = sellers?.filter(s => isHealthy(health, s.name)).length ?? 0

  return (
    <Panel id="sellers" title="Health Status">
      {sellers && (
        <div className="panel-controls">
          <button className="btn-reload" onClick={onCheck} disabled={healthLoading}>
            {healthLoading ? 'Checking…' : 'Check health'}
          </button>
        </div>
      )}

      {sellers && health && (
        <p className="total-label">
          <strong>{healthyCount}</strong> out of <strong>{sellers.length}</strong> sellers are healthy
        </p>
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
                          <span className="health-detail-text">
                            {result.resultCount} results for "{result.searchTerm}"
                          </span>
                          <span className="health-elapsed">{result.elapsedMs}ms</span>
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

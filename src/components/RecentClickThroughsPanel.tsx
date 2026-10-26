import { Panel } from './Panel'
import { LoadingSpinner } from './LoadingSpinner'
import { ConnectionWarning } from './ConnectionWarning'
import type { RecentClickThrough } from '../types'

interface Props {
  data: RecentClickThrough[] | null
  loading: boolean
  error: string | null
}

export function RecentClickThroughsPanel({ data, loading, error }: Props) {
  return (
    <Panel title="Last 20 Click-throughs">
      {loading && <LoadingSpinner />}
      {error && <ConnectionWarning message={error} />}

      {!loading && !error && data?.length === 0 && (
        <p className="empty-state">No recent click-throughs found.</p>
      )}

      {data && data.length > 0 && (
        <table className="data-table">
          <thead>
            <tr><th>Card</th><th>Seller</th><th>Clicked</th></tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={`${row.clickedAt}-${i}`}>
                <td>{row.card}</td>
                <td>{row.seller}</td>
                <td>{new Date(row.clickedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  )
}

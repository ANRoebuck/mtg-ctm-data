import { Panel } from './Panel'
import { LoadingSpinner } from './LoadingSpinner'
import { ConnectionWarning } from './ConnectionWarning'
import type { RecentSearch } from '../types'

interface Props {
  data: RecentSearch[] | null
  loading: boolean
  error: string | null
}

export function RecentSearchesPanel({ data, loading, error }: Props) {
  return (
    <Panel title="Last 20 Searches">
      {loading && <LoadingSpinner />}
      {error && <ConnectionWarning message={error} />}

      {!loading && !error && data?.length === 0 && (
        <p className="empty-state">No recent searches found.</p>
      )}

      {data && data.length > 0 && (
        <table className="data-table">
          <thead>
            <tr><th>Term</th><th>Searched</th></tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={`${row.searchedAt}-${i}`}>
                <td>{row.term}</td>
                <td>{new Date(row.searchedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  )
}

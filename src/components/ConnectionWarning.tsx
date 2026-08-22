import { BASE_URL } from '../config'

interface Props {
  message?: string
}

export function ConnectionWarning({ message }: Props) {
  return (
    <div className="connection-warning">
      <span className="warning-icon">⚠</span>
      <div>
        <strong>Cannot connect to backend</strong>
        <p>Failed to reach <code>{BASE_URL}</code>. {message && <span>{message}</span>}</p>
        <p>Make sure the mtg-ctm-be server is running, or enable <strong>Mock Data</strong> to explore with test data.</p>
      </div>
    </div>
  )
}

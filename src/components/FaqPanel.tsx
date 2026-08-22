import { useState } from 'react'
import { Panel } from './Panel'
import { LoadingSpinner } from './LoadingSpinner'
import { ConnectionWarning } from './ConnectionWarning'
import type { FaqItem } from '../types'

interface Props {
  faq: FaqItem[] | null
  loading: boolean
  error: string | null
}

export function FaqPanel({ faq, loading, error }: Props) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <Panel title="FAQ">
      {loading && <LoadingSpinner />}
      {error && <ConnectionWarning message={error} />}
      {faq && (
        <dl className="faq-list">
          {faq.map((item, i) => (
            <div key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
              <dt className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
                <span>{item.title}</span>
                <span className="faq-chevron">{open === i ? '▲' : '▼'}</span>
              </dt>
              {open === i && <dd className="faq-answer">{item.body}</dd>}
            </div>
          ))}
        </dl>
      )}
    </Panel>
  )
}

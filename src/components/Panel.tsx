import { useState, type ReactNode } from 'react'

interface Props {
  title: string
  id?: string
  children: ReactNode
  className?: string
}

const COLLAPSED_KEY_PREFIX = 'mtg-ctm-panel-collapsed:'

function readCollapsed(key: string): boolean {
  try {
    return localStorage.getItem(COLLAPSED_KEY_PREFIX + key) === 'true'
  } catch {
    return false
  }
}

export function Panel({ title, id, children, className = '' }: Props) {
  const storageKey = id ?? title
  const [collapsed, setCollapsed] = useState(() => readCollapsed(storageKey))

  const toggle = () => {
    setCollapsed(prev => {
      const next = !prev
      try {
        localStorage.setItem(COLLAPSED_KEY_PREFIX + storageKey, String(next))
      } catch {
        // localStorage unavailable — collapse state just won't persist
      }
      return next
    })
  }

  return (
    <section className={`panel ${collapsed ? 'collapsed' : ''} ${className}`}>
      <h2 className="panel-title-row">
        <button type="button" className="panel-title-toggle" onClick={toggle} aria-expanded={!collapsed}>
          <span className="panel-title">{title}</span>
          <span className={`panel-chevron ${collapsed ? 'collapsed' : ''}`} aria-hidden="true">▾</span>
        </button>
      </h2>
      {!collapsed && <div className="panel-body">{children}</div>}
    </section>
  )
}

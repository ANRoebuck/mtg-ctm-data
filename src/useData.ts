import { useState, useEffect, useCallback } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface UseDataResult<T> {
  data: T | null
  status: Status
  error: string | null
  reload: () => void
}

export function useData<T>(fetcher: () => Promise<T>, deps: unknown[] = []): UseDataResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const reload = useCallback(() => setTick(t => t + 1), [])

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setError(null)
    fetcher()
      .then(result => {
        if (!cancelled) {
          setData(result)
          setStatus('success')
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error')
          setStatus('error')
        }
      })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps])

  return { data, status, error, reload }
}

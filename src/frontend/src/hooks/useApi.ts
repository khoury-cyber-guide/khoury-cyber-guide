import { useCallback, useEffect, useRef, useState } from 'react'

export interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useApi<T>(fetcher: (signal: AbortSignal) => Promise<T>): ApiState<T> {
  const [state, setState] = useState<Omit<ApiState<T>, 'refetch'>>({
    data: null,
    loading: true,
    error: null,
  })
  const [tick, setTick] = useState(0)

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  useEffect(() => {
    const controller = new AbortController()
    setState((s) => ({ ...s, loading: true, error: null }))

    fetcherRef.current(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ data, loading: false, error: null })
        }
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          const message = err instanceof Error ? err.message : 'An error occurred'
          setState((s) => ({ ...s, data: null, loading: false, error: message }))
        }
      })

    return () => controller.abort()
  }, [tick])

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  return { ...state, refetch }
}

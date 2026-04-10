import { useEffect, useRef } from 'react'

export function usePolling(
  callback: () => void | Promise<void>,
  intervalMs: number,
  enabled: boolean = true,
): void {
  const savedCallback = useRef(callback)
  savedCallback.current = callback

  useEffect(() => {
    if (!enabled) return
    void savedCallback.current()
    const id = setInterval(() => void savedCallback.current(), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, enabled])
}

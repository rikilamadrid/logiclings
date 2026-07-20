import { useEffect, useRef, useState } from 'react'
import { registerSW } from 'virtual:pwa-register'

interface ServiceWorkerUpdateState {
  needsRefresh: boolean
  applyUpdate: () => void
  dismiss: () => void
}

export function useServiceWorkerUpdate(): ServiceWorkerUpdateState {
  const [needsRefresh, setNeedsRefresh] = useState(false)
  const updateServiceWorkerRef = useRef<
    ((reloadPage?: boolean) => Promise<void>) | null
  >(null)

  useEffect(() => {
    updateServiceWorkerRef.current = registerSW({
      onNeedRefresh: () => setNeedsRefresh(true),
    })
  }, [])

  return {
    needsRefresh,
    applyUpdate: () => {
      void updateServiceWorkerRef.current?.(true)
    },
    dismiss: () => setNeedsRefresh(false),
  }
}

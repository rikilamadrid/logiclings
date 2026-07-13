import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function getInitialReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(QUERY).matches
}

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(getInitialReducedMotion)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mediaQueryList = window.matchMedia(QUERY)
    const handleChange = () => setReducedMotion(mediaQueryList.matches)

    mediaQueryList.addEventListener('change', handleChange)
    return () => mediaQueryList.removeEventListener('change', handleChange)
  }, [])

  return reducedMotion
}

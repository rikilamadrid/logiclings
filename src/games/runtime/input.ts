import type { KeyboardEvent } from 'react'

/**
 * Normalizes keyboard/touch/click activation for elements that aren't a
 * native <button>, so mini-games don't each reimplement input handling.
 */
export function usePressable(onActivate: () => void) {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onActivate()
    }
  }

  return {
    role: 'button' as const,
    tabIndex: 0,
    onClick: onActivate,
    onKeyDown: handleKeyDown,
  }
}

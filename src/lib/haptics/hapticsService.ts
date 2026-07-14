export type HapticCue = 'tap' | 'place' | 'success' | 'mistake' | 'exceeded'

/**
 * Centralized haptics seam. No-op until Capacitor Haptics lands (feature 12) —
 * mini-games call this now so the real implementation is a drop-in swap later.
 */
class HapticsService {
  trigger(cue: HapticCue): void {
    // Intentionally no-op: native haptics arrive with the Capacitor shell.
    void cue
  }
}

export const hapticsService = new HapticsService()

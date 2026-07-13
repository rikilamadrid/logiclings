export type SoundCue =
  | 'tap'
  | 'place'
  | 'valid'
  | 'invalid'
  | 'success'
  | 'mistake'
  | 'streak'

interface ToneShape {
  frequency: number
  durationMs: number
}

const CUE_TONES: Record<SoundCue, ToneShape> = {
  tap: { frequency: 440, durationMs: 60 },
  place: { frequency: 392, durationMs: 90 },
  valid: { frequency: 587, durationMs: 90 },
  invalid: { frequency: 220, durationMs: 140 },
  success: { frequency: 659, durationMs: 220 },
  mistake: { frequency: 196, durationMs: 220 },
  streak: { frequency: 784, durationMs: 180 },
}

/**
 * Centralized sound-cue service so every mini-game triggers audio through one
 * mockable/disableable seam instead of touching Web Audio directly.
 * Synthesizes short tones rather than loading sample files, per the stack's
 * "Howler.js or a small Web Audio abstraction" default.
 */
class AudioService {
  private enabled = true
  private context: AudioContext | null = null

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  isEnabled(): boolean {
    return this.enabled
  }

  play(cue: SoundCue): void {
    if (!this.enabled) return

    const context = this.getContext()
    if (!context) return

    const { frequency, durationMs } = CUE_TONES[cue]
    const oscillator = context.createOscillator()
    const gain = context.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.001, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.15, context.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + durationMs / 1000)

    oscillator.connect(gain)
    gain.connect(context.destination)

    oscillator.start()
    oscillator.stop(context.currentTime + durationMs / 1000)
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null

    const AudioContextClass =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

    if (!AudioContextClass) return null

    if (!this.context) {
      this.context = new AudioContextClass()
    }

    return this.context
  }
}

export const audioService = new AudioService()

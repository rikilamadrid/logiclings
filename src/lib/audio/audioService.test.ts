import { describe, expect, it } from 'vitest'
import { audioService } from './audioService'

describe('audioService', () => {
  it('defaults to enabled', () => {
    expect(audioService.isEnabled()).toBe(true)
  })

  it('can be disabled and re-enabled', () => {
    audioService.setEnabled(false)
    expect(audioService.isEnabled()).toBe(false)

    audioService.setEnabled(true)
    expect(audioService.isEnabled()).toBe(true)
  })

  it('does not throw when playing while disabled or without Web Audio support', () => {
    audioService.setEnabled(false)
    expect(() => audioService.play('tap')).not.toThrow()

    audioService.setEnabled(true)
    expect(() => audioService.play('success')).not.toThrow()
  })
})

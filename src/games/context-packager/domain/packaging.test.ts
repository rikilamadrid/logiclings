import { describe, expect, it } from 'vitest'
import { simulatePackaging, totalCostOf, type PackagingScenario } from './packaging'

const scenario: PackagingScenario = {
  taskPrompt: 'Fix the bug where discount codes do not apply at checkout.',
  budget: 50,
  idealIncludedIds: ['checkout-service', 'discount-spec'],
  items: [
    { id: 'checkout-service', label: 'checkout-service.ts', description: '', category: 'relevant-file', cost: 20 },
    { id: 'onboarding-flow', label: 'onboarding-flow.tsx', description: '', category: 'unrelated-file', cost: 15 },
    { id: 'discount-spec', label: 'Discount Rules Spec', description: '', category: 'spec-snippet', cost: 15 },
    { id: 'old-notes', label: 'Q1 Planning Notes', description: '', category: 'stale-note', cost: 10 },
  ],
}

describe('totalCostOf', () => {
  it('sums the cost of only the packed items', () => {
    expect(totalCostOf(['checkout-service', 'discount-spec'], scenario.items)).toBe(35)
  })

  it('returns 0 for an empty pack', () => {
    expect(totalCostOf([], scenario.items)).toBe(0)
  })
})

describe('simulatePackaging', () => {
  it('grades a pack that exactly matches the ideal set as correct with full quality', () => {
    const result = simulatePackaging({ scenario, packedIds: ['checkout-service', 'discount-spec'] })

    expect(result.correct).toBe(true)
    expect(result.qualityScore).toBe(100)
    expect(result.overBudget).toBe(false)
    expect(result.missingIds).toEqual([])
    expect(result.extraneousIds).toEqual([])
  })

  it('penalizes and marks incorrect when an essential item is left out', () => {
    const result = simulatePackaging({ scenario, packedIds: ['checkout-service'] })

    expect(result.correct).toBe(false)
    expect(result.missingIds).toEqual(['discount-spec'])
    expect(result.qualityScore).toBe(70)
  })

  it('penalizes and marks incorrect when an unrelated item is packed alongside the ideal set', () => {
    const result = simulatePackaging({
      scenario,
      packedIds: ['checkout-service', 'discount-spec', 'old-notes'],
    })

    expect(result.correct).toBe(false)
    expect(result.extraneousIds).toEqual(['old-notes'])
    expect(result.qualityScore).toBe(85)
  })

  it('flags overBudget and applies its penalty when packed cost exceeds the budget', () => {
    const result = simulatePackaging({
      scenario,
      packedIds: ['checkout-service', 'onboarding-flow', 'discount-spec', 'old-notes'],
    })

    expect(result.totalCost).toBe(60)
    expect(result.overBudget).toBe(true)
    expect(result.qualityScore).toBeLessThan(70)
  })

  it('clamps quality score at 0 rather than going negative', () => {
    const result = simulatePackaging({ scenario, packedIds: [] })

    expect(result.qualityScore).toBeGreaterThanOrEqual(0)
  })
})

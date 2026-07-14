import { describe, expect, it } from 'vitest'
import { isSameIdSet, simulateCacheWave, type CacheScenario } from './cache'

describe('simulateCacheWave', () => {
  const scenario: CacheScenario = {
    ttlOptions: [3, 8],
    requests: [
      { id: 'r1', visitorLabel: 'V1', resourceId: 'poster', resourceLabel: 'Poster', tick: 0 },
      { id: 'r2', visitorLabel: 'V2', resourceId: 'poster', resourceLabel: 'Poster', tick: 1 },
      { id: 'r3', visitorLabel: 'V3', resourceId: 'schedule', resourceLabel: 'Schedule', tick: 2 },
      { id: 'r4', visitorLabel: 'V4', resourceId: 'poster', resourceLabel: 'Poster', tick: 6 },
    ],
  }

  it('treats the first request for a resource as a miss', () => {
    const result = simulateCacheWave({ scenario, ttl: 3, invalidateAtTick: null })
    expect(result.missIds).toContain('r1')
  })

  it('treats a repeat request inside the TTL window as a hit', () => {
    const result = simulateCacheWave({ scenario, ttl: 3, invalidateAtTick: null })
    expect(result.hitIds).toContain('r2')
  })

  it('treats a repeat request past TTL expiry as a miss', () => {
    const result = simulateCacheWave({ scenario, ttl: 3, invalidateAtTick: null })
    expect(result.missIds).toEqual(['r1', 'r3', 'r4'])
    expect(result.hitIds).toEqual(['r2'])
  })

  it('turns a would-be miss into a hit when the TTL is long enough to still cover it', () => {
    const result = simulateCacheWave({ scenario, ttl: 8, invalidateAtTick: null })
    expect(result.hitIds).toEqual(['r2', 'r4'])
    expect(result.missIds).toEqual(['r1', 'r3'])
  })

  it('forces every request after the invalidation tick to miss until re-cached', () => {
    const burst: CacheScenario = {
      ttlOptions: [10],
      invalidationTickOptions: [0, 4],
      requests: [
        { id: 'r1', visitorLabel: 'V1', resourceId: 'ticket', resourceLabel: 'Ticket', tick: 0 },
        { id: 'r2', visitorLabel: 'V2', resourceId: 'poster', resourceLabel: 'Poster', tick: 1 },
        { id: 'r3', visitorLabel: 'V3', resourceId: 'map', resourceLabel: 'Map', tick: 2 },
        { id: 'r4', visitorLabel: 'V4', resourceId: 'ticket', resourceLabel: 'Ticket', tick: 4 },
        { id: 'r5', visitorLabel: 'V5', resourceId: 'poster', resourceLabel: 'Poster', tick: 4 },
        { id: 'r6', visitorLabel: 'V6', resourceId: 'map', resourceLabel: 'Map', tick: 4 },
        { id: 'r7', visitorLabel: 'V7', resourceId: 'ticket', resourceLabel: 'Ticket', tick: 5 },
      ],
    }

    const safe = simulateCacheWave({ scenario: burst, ttl: 10, invalidateAtTick: 0 })
    expect(safe.missIds).toEqual(['r1', 'r2', 'r3'])

    const mistimed = simulateCacheWave({ scenario: burst, ttl: 10, invalidateAtTick: 4 })
    expect(mistimed.missIds).toEqual(['r1', 'r2', 'r3', 'r4', 'r5', 'r6'])
    expect(mistimed.hitIds).toEqual(['r7'])
    expect(mistimed.peakStrain).toBeGreaterThan(safe.peakStrain)
  })

  it('never lets strain exceed the max even after repeated misses', () => {
    const heavy: CacheScenario = {
      ttlOptions: [1],
      requests: Array.from({ length: 10 }, (_, index) => ({
        id: `r${index}`,
        visitorLabel: `V${index}`,
        resourceId: `resource-${index}`,
        resourceLabel: `Resource ${index}`,
        tick: index,
      })),
    }
    const result = simulateCacheWave({ scenario: heavy, ttl: 1, invalidateAtTick: null })
    expect(result.peakStrain).toBeLessThanOrEqual(100)
  })
})

describe('isSameIdSet', () => {
  it('is true for the same ids regardless of order', () => {
    expect(isSameIdSet(['a', 'b', 'c'], ['c', 'a', 'b'])).toBe(true)
  })

  it('is false when the sets differ in size', () => {
    expect(isSameIdSet(['a', 'b'], ['a', 'b', 'c'])).toBe(false)
  })

  it('is false when the sets differ in membership', () => {
    expect(isSameIdSet(['a', 'b'], ['a', 'c'])).toBe(false)
  })
})

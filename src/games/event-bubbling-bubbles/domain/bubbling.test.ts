import { describe, expect, it } from 'vitest'
import { isSameLayerSet, reactingLayerIds, type BubblingScenario } from './bubbling'

const layers: BubblingScenario['layers'] = [
  { id: 'pod', label: 'Pod' },
  { id: 'habitat', label: 'Habitat' },
  { id: 'planet', label: 'Planet' },
]

describe('reactingLayerIds', () => {
  it('reaches every ancestor layer when nothing stops it', () => {
    expect(reactingLayerIds({ layers, stopLayerId: null })).toEqual([
      'pod',
      'habitat',
      'planet',
    ])
  })

  it('stops after the layer where propagation was halted', () => {
    expect(reactingLayerIds({ layers, stopLayerId: 'habitat' })).toEqual([
      'pod',
      'habitat',
    ])
  })

  it('still reacts at the target layer even when the stop is placed there', () => {
    expect(reactingLayerIds({ layers, stopLayerId: 'pod' })).toEqual(['pod'])
  })

  it('ignores a stop id that is not part of the path', () => {
    expect(reactingLayerIds({ layers, stopLayerId: 'not-a-layer' })).toEqual([
      'pod',
      'habitat',
      'planet',
    ])
  })
})

describe('isSameLayerSet', () => {
  it('is true for equal sets regardless of order', () => {
    expect(isSameLayerSet(['a', 'b', 'c'], ['c', 'a', 'b'])).toBe(true)
  })

  it('is false when lengths differ', () => {
    expect(isSameLayerSet(['a', 'b'], ['a', 'b', 'c'])).toBe(false)
  })

  it('is false when contents differ', () => {
    expect(isSameLayerSet(['a', 'b'], ['a', 'c'])).toBe(false)
  })
})

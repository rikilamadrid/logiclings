export interface BubbleLayer {
  id: string
  label: string
}

/**
 * A propagation path from a tapped layer (index 0) out through its ancestors.
 * `stopLayerId` mirrors `stopPropagation`: the layer it names still reacts,
 * but nothing further outward does. `null` means the pop reaches every layer.
 */
export interface BubblingScenario {
  layers: BubbleLayer[]
  stopLayerId: string | null
}

export function reactingLayerIds(scenario: BubblingScenario): string[] {
  const ids: string[] = []

  for (const layer of scenario.layers) {
    ids.push(layer.id)
    if (layer.id === scenario.stopLayerId) break
  }

  return ids
}

export function isSameLayerSet(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false
  const setB = new Set(b)
  return a.every((id) => setB.has(id))
}

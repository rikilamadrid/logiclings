const STRAIN_DECAY_PER_REQUEST = 10
const STRAIN_COST_PER_MISS = 25
const MAX_STRAIN = 100

export interface CacheRequest {
  id: string
  visitorLabel: string
  resourceId: string
  resourceLabel: string
  tick: number
}

export interface CacheScenario {
  requests: CacheRequest[]
  ttlOptions: number[]
  invalidationTickOptions?: number[]
}

export interface CacheSimulationInput {
  scenario: CacheScenario
  ttl: number
  invalidateAtTick: number | null
}

export interface CacheRequestOutcome {
  id: string
  hit: boolean
  strainAfter: number
}

export interface CacheSimulationResult {
  hitIds: string[]
  missIds: string[]
  outcomesById: Record<string, CacheRequestOutcome>
  peakStrain: number
}

/**
 * Replays a wave of requests against a single-resource-keyed cache with a
 * fixed TTL. An invalidation tick (if set) flushes the whole cache the
 * moment it's reached — if several visitors request the same resource right
 * after, they all miss together instead of one at a time (thundering herd).
 */
export function simulateCacheWave(input: CacheSimulationInput): CacheSimulationResult {
  const { scenario, ttl, invalidateAtTick } = input
  const lastServedAtByResource = new Map<string, number>()
  const outcomesById: Record<string, CacheRequestOutcome> = {}
  const hitIds: string[] = []
  const missIds: string[] = []
  let strain = 0
  let peakStrain = 0
  let invalidated = false

  for (const request of scenario.requests) {
    if (invalidateAtTick !== null && !invalidated && request.tick >= invalidateAtTick) {
      lastServedAtByResource.clear()
      invalidated = true
    }

    const lastServedAt = lastServedAtByResource.get(request.resourceId)
    const hit = lastServedAt !== undefined && request.tick - lastServedAt < ttl

    strain = Math.max(0, strain - STRAIN_DECAY_PER_REQUEST)
    if (!hit) {
      strain = Math.min(MAX_STRAIN, strain + STRAIN_COST_PER_MISS)
      lastServedAtByResource.set(request.resourceId, request.tick)
    }
    peakStrain = Math.max(peakStrain, strain)

    outcomesById[request.id] = { id: request.id, hit, strainAfter: strain }
    ;(hit ? hitIds : missIds).push(request.id)
  }

  return { hitIds, missIds, outcomesById, peakStrain }
}

export function isSameIdSet(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false
  const setB = new Set(b)
  return a.every((id) => setB.has(id))
}

import { levelDefinitionSchema, type LevelDefinition, type LevelMode } from '../../learning/schemas/level'
import type { CacheLevelContent } from './domain/content'
import { discoverContent } from './levels/discover'
import { applyContent } from './levels/apply'
import { masterContent } from './levels/master'

const LESSON_ID = 'lesson-cache-the-crowd'

const rawLevels: LevelDefinition[] = [
  {
    id: 'level-cache-the-crowd-discover',
    lessonId: LESSON_ID,
    mode: 'discover',
    objective: 'Predict which visitor requests miss the cache before a wave of traffic runs.',
    mechanic:
      'Choose a cache TTL, then select every visitor whose request will miss the cache and hit the origin server.',
    winCondition:
      'The wave ran against the TTL you chose, and your selection was checked against the requests that actually missed the cache.',
    reflection:
      'A cache only shields the origin server for as long as its TTL lasts. Once a cached page ages past that window, the next request for it goes all the way to the origin again — a cache miss.',
    contentVersion: 1,
  },
  {
    id: 'level-cache-the-crowd-apply',
    lessonId: LESSON_ID,
    mode: 'apply',
    objective: 'Predict cache hits and misses independently, across a busier, longer wave.',
    mechanic:
      'Choose a cache TTL, then select every visitor whose request will miss the cache and hit the origin server.',
    winCondition:
      'The wave ran against the TTL you chose, and your selection was checked against the requests that actually missed the cache.',
    reflection:
      'A longer TTL trades fewer origin hits for staler data — there is no TTL that is simply "correct," only one that fits how fast the underlying content changes.',
    contentVersion: 1,
  },
  {
    id: 'level-cache-the-crowd-master',
    lessonId: LESSON_ID,
    mode: 'master',
    objective:
      'Choose when a cache purge runs and predict how its timing changes which requests miss.',
    mechanic:
      'Pick when the cache purge fires, then select every visitor whose request will miss the cache.',
    winCondition:
      'The purge you scheduled cleared the cache at that tick, and your selection was checked against every request that missed as a result — including any thundering herd it caused.',
    reflection:
      "Invalidating a cache is only free when nothing is asking for it yet. Time that same invalidation right as a crowd arrives, and every one of those requests misses together — a thundering herd, not a slow trickle of misses.",
    contentVersion: 1,
  },
]

export const cacheTheCrowdLevels: LevelDefinition[] = rawLevels.map((level) =>
  levelDefinitionSchema.parse(level),
)

const contentByMode: Record<LevelMode, CacheLevelContent> = {
  discover: discoverContent,
  apply: applyContent,
  master: masterContent,
}

export function getCacheTheCrowdLevel(mode: LevelMode): LevelDefinition {
  const level = cacheTheCrowdLevels.find((candidate) => candidate.mode === mode)
  if (!level) {
    throw new Error(`No Cache the Crowd level for mode "${mode}"`)
  }
  return level
}

export function getCacheTheCrowdContent(mode: LevelMode): CacheLevelContent {
  return contentByMode[mode]
}

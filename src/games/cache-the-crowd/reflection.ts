import type { LevelMode } from '../../learning/schemas/level'

const transferQuestionsByMode: Record<LevelMode, string> = {
  discover:
    'If Visitor 4 had arrived at tick 2 instead of tick 6, would a 3-tick TTL have made their request a hit or a miss?',
  apply:
    'If two more visitors requested the concourse map back-to-back right after Visitor 6, would either of them still miss the cache?',
  master:
    'If the cache purge had instead run at tick 8, after every visitor in the burst had already arrived, would the thundering herd still happen?',
}

export function getCacheTheCrowdTransferQuestion(mode: LevelMode): string {
  return transferQuestionsByMode[mode]
}

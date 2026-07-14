import type { LevelMode } from '../../learning/schemas/level'

const transferQuestionsByMode: Record<LevelMode, string> = {
  discover:
    'If the stale planning note had cost only 5 units instead of 10, would including it alongside the ideal package have gone over budget?',
  apply:
    'If the decision doc had been left out but both relevant files were packed, would the agent have had enough to finish the task correctly?',
  master:
    'If the full log dump cost only 15 units instead of 35, would it then be worth packing alongside the handler file?',
}

export function getContextPackagerTransferQuestion(mode: LevelMode): string {
  return transferQuestionsByMode[mode]
}

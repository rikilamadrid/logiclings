import type { LevelMode } from '../../learning/schemas/level'

const transferQuestionsByMode: Record<LevelMode, string> = {
  discover:
    'If you added a third bubble nested inside Pod, would popping it also react at Habitat and Planet?',
  apply:
    'If a listener were bound only to the outermost layer, would it ever know which inner layer was actually tapped?',
  master:
    'If you moved your stop one layer further out, which additional layer would start reacting again?',
}

export function getEventBubblingTransferQuestion(mode: LevelMode): string {
  return transferQuestionsByMode[mode]
}

import type { EventBubblingLevelContent } from '../domain/content'

export const applyContent: EventBubblingLevelContent = {
  mode: 'apply',
  predicting: {
    prompt: 'Select every layer that reacts when Larva pops.',
    allowStopPlacement: false,
    scenario: {
      layers: [
        { id: 'larva', label: 'Larva' },
        { id: 'cocoon', label: 'Cocoon' },
        { id: 'branch', label: 'Branch' },
        { id: 'tree', label: 'Tree' },
      ],
      stopLayerId: null,
    },
  },
  transfer: {
    prompt: 'Select every layer that reacts when Nucleus pops.',
    allowStopPlacement: false,
    scenario: {
      layers: [
        { id: 'nucleus', label: 'Nucleus' },
        { id: 'cell', label: 'Cell' },
        { id: 'tissue', label: 'Tissue' },
        { id: 'organ', label: 'Organ' },
        { id: 'body', label: 'Body' },
      ],
      stopLayerId: null,
    },
  },
  explanation:
    'Depth doesn’t change the rule: every ancestor of the tapped element reacts, no matter how many layers of nesting sit between the target and the root.',
}

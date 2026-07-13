import type { EventBubblingLevelContent } from '../domain/content'

export const discoverContent: EventBubblingLevelContent = {
  mode: 'discover',
  predicting: {
    prompt:
      'Pod is about to pop. Select every layer that will react to the click.',
    allowStopPlacement: false,
    scenario: {
      layers: [
        { id: 'pod', label: 'Pod' },
        { id: 'habitat', label: 'Habitat' },
        { id: 'planet', label: 'Planet' },
      ],
      stopLayerId: null,
    },
  },
  transfer: {
    prompt:
      'This time Habitat pops directly, not Pod. Select every layer that will react.',
    allowStopPlacement: false,
    scenario: {
      layers: [
        { id: 'habitat', label: 'Habitat' },
        { id: 'planet', label: 'Planet' },
      ],
      stopLayerId: null,
    },
  },
  explanation:
    'A click never reacts at only one layer. It fires on the exact element you tapped, then bubbles outward through every ancestor — this is event bubbling. In the DOM, that means a listener on an outer element still hears clicks from its children unless something stops it.',
}

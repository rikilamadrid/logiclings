import type { EventBubblingLevelContent } from '../domain/content'

export const masterContent: EventBubblingLevelContent = {
  mode: 'master',
  predicting: {
    prompt:
      'Place a stop at one layer, then select every layer that will still react when Spore pops.',
    allowStopPlacement: true,
    scenario: {
      layers: [
        { id: 'spore', label: 'Spore' },
        { id: 'cap', label: 'Cap' },
        { id: 'stem', label: 'Stem' },
        { id: 'mycelium', label: 'Mycelium' },
      ],
      stopLayerId: null,
    },
  },
  transfer: {
    prompt:
      'A new colony, same rule. Place a stop, then select every layer that will still react when Ember pops.',
    allowStopPlacement: true,
    scenario: {
      layers: [
        { id: 'ember', label: 'Ember' },
        { id: 'coal', label: 'Coal' },
        { id: 'hearth', label: 'Hearth' },
        { id: 'chimney', label: 'Chimney' },
        { id: 'sky', label: 'Sky' },
      ],
      stopLayerId: null,
    },
  },
  explanation:
    'Calling stopPropagation at a layer doesn’t silence that layer — it still hears the click. It only blocks the trip onward: nothing further outward gets a turn. Placing the stop is a real tradeoff: everything inside it still works, everything past it goes dark.',
}

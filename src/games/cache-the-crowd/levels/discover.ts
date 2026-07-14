import type { CacheLevelContent } from '../domain/content'

export const discoverContent: CacheLevelContent = {
  mode: 'discover',
  predicting: {
    prompt:
      "The museum caches each exhibit page for the TTL you pick. Choose a TTL, then select every visitor whose request will miss the cache and hit the museum's servers directly.",
    allowInvalidationChoice: false,
    scenario: {
      ttlOptions: [3, 8],
      requests: [
        { id: 'r1', visitorLabel: 'Visitor 1', resourceId: 'dino-hall', resourceLabel: 'Dinosaur Hall', tick: 0 },
        { id: 'r2', visitorLabel: 'Visitor 2', resourceId: 'dino-hall', resourceLabel: 'Dinosaur Hall', tick: 1 },
        { id: 'r3', visitorLabel: 'Visitor 3', resourceId: 'gem-room', resourceLabel: 'Gem Room', tick: 2 },
        { id: 'r4', visitorLabel: 'Visitor 4', resourceId: 'dino-hall', resourceLabel: 'Dinosaur Hall', tick: 6 },
      ],
    },
  },
  transfer: {
    prompt:
      'Same cache, a new aquarium. Choose a TTL, then select every visitor whose request will miss the cache.',
    allowInvalidationChoice: false,
    scenario: {
      ttlOptions: [4, 10],
      requests: [
        { id: 't1', visitorLabel: 'Visitor 1', resourceId: 'shark-tank', resourceLabel: 'Shark Tank', tick: 0 },
        { id: 't2', visitorLabel: 'Visitor 2', resourceId: 'jelly-room', resourceLabel: 'Jelly Room', tick: 1 },
        { id: 't3', visitorLabel: 'Visitor 3', resourceId: 'shark-tank', resourceLabel: 'Shark Tank', tick: 3 },
        { id: 't4', visitorLabel: 'Visitor 4', resourceId: 'shark-tank', resourceLabel: 'Shark Tank', tick: 9 },
      ],
    },
  },
  explanation:
    "A cache doesn't remember forever — once its TTL passes, the next visitor for that page has to go all the way to the origin server again. That's a cache miss, and it's not a bug: it's how a cache stays honest about freshness.",
}

import type { CacheLevelContent } from '../domain/content'

export const applyContent: CacheLevelContent = {
  mode: 'apply',
  predicting: {
    prompt:
      'A busier stadium, more pages, no hints this time. Choose a TTL, then select every visitor whose request will miss the cache.',
    allowInvalidationChoice: false,
    scenario: {
      ttlOptions: [4, 9],
      requests: [
        { id: 'r1', visitorLabel: 'Visitor 1', resourceId: 'scoreboard', resourceLabel: 'Scoreboard', tick: 0 },
        { id: 'r2', visitorLabel: 'Visitor 2', resourceId: 'roster', resourceLabel: 'Roster', tick: 1 },
        { id: 'r3', visitorLabel: 'Visitor 3', resourceId: 'concourse-map', resourceLabel: 'Concourse Map', tick: 2 },
        { id: 'r4', visitorLabel: 'Visitor 4', resourceId: 'scoreboard', resourceLabel: 'Scoreboard', tick: 3 },
        { id: 'r5', visitorLabel: 'Visitor 5', resourceId: 'roster', resourceLabel: 'Roster', tick: 5 },
        { id: 'r6', visitorLabel: 'Visitor 6', resourceId: 'concourse-map', resourceLabel: 'Concourse Map', tick: 7 },
        { id: 'r7', visitorLabel: 'Visitor 7', resourceId: 'scoreboard', resourceLabel: 'Scoreboard', tick: 8 },
      ],
    },
  },
  transfer: {
    prompt:
      'A conference this time, same rule. Choose a TTL, then select every visitor whose request will miss the cache.',
    allowInvalidationChoice: false,
    scenario: {
      ttlOptions: [5, 9],
      requests: [
        { id: 't1', visitorLabel: 'Visitor 1', resourceId: 'keynote-hall', resourceLabel: 'Keynote Hall', tick: 0 },
        { id: 't2', visitorLabel: 'Visitor 2', resourceId: 'expo-floor', resourceLabel: 'Expo Floor', tick: 1 },
        { id: 't3', visitorLabel: 'Visitor 3', resourceId: 'workshop-room', resourceLabel: 'Workshop Room', tick: 2 },
        { id: 't4', visitorLabel: 'Visitor 4', resourceId: 'keynote-hall', resourceLabel: 'Keynote Hall', tick: 4 },
        { id: 't5', visitorLabel: 'Visitor 5', resourceId: 'expo-floor', resourceLabel: 'Expo Floor', tick: 6 },
        { id: 't6', visitorLabel: 'Visitor 6', resourceId: 'keynote-hall', resourceLabel: 'Keynote Hall', tick: 8 },
      ],
    },
  },
  explanation:
    "The TTL you pick is a tradeoff, not a free win: a longer TTL means fewer trips to the origin, but it also means visitors can see a slightly stale page for longer. There's no single 'best' TTL — it depends on how fast the underlying content actually changes.",
}

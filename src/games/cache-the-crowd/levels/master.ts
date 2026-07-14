import type { CacheLevelContent } from '../domain/content'

export const masterContent: CacheLevelContent = {
  mode: 'master',
  predicting: {
    prompt:
      'A cache purge is scheduled before doors open. Pick when it runs, then select every visitor whose request will miss the cache.',
    allowInvalidationChoice: true,
    scenario: {
      ttlOptions: [10],
      invalidationTickOptions: [0, 4],
      requests: [
        { id: 'r1', visitorLabel: 'Visitor 1', resourceId: 'ticket', resourceLabel: 'Ticket Page', tick: 0 },
        { id: 'r2', visitorLabel: 'Visitor 2', resourceId: 'poster', resourceLabel: 'Poster Page', tick: 1 },
        { id: 'r3', visitorLabel: 'Visitor 3', resourceId: 'map', resourceLabel: 'Venue Map', tick: 2 },
        { id: 'r4', visitorLabel: 'Visitor 4', resourceId: 'ticket', resourceLabel: 'Ticket Page', tick: 4 },
        { id: 'r5', visitorLabel: 'Visitor 5', resourceId: 'poster', resourceLabel: 'Poster Page', tick: 4 },
        { id: 'r6', visitorLabel: 'Visitor 6', resourceId: 'map', resourceLabel: 'Venue Map', tick: 4 },
        { id: 'r7', visitorLabel: 'Visitor 7', resourceId: 'ticket', resourceLabel: 'Ticket Page', tick: 5 },
      ],
    },
  },
  transfer: {
    prompt:
      'A festival, same purge decision. Pick when it runs, then select every visitor whose request will miss the cache.',
    allowInvalidationChoice: true,
    scenario: {
      ttlOptions: [10],
      invalidationTickOptions: [0, 5],
      requests: [
        { id: 't1', visitorLabel: 'Visitor 1', resourceId: 'lineup', resourceLabel: 'Lineup Page', tick: 0 },
        { id: 't2', visitorLabel: 'Visitor 2', resourceId: 'parking', resourceLabel: 'Parking Map', tick: 1 },
        { id: 't3', visitorLabel: 'Visitor 3', resourceId: 'vendors', resourceLabel: 'Vendor List', tick: 2 },
        { id: 't4', visitorLabel: 'Visitor 4', resourceId: 'lineup', resourceLabel: 'Lineup Page', tick: 5 },
        { id: 't5', visitorLabel: 'Visitor 5', resourceId: 'parking', resourceLabel: 'Parking Map', tick: 5 },
        { id: 't6', visitorLabel: 'Visitor 6', resourceId: 'vendors', resourceLabel: 'Vendor List', tick: 5 },
        { id: 't7', visitorLabel: 'Visitor 7', resourceId: 'lineup', resourceLabel: 'Lineup Page', tick: 6 },
      ],
    },
  },
  explanation:
    'Clearing a cache is safe when traffic is quiet, but timing that same clear right as a crowd arrives forces every one of those requests to miss at once — a thundering herd hammering the origin server together, instead of one at a time. Invalidation timing and traffic timing have to be considered together; TTL alone never tells the whole story.',
}

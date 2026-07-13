import { lessonSchema, type Lesson } from '../../schemas/lesson'

const rawLessons: Lesson[] = [
  {
    id: 'lesson-scale-the-startup',
    trackId: 'track-system-design',
    slug: 'scale-the-startup',
    title: 'Scale the Startup',
    summary: 'Add servers and a load balancer before traffic overwhelms one box.',
    learningObjective:
      'Recognize when a single server becomes a bottleneck and what to add first.',
    misconception: 'A faster single server can absorb unlimited concurrent users.',
    estimatedMinutes: 5,
    difficulty: 1,
    version: 1,
    status: 'published',
    prerequisiteLessonIds: [],
  },
  {
    id: 'lesson-cache-the-crowd',
    trackId: 'track-system-design',
    slug: 'cache-the-crowd',
    title: 'Cache the Crowd',
    summary: 'Absorb repeat requests before they hit the backend.',
    learningObjective:
      'Decide what belongs in a cache and how staleness trades off against load.',
    misconception: 'Caching everything is always safe and always faster.',
    estimatedMinutes: 5,
    difficulty: 2,
    version: 1,
    status: 'published',
    prerequisiteLessonIds: ['lesson-scale-the-startup'],
  },
  {
    id: 'lesson-cdn-world-tour',
    trackId: 'track-system-design',
    slug: 'cdn-world-tour',
    title: 'CDN World Tour',
    summary: 'Route a user to the nearest edge instead of a distant origin server.',
    learningObjective:
      'Explain how a CDN reduces latency by serving cached content closer to users.',
    misconception: 'A CDN only helps with images and static files, never with speed.',
    estimatedMinutes: 4,
    difficulty: 2,
    version: 1,
    status: 'published',
    prerequisiteLessonIds: ['lesson-cache-the-crowd'],
  },
  {
    id: 'lesson-sharding-districts',
    trackId: 'track-system-design',
    slug: 'sharding-districts',
    title: 'Sharding Districts',
    summary: 'Split a growing dataset across districts without losing a single record.',
    learningObjective:
      'Choose a shard key that distributes load evenly and predictably.',
    misconception: 'Splitting a database into equal-sized pieces is always enough.',
    estimatedMinutes: 6,
    difficulty: 3,
    version: 1,
    status: 'published',
    prerequisiteLessonIds: ['lesson-cache-the-crowd'],
  },
  {
    id: 'lesson-resilient-checkout',
    trackId: 'track-system-design',
    slug: 'resilient-checkout',
    title: 'Resilient Checkout',
    summary: 'Keep checkout working when a downstream payment service fails.',
    learningObjective:
      'Apply retries, timeouts, and graceful degradation to a critical path.',
    misconception: 'A single retry is always enough to recover from a downstream failure.',
    estimatedMinutes: 6,
    difficulty: 3,
    version: 1,
    status: 'published',
    prerequisiteLessonIds: ['lesson-cdn-world-tour', 'lesson-sharding-districts'],
  },
]

export const systemDesignLessons: Lesson[] = rawLessons.map((lesson) =>
  lessonSchema.parse(lesson),
)

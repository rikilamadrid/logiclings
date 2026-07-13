import { lessonSchema, type Lesson } from '../../schemas/lesson'

const rawLessons: Lesson[] = [
  {
    id: 'lesson-flexbox-factory',
    trackId: 'track-frontend',
    slug: 'flexbox-factory',
    title: 'Flexbox Factory',
    summary: 'Arrange crates on a conveyor belt to learn flex axes and gaps.',
    learningObjective:
      'Predict how main-axis and cross-axis alignment position flex children.',
    misconception:
      'Flexbox items stack in source order regardless of alignment properties.',
    estimatedMinutes: 4,
    difficulty: 1,
    version: 1,
    status: 'published',
    prerequisiteLessonIds: [],
  },
  {
    id: 'lesson-event-bubbling-bubbles',
    trackId: 'track-frontend',
    slug: 'event-bubbling-bubbles',
    title: 'Event Bubbling Bubbles',
    summary: 'Pop bubbles in capture and bubble order before they reach the root.',
    learningObjective:
      'Trace how a DOM event travels from target to root and where to stop it.',
    misconception:
      'Clicking a child element only triggers handlers bound to that exact element.',
    estimatedMinutes: 5,
    difficulty: 2,
    version: 1,
    status: 'published',
    prerequisiteLessonIds: ['lesson-flexbox-factory'],
  },
  {
    id: 'lesson-render-rescue',
    trackId: 'track-frontend',
    slug: 'render-rescue',
    title: 'Render Rescue',
    summary: 'Rescue a laggy component tree from unnecessary re-renders.',
    learningObjective:
      'Identify which state changes force a re-render and which can be contained.',
    misconception:
      'Any state update anywhere in the tree re-renders the entire application.',
    estimatedMinutes: 5,
    difficulty: 2,
    version: 1,
    status: 'published',
    prerequisiteLessonIds: ['lesson-event-bubbling-bubbles'],
  },
  {
    id: 'lesson-state-mutation-garden',
    trackId: 'track-frontend',
    slug: 'state-mutation-garden',
    title: 'State Mutation Garden',
    summary: 'Grow a garden by choosing immutable updates over direct mutation.',
    learningObjective:
      'Explain why mutating state directly breaks change detection.',
    misconception: 'Editing an array or object in place is the same as updating state.',
    estimatedMinutes: 4,
    difficulty: 2,
    version: 1,
    status: 'published',
    prerequisiteLessonIds: ['lesson-event-bubbling-bubbles'],
  },
  {
    id: 'lesson-accessibility-signal-path',
    trackId: 'track-frontend',
    slug: 'accessibility-signal-path',
    title: 'Accessibility Signal Path',
    summary: 'Route a screen reader signal through a form without losing context.',
    learningObjective:
      'Recognize how semantic HTML and ARIA attributes shape the accessibility tree.',
    misconception: 'Visual layout alone conveys enough structure to assistive technology.',
    estimatedMinutes: 6,
    difficulty: 3,
    version: 1,
    status: 'published',
    prerequisiteLessonIds: ['lesson-render-rescue', 'lesson-state-mutation-garden'],
  },
]

export const frontendLessons: Lesson[] = rawLessons.map((lesson) =>
  lessonSchema.parse(lesson),
)

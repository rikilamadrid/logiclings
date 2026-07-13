import { lessonSchema, type Lesson } from '../../schemas/lesson'

const rawLessons: Lesson[] = [
  {
    id: 'lesson-context-packager',
    trackId: 'track-agentic-coding',
    slug: 'context-packager',
    title: 'Context Packager',
    summary: 'Pack only the files and notes an agent actually needs for the task.',
    learningObjective:
      'Decide what context is essential versus what dilutes an agent’s focus.',
    misconception: 'Giving an agent the entire codebase always produces a better result.',
    estimatedMinutes: 5,
    difficulty: 1,
    version: 1,
    status: 'published',
    prerequisiteLessonIds: [],
  },
  {
    id: 'lesson-task-decomposer',
    trackId: 'track-agentic-coding',
    slug: 'task-decomposer',
    title: 'Task Decomposer',
    summary: 'Break a vague request into steps an agent can execute reliably.',
    learningObjective:
      'Split ambiguous goals into concrete, verifiable subtasks.',
    misconception: 'A single detailed prompt is always better than a sequence of smaller steps.',
    estimatedMinutes: 5,
    difficulty: 2,
    version: 1,
    status: 'published',
    prerequisiteLessonIds: ['lesson-context-packager'],
  },
  {
    id: 'lesson-diff-review',
    trackId: 'track-agentic-coding',
    slug: 'diff-review',
    title: 'Diff Review',
    summary: 'Approve, reject, or request changes on an agent-authored diff.',
    learningObjective:
      'Evaluate an agent’s proposed change for correctness and scope before accepting it.',
    misconception: 'Code that compiles and passes tests needs no further review.',
    estimatedMinutes: 6,
    difficulty: 2,
    version: 1,
    status: 'published',
    prerequisiteLessonIds: ['lesson-task-decomposer'],
  },
  {
    id: 'lesson-permission-gate',
    trackId: 'track-agentic-coding',
    slug: 'permission-gate',
    title: 'Permission Gate',
    summary: 'Decide which actions an agent can take autonomously versus with approval.',
    learningObjective:
      'Match the risk of an action to the right level of human oversight.',
    misconception: 'An agent that has been reliable so far should be trusted with any action.',
    estimatedMinutes: 5,
    difficulty: 3,
    version: 1,
    status: 'published',
    prerequisiteLessonIds: ['lesson-diff-review'],
  },
  {
    id: 'lesson-definition-of-done',
    trackId: 'track-agentic-coding',
    slug: 'definition-of-done',
    title: 'Definition of Done',
    summary: 'Set a clear finish line before handing a task to an agent.',
    learningObjective:
      'Write acceptance criteria specific enough for an agent to self-verify against.',
    misconception: 'An agent will naturally know when a task is truly finished.',
    estimatedMinutes: 4,
    difficulty: 3,
    version: 1,
    status: 'published',
    prerequisiteLessonIds: ['lesson-diff-review'],
  },
]

export const agenticCodingLessons: Lesson[] = rawLessons.map((lesson) =>
  lessonSchema.parse(lesson),
)

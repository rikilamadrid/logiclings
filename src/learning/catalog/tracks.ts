import { trackSchema, type Track } from '../schemas/track'

const rawTracks: Track[] = [
  {
    id: 'track-frontend',
    slug: 'frontend',
    title: 'Frontend',
    summary:
      'Feel how the browser renders, reacts, and recovers — layout, events, and state.',
    order: 0,
    iconKey: 'frontend',
    accentToken: '--color-track-frontend',
  },
  {
    id: 'track-system-design',
    slug: 'system-design',
    title: 'System Design',
    summary:
      'Balance traffic, caches, and tradeoffs to keep a growing system standing.',
    order: 1,
    iconKey: 'system-design',
    accentToken: '--color-track-system-design',
  },
  {
    id: 'track-agentic-coding',
    slug: 'agentic-coding',
    title: 'Agentic Coding',
    summary:
      'Practice the judgment calls of directing an AI coding agent responsibly.',
    order: 2,
    iconKey: 'agentic-coding',
    accentToken: '--color-track-agentic-coding',
  },
]

export const tracks: Track[] = rawTracks.map((track) =>
  trackSchema.parse(track),
)

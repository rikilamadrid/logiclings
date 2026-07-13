import { useQuery } from '@tanstack/react-query'
import { getLessonsForTrack, lessons } from './catalog/lessons'
import { tracks } from './catalog/tracks'
import type { Lesson } from './schemas/lesson'
import type { Track } from './schemas/track'

export const learningQueryKeys = {
  tracks: ['learning', 'tracks'] as const,
  track: (trackSlug: string) => ['learning', 'tracks', trackSlug] as const,
  lessons: ['learning', 'lessons'] as const,
  lessonsByTrack: (trackSlug: string) =>
    ['learning', 'tracks', trackSlug, 'lessons'] as const,
}

export function useTracksQuery() {
  return useQuery<Track[]>({
    queryKey: learningQueryKeys.tracks,
    queryFn: () => Promise.resolve(tracks),
  })
}

export function useTrackQuery(trackSlug: string | undefined) {
  return useQuery<Track | undefined>({
    queryKey: learningQueryKeys.track(trackSlug ?? ''),
    queryFn: () =>
      Promise.resolve(tracks.find((track) => track.slug === trackSlug)),
    enabled: Boolean(trackSlug),
  })
}

export function useLessonsQuery() {
  return useQuery<Lesson[]>({
    queryKey: learningQueryKeys.lessons,
    queryFn: () => Promise.resolve(lessons),
  })
}

export function useLessonsByTrackQuery(trackSlug: string | undefined) {
  return useQuery<Lesson[]>({
    queryKey: learningQueryKeys.lessonsByTrack(trackSlug ?? ''),
    queryFn: () => {
      const track = tracks.find((candidate) => candidate.slug === trackSlug)
      return Promise.resolve(track ? getLessonsForTrack(track.id) : [])
    },
    enabled: Boolean(trackSlug),
  })
}

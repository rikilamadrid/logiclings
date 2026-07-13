import { Container } from '../../components/atoms/Container/Container'
import { Heading } from '../../components/atoms/Heading/Heading'
import { Text } from '../../components/atoms/Text/Text'
import { TrackCard } from '../../components/molecules/TrackCard/TrackCard'
import { useTracksQuery } from '../../learning/queries'
import styles from './TracksPage.module.css'

export function TracksPage() {
  const { data: tracks, isLoading } = useTracksQuery()

  return (
    <Container padding="none">
      <Heading level={1}>Tracks</Heading>
      <Text tone="muted">Pick a track and build one instinct at a time.</Text>

      {isLoading ? (
        <Text tone="muted">Loading tracks…</Text>
      ) : (
        <ul className={styles.list}>
          {tracks?.map((track) => (
            <li key={track.id}>
              <TrackCard track={track} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  )
}

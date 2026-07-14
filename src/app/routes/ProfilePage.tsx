import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Container } from '../../components/atoms/Container/Container'
import { Heading } from '../../components/atoms/Heading/Heading'
import { Text } from '../../components/atoms/Text/Text'
import { Button } from '../../components/atoms/Button/Button'
import { AchievementGrid } from '../../components/organisms/AchievementGrid/AchievementGrid'
import { StreakSummary } from '../../components/organisms/StreakSummary/StreakSummary'
import { TrackMasteryList } from '../../components/organisms/TrackMasteryList/TrackMasteryList'
import { LessonListItem } from '../../components/molecules/LessonListItem/LessonListItem'
import { useProfile } from '../../features/profile/useProfile'
import { signOut, useSession } from '../../lib/auth/authClient'
import styles from './ProfilePage.module.css'

export function ProfilePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: session, isPending } = useSession()
  const profile = useProfile()

  async function handleSignOut() {
    await signOut()
    // Every cached response belonged to the account that just left.
    await queryClient.invalidateQueries()
    navigate('/')
  }

  if (isPending) {
    return (
      <Container>
        <Heading level={1}>Profile</Heading>
        <Text tone="muted">Loading your account…</Text>
      </Container>
    )
  }

  if (!session?.user) {
    return (
      <Container>
        <Heading level={1}>Profile</Heading>
        <Text tone="muted">
          Sign in to save your progress and keep it in sync across your devices.
        </Text>

        <div className={styles.actions}>
          <Link className={styles.primaryLink} to="/auth/sign-in">
            Sign in
          </Link>
          <Link to="/auth/sign-up">Create an account</Link>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <Heading level={1}>Profile</Heading>

      <div className={styles.account}>
        <Text weight="medium">{session.user.name}</Text>
        <Text tone="muted" size="sm">
          {session.user.email}
        </Text>
      </div>

      {profile.isLoading ? (
        <Text tone="muted">Loading your progress…</Text>
      ) : profile.isError ? (
        <Text tone="muted">
          We couldn't load your progress right now. Please try reloading the page.
        </Text>
      ) : (
        <>
          <section className={styles.section}>
            <Heading level={2}>Streak</Heading>
            {profile.streak && <StreakSummary streak={profile.streak} />}
          </section>

          <section className={styles.section}>
            <Heading level={2}>Track mastery</Heading>
            <TrackMasteryList summaries={profile.trackSummaries} />
          </section>

          <section className={styles.section}>
            <Heading level={2}>Completed lessons</Heading>
            {profile.completedLessons.length === 0 ? (
              <Text tone="muted" size="sm">
                You haven't finished a lesson yet — play your first one and it'll
                show up here.
              </Text>
            ) : (
              <ul className={styles.lessonList}>
                {profile.completedLessons.map(({ lesson }) => (
                  <li key={lesson.id}>
                    <LessonListItem lesson={lesson} state="completed" />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={styles.section}>
            <Heading level={2}>Achievements</Heading>
            <AchievementGrid earned={profile.achievements} />
          </section>
        </>
      )}

      <div className={styles.actions}>
        <Button variant="secondary" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </Container>
  )
}

import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Container } from '../../components/atoms/Container/Container'
import { Heading } from '../../components/atoms/Heading/Heading'
import { Text } from '../../components/atoms/Text/Text'
import { Button } from '../../components/atoms/Button/Button'
import { signOut, useSession } from '../../lib/auth/authClient'
import styles from './ProfilePage.module.css'

/**
 * Account state only. The full progress/streak/achievement profile is feature 08 —
 * this page carries just enough to sign in and out.
 */
export function ProfilePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: session, isPending } = useSession()

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

      <Text tone="muted" size="sm">
        Progress, streaks, and achievements will appear here.
      </Text>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </Container>
  )
}

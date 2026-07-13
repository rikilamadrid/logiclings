import { Container } from '../../components/atoms/Container/Container'
import { Heading } from '../../components/atoms/Heading/Heading'
import { Text } from '../../components/atoms/Text/Text'
import { SignInForm } from '../../features/auth/SignInForm'

export function SignInPage() {
  return (
    <Container>
      <Heading level={1}>Sign in</Heading>
      <Text tone="muted">
        Sign in to save your progress and pick up where you left off.
      </Text>

      <SignInForm />
    </Container>
  )
}

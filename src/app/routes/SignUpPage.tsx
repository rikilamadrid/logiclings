import { Container } from '../../components/atoms/Container/Container'
import { Heading } from '../../components/atoms/Heading/Heading'
import { Text } from '../../components/atoms/Text/Text'
import { SignUpForm } from '../../features/auth/SignUpForm'

export function SignUpPage() {
  return (
    <Container>
      <Heading level={1}>Create your account</Heading>
      <Text tone="muted">
        An account keeps your progress in sync across your devices.
      </Text>

      <SignUpForm />
    </Container>
  )
}

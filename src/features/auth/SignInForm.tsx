import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/atoms/Button/Button'
import { Text } from '../../components/atoms/Text/Text'
import { TextField } from '../../components/molecules/TextField/TextField'
import { signIn } from '../../lib/auth/authClient'
import {
  signInSchema,
  toFieldErrors,
  type FieldErrors,
  type SignInValues,
} from './credentials'
import { signUpHref, useAuthRedirect } from './useAuthRedirect'
import styles from './AuthForm.module.css'

export function SignInForm() {
  const { redirectTo, completeAuth } = useAuthRedirect()
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<SignInValues>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const parsed = signInSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    if (!parsed.success) {
      setFieldErrors(toFieldErrors<SignInValues>(parsed.error))
      setFormError(null)
      return
    }

    setFieldErrors({})
    setFormError(null)
    setIsSubmitting(true)

    const { error } = await signIn.email({
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (error) {
      // Deliberately vague: saying which of the two was wrong tells an attacker
      // whether an email is registered.
      setFormError(
        error.message ?? 'That email and password did not match an account.',
      )
      setIsSubmitting(false)
      return
    }

    await completeAuth()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {formError ? (
        <p className={styles.formError} role="alert">
          {formError}
        </p>
      ) : null}

      <div className={styles.fields}>
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          required
          disabled={isSubmitting}
          error={fieldErrors.email}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isSubmitting}
          error={fieldErrors.password}
        />
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>

      <div className={styles.footer}>
        <Text tone="muted" size="sm">
          New to Logiclings?{' '}
          <Link to={signUpHref(redirectTo)}>Create an account</Link>
        </Text>
      </div>
    </form>
  )
}

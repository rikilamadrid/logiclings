import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/atoms/Button/Button'
import { Text } from '../../components/atoms/Text/Text'
import { TextField } from '../../components/molecules/TextField/TextField'
import { signUp } from '../../lib/auth/authClient'
import {
  MIN_PASSWORD_LENGTH,
  signUpSchema,
  toFieldErrors,
  type FieldErrors,
  type SignUpValues,
} from './credentials'
import { signInHref, useAuthRedirect } from './useAuthRedirect'
import styles from './AuthForm.module.css'

export function SignUpForm() {
  const { redirectTo, completeAuth } = useAuthRedirect()
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<SignUpValues>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const parsed = signUpSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    })

    if (!parsed.success) {
      setFieldErrors(toFieldErrors<SignUpValues>(parsed.error))
      setFormError(null)
      return
    }

    setFieldErrors({})
    setFormError(null)
    setIsSubmitting(true)

    const { error } = await signUp.email({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (error) {
      setFormError(error.message ?? 'We could not create that account.')
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
          label="Display name"
          name="name"
          type="text"
          autoComplete="name"
          required
          disabled={isSubmitting}
          error={fieldErrors.name}
        />

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
          autoComplete="new-password"
          required
          disabled={isSubmitting}
          hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
          error={fieldErrors.password}
        />
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </Button>

      <div className={styles.footer}>
        <Text tone="muted" size="sm">
          Already have an account?{' '}
          <Link to={signInHref(redirectTo)}>Sign in</Link>
        </Text>
      </div>
    </form>
  )
}

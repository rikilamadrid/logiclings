import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../test/renderWithProviders'
import { SignInForm } from './SignInForm'

const signInEmail = vi.fn()

vi.mock('../../lib/auth/authClient', () => ({
  signIn: {
    email: (...args: unknown[]) => signInEmail(...args),
  },
}))

describe('SignInForm', () => {
  beforeEach(() => {
    signInEmail.mockReset()
    signInEmail.mockResolvedValue({ error: null })
  })

  it('signs in with the submitted credentials', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignInForm />)

    await user.type(screen.getByLabelText('Email'), 'learner@example.com')
    await user.type(screen.getByLabelText('Password'), 'correct-horse')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => {
      expect(signInEmail).toHaveBeenCalledWith({
        email: 'learner@example.com',
        password: 'correct-horse',
      })
    })
  })

  it('reports an invalid email without calling the server', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignInForm />)

    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.type(screen.getByLabelText('Password'), 'correct-horse')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(
      await screen.findByText('Enter a valid email address.'),
    ).toBeInTheDocument()
    expect(signInEmail).not.toHaveBeenCalled()
  })

  it('marks the invalid field for assistive tech', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignInForm />)

    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    const email = await screen.findByLabelText('Email')
    await waitFor(() => expect(email).toHaveAttribute('aria-invalid', 'true'))
    expect(email).toHaveAccessibleDescription('Enter a valid email address.')
  })

  it('surfaces a rejected sign-in as an alert', async () => {
    signInEmail.mockResolvedValue({
      error: { message: 'Invalid email or password.' },
    })

    const user = userEvent.setup()
    renderWithProviders(<SignInForm />)

    await user.type(screen.getByLabelText('Email'), 'learner@example.com')
    await user.type(screen.getByLabelText('Password'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Invalid email or password.',
    )
  })

  it('can be completed with the keyboard alone', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SignInForm />)

    await user.tab()
    await user.keyboard('learner@example.com')
    await user.tab()
    await user.keyboard('correct-horse')
    await user.tab()
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(signInEmail).toHaveBeenCalledWith({
        email: 'learner@example.com',
        password: 'correct-horse',
      })
    })
  })
})

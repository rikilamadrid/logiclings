import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Start Lesson</Button>)

    await userEvent.click(screen.getByRole('button', { name: 'Start Lesson' }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Continue
      </Button>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Continue' }))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('defaults to type="button" so it does not submit forms', () => {
    render(<Button>Start Lesson</Button>)

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })
})

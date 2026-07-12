import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { IconButton } from './IconButton'

describe('IconButton', () => {
  it('exposes the label as an accessible name', () => {
    render(<IconButton icon={<span />} label="Close" />)

    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<IconButton icon={<span />} label="Close" onClick={onClick} />)

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(onClick).toHaveBeenCalledOnce()
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { UpdatePrompt } from './UpdatePrompt'

describe('UpdatePrompt', () => {
  it('announces the update as a status region', () => {
    render(<UpdatePrompt onRefresh={() => {}} onDismiss={() => {}} />)

    expect(screen.getByRole('status')).toHaveTextContent(
      /new version of logiclings is available/i,
    )
  })

  it('calls onRefresh when the user chooses to refresh', async () => {
    const user = userEvent.setup()
    const onRefresh = vi.fn()
    render(<UpdatePrompt onRefresh={onRefresh} onDismiss={() => {}} />)

    await user.click(screen.getByRole('button', { name: /refresh/i }))

    expect(onRefresh).toHaveBeenCalledOnce()
  })

  it('calls onDismiss when the user chooses to wait', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<UpdatePrompt onRefresh={() => {}} onDismiss={onDismiss} />)

    await user.click(screen.getByRole('button', { name: /later/i }))

    expect(onDismiss).toHaveBeenCalledOnce()
  })
})

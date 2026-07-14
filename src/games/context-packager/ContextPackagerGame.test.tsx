import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ContextPackagerGame } from './ContextPackagerGame'
import { getContextPackagerLevel } from './levels'
import type { GameComponentProps } from '../runtime/types'

const accessibilityMode = { reducedMotion: true, soundEnabled: true }

function renderGame(overrides: Partial<GameComponentProps> = {}) {
  const props: GameComponentProps = {
    stage: 'predicting',
    level: getContextPackagerLevel('discover'),
    lastRound: null,
    accessibilityMode,
    onSubmitPrediction: vi.fn(),
    onAdvance: vi.fn(),
    onSubmitTransfer: vi.fn(),
    ...overrides,
  }
  const view = render(<ContextPackagerGame {...props} />)
  return { view, props }
}

describe('ContextPackagerGame — discover level predicting round', () => {
  it('disables submit until at least one item is packed', () => {
    renderGame()
    expect(screen.getByRole('button', { name: 'Submit package' })).toBeDisabled()
  })

  it('reports a correct package when exactly the essential items are packed', async () => {
    const user = userEvent.setup()
    const onSubmitPrediction = vi.fn()
    renderGame({ onSubmitPrediction })

    await user.click(screen.getByText('checkout-service.ts'))
    await user.click(screen.getByText('Discount Rules Spec'))
    await user.click(screen.getByRole('button', { name: 'Submit package' }))

    expect(onSubmitPrediction).toHaveBeenCalledWith(true, true)
  })

  it('reports an incorrect package when an essential item is left out', async () => {
    const user = userEvent.setup()
    const onSubmitPrediction = vi.fn()
    renderGame({ onSubmitPrediction })

    await user.click(screen.getByText('checkout-service.ts'))
    await user.click(screen.getByRole('button', { name: 'Submit package' }))

    expect(onSubmitPrediction).toHaveBeenCalledWith(false, true)
  })

  it('lets an item be packed with the keyboard alone', async () => {
    const user = userEvent.setup()
    const onSubmitPrediction = vi.fn()
    renderGame({ onSubmitPrediction })

    const checkoutRow = screen.getByText('checkout-service.ts').closest('[role="button"]') as HTMLElement
    checkoutRow.focus()
    await user.keyboard('{Enter}')
    await user.click(screen.getByText('Discount Rules Spec'))

    await user.click(screen.getByRole('button', { name: 'Submit package' }))

    expect(onSubmitPrediction).toHaveBeenCalledWith(true, true)
  })

  it('shows a warning once packing pushes the total cost over budget', async () => {
    const user = userEvent.setup()
    renderGame({ level: getContextPackagerLevel('master') })

    expect(screen.queryByText(/units over budget/)).not.toBeInTheDocument()

    await user.click(screen.getByText('Full Server Log (24h)'))
    await user.click(screen.getByText('webhook-handler.ts'))

    expect(screen.getByText('15 units over budget')).toBeInTheDocument()
  })
})

describe('ContextPackagerGame — simulating stage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('reveals each packed item in order and advances when done (reduced motion)', async () => {
    const onAdvance = vi.fn()
    const { view } = renderGame({ onAdvance })

    fireEvent.click(screen.getByText('checkout-service.ts'))
    fireEvent.click(screen.getByText('Discount Rules Spec'))
    fireEvent.click(screen.getByRole('button', { name: 'Submit package' }))

    view.rerender(
      <ContextPackagerGame
        stage="simulating"
        level={getContextPackagerLevel('discover')}
        lastRound={null}
        accessibilityMode={accessibilityMode}
        onSubmitPrediction={vi.fn()}
        onAdvance={onAdvance}
        onSubmitTransfer={vi.fn()}
      />,
    )

    expect(onAdvance).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(2000)
    expect(onAdvance).toHaveBeenCalledTimes(1)
  })
})

describe('ContextPackagerGame — reacting stage', () => {
  it('shows the correct/incorrect heading and what was left out after a full round', async () => {
    const user = userEvent.setup()
    const { view } = renderGame()

    await user.click(screen.getByText('checkout-service.ts'))
    await user.click(screen.getByRole('button', { name: 'Submit package' }))

    view.rerender(
      <ContextPackagerGame
        stage="reacting"
        level={getContextPackagerLevel('discover')}
        lastRound={null}
        accessibilityMode={accessibilityMode}
        onSubmitPrediction={vi.fn()}
        onAdvance={vi.fn()}
        onSubmitTransfer={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Not quite' })).toBeInTheDocument()
    expect(screen.getByText(/Left out:/)).toBeInTheDocument()
  })
})

describe('ContextPackagerGame — explaining stage', () => {
  it('shows the named concept and lets the learner continue to transfer', async () => {
    const user = userEvent.setup()
    const onAdvance = vi.fn()
    renderGame({ stage: 'explaining', onAdvance })

    expect(screen.getByText(/only reasons well over what's actually in its context window/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try a variation' }))
    expect(onAdvance).toHaveBeenCalledTimes(1)
  })
})

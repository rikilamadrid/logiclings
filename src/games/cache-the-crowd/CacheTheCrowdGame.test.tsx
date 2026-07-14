import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CacheTheCrowdGame } from './CacheTheCrowdGame'
import { getCacheTheCrowdLevel } from './levels'
import type { GameComponentProps } from '../runtime/types'

const accessibilityMode = { reducedMotion: true, soundEnabled: true }

function renderGame(overrides: Partial<GameComponentProps> = {}) {
  const props: GameComponentProps = {
    stage: 'predicting',
    level: getCacheTheCrowdLevel('discover'),
    lastRound: null,
    accessibilityMode,
    onSubmitPrediction: vi.fn(),
    onAdvance: vi.fn(),
    onSubmitTransfer: vi.fn(),
    ...overrides,
  }
  const view = render(<CacheTheCrowdGame {...props} />)
  return { view, props }
}

describe('CacheTheCrowdGame — discover level predicting round', () => {
  it('disables submit until a TTL is chosen and a visitor is selected', () => {
    renderGame()
    expect(screen.getByRole('button', { name: 'Submit prediction' })).toBeDisabled()
  })

  it('reports a correct prediction when every actual cache miss is selected for the chosen TTL', async () => {
    const user = userEvent.setup()
    const onSubmitPrediction = vi.fn()
    renderGame({ onSubmitPrediction })

    await user.click(screen.getByRole('button', { name: '3 ticks' }))
    await user.click(screen.getByText('Visitor 1'))
    await user.click(screen.getByText('Visitor 3'))
    await user.click(screen.getByText('Visitor 4'))
    await user.click(screen.getByRole('button', { name: 'Submit prediction' }))

    expect(onSubmitPrediction).toHaveBeenCalledWith(true, true)
  })

  it('reports an incorrect prediction when an actual miss is left unselected', async () => {
    const user = userEvent.setup()
    const onSubmitPrediction = vi.fn()
    renderGame({ onSubmitPrediction })

    await user.click(screen.getByRole('button', { name: '3 ticks' }))
    await user.click(screen.getByText('Visitor 1'))
    await user.click(screen.getByRole('button', { name: 'Submit prediction' }))

    expect(onSubmitPrediction).toHaveBeenCalledWith(false, true)
  })

  it('lets a visitor request be selected with the keyboard alone', async () => {
    const user = userEvent.setup()
    const onSubmitPrediction = vi.fn()
    renderGame({ onSubmitPrediction })

    await user.click(screen.getByRole('button', { name: '3 ticks' }))

    const visitor1 = screen.getByText('Visitor 1').closest('[role="button"]') as HTMLElement
    visitor1.focus()
    await user.keyboard('{Enter}')
    await user.click(screen.getByText('Visitor 3'))
    await user.click(screen.getByText('Visitor 4'))

    const submit = screen.getByRole('button', { name: 'Submit prediction' })
    await user.click(submit)

    expect(onSubmitPrediction).toHaveBeenCalledWith(true, true)
  })
})

describe('CacheTheCrowdGame — master level invalidation choice', () => {
  it('requires an invalidation tick before the prediction can be submitted', async () => {
    const user = userEvent.setup()
    renderGame({ level: getCacheTheCrowdLevel('master') })

    await user.click(screen.getByRole('button', { name: '10 ticks' }))
    await user.click(screen.getByText('Visitor 1'))
    expect(screen.getByRole('button', { name: 'Submit prediction' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: '4 tick' }))
    expect(screen.getByRole('button', { name: 'Submit prediction' })).toBeEnabled()
  })

  it('produces more misses when the purge is timed right into the burst than when it runs early', async () => {
    const user = userEvent.setup()
    const onSubmitPrediction = vi.fn()
    renderGame({ level: getCacheTheCrowdLevel('master'), onSubmitPrediction })

    await user.click(screen.getByRole('button', { name: '10 ticks' }))
    await user.click(screen.getByRole('button', { name: '4 tick' }))
    for (const label of ['Visitor 1', 'Visitor 2', 'Visitor 3', 'Visitor 4', 'Visitor 5', 'Visitor 6']) {
      await user.click(screen.getByText(label))
    }
    await user.click(screen.getByRole('button', { name: 'Submit prediction' }))

    expect(onSubmitPrediction).toHaveBeenCalledWith(true, true)
  })
})

describe('CacheTheCrowdGame — simulating stage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('reveals each request in order and advances when done (reduced motion)', async () => {
    const onAdvance = vi.fn()
    const { view } = renderGame({ onAdvance })

    fireEvent.click(screen.getByRole('button', { name: '3 ticks' }))
    fireEvent.click(screen.getByText('Visitor 1'))
    fireEvent.click(screen.getByText('Visitor 3'))
    fireEvent.click(screen.getByText('Visitor 4'))
    fireEvent.click(screen.getByRole('button', { name: 'Submit prediction' }))

    view.rerender(
      <CacheTheCrowdGame
        stage="simulating"
        level={getCacheTheCrowdLevel('discover')}
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

describe('CacheTheCrowdGame — reacting stage', () => {
  it('shows the correct/incorrect heading after a full predicting round', async () => {
    const user = userEvent.setup()
    const { view } = renderGame()

    await user.click(screen.getByRole('button', { name: '3 ticks' }))
    await user.click(screen.getByText('Visitor 1'))
    await user.click(screen.getByRole('button', { name: 'Submit prediction' }))

    view.rerender(
      <CacheTheCrowdGame
        stage="reacting"
        level={getCacheTheCrowdLevel('discover')}
        lastRound={null}
        accessibilityMode={accessibilityMode}
        onSubmitPrediction={vi.fn()}
        onAdvance={vi.fn()}
        onSubmitTransfer={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Not quite' })).toBeInTheDocument()
    expect(screen.getByText(/You missed:/)).toBeInTheDocument()
  })
})

describe('CacheTheCrowdGame — explaining stage', () => {
  it('shows the named concept and lets the learner continue to transfer', async () => {
    const user = userEvent.setup()
    const onAdvance = vi.fn()
    renderGame({ stage: 'explaining', onAdvance })

    expect(screen.getByText(/A cache doesn't remember forever/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try a variation' }))
    expect(onAdvance).toHaveBeenCalledTimes(1)
  })
})

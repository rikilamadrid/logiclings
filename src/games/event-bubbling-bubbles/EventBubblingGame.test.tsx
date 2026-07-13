import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EventBubblingGame } from './EventBubblingGame'
import { getEventBubblingLevel } from './levels'
import type { GameComponentProps } from '../runtime/types'

const accessibilityMode = { reducedMotion: true, soundEnabled: true }

function renderGame(overrides: Partial<GameComponentProps> = {}) {
  const props: GameComponentProps = {
    stage: 'predicting',
    level: getEventBubblingLevel('discover'),
    lastRound: null,
    accessibilityMode,
    onSubmitPrediction: vi.fn(),
    onAdvance: vi.fn(),
    onSubmitTransfer: vi.fn(),
    ...overrides,
  }
  const view = render(<EventBubblingGame {...props} />)
  return { view, props }
}

describe('EventBubblingGame — discover level predicting round', () => {
  it('reports a correct prediction when every ancestor layer is selected', async () => {
    const user = userEvent.setup()
    const onSubmitPrediction = vi.fn()
    renderGame({ onSubmitPrediction })

    await user.click(screen.getByText('Pod'))
    await user.click(screen.getByText('Habitat'))
    await user.click(screen.getByText('Planet'))
    await user.click(screen.getByRole('button', { name: 'Submit prediction' }))

    expect(onSubmitPrediction).toHaveBeenCalledWith(true, true)
  })

  it('reports an incorrect prediction when a reacting ancestor is left out', async () => {
    const user = userEvent.setup()
    const onSubmitPrediction = vi.fn()
    renderGame({ onSubmitPrediction })

    await user.click(screen.getByText('Pod'))
    await user.click(screen.getByRole('button', { name: 'Submit prediction' }))

    expect(onSubmitPrediction).toHaveBeenCalledWith(false, true)
  })

  it('lets a layer be selected with the keyboard alone', async () => {
    const user = userEvent.setup()
    const onSubmitPrediction = vi.fn()
    renderGame({ onSubmitPrediction })

    const podLayer = screen.getByText('Pod').closest('[role="button"]') as HTMLElement
    expect(podLayer).not.toBeNull()
    podLayer.focus()
    await user.keyboard('{Enter}')
    await user.click(screen.getByText('Habitat'))
    await user.click(screen.getByText('Planet'))

    const submit = screen.getByRole('button', { name: 'Submit prediction' })
    await user.keyboard('{Tab}')
    await user.click(submit)

    expect(onSubmitPrediction).toHaveBeenCalledWith(true, true)
  })

  it('disables submit until at least one layer is selected', () => {
    renderGame()
    expect(screen.getByRole('button', { name: 'Submit prediction' })).toBeDisabled()
  })
})

describe('EventBubblingGame — master level stop placement', () => {
  it('requires a placed stop before the prediction can be submitted', async () => {
    const user = userEvent.setup()
    renderGame({ level: getEventBubblingLevel('master') })

    await user.click(screen.getByText('Spore'))
    expect(screen.getByRole('button', { name: 'Submit prediction' })).toBeDisabled()

    await user.click(screen.getAllByRole('button', { name: 'Place stop' })[0])
    expect(screen.getByRole('button', { name: 'Submit prediction' })).toBeEnabled()
  })

  it('treats a stop placed at the target as correct when only the target is selected', async () => {
    const user = userEvent.setup()
    const onSubmitPrediction = vi.fn()
    renderGame({ level: getEventBubblingLevel('master'), onSubmitPrediction })

    const sporeRow = screen.getByText('Spore').closest('li') as HTMLElement
    await user.click(within(sporeRow).getByRole('button', { name: 'Place stop' }))
    await user.click(screen.getByText('Spore'))
    await user.click(screen.getByRole('button', { name: 'Submit prediction' }))

    expect(onSubmitPrediction).toHaveBeenCalledWith(true, true)
  })
})

describe('EventBubblingGame — simulating stage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('reveals each reacting layer in order and advances when done (reduced motion)', async () => {
    const onAdvance = vi.fn()
    const { view } = renderGame({ onAdvance })

    const podLayer = screen.getByText('Pod').closest('[role="button"]') as HTMLElement
    const habitatLayer = screen.getByText('Habitat').closest('[role="button"]') as HTMLElement
    const planetLayer = screen.getByText('Planet').closest('[role="button"]') as HTMLElement

    fireEvent.click(podLayer)
    fireEvent.click(habitatLayer)
    fireEvent.click(planetLayer)
    fireEvent.click(screen.getByRole('button', { name: 'Submit prediction' }))

    view.rerender(
      <EventBubblingGame
        stage="simulating"
        level={getEventBubblingLevel('discover')}
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

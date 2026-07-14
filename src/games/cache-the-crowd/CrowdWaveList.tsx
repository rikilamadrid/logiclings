import { Text } from '../../components/atoms/Text/Text'
import { usePressable } from '../runtime/input'
import type { CacheRequest } from './domain/cache'
import styles from './CacheTheCrowdGame.module.css'

export type RequestVisualState = 'idle' | 'pending' | 'hit' | 'miss'

interface CrowdWaveRowProps {
  request: CacheRequest
  interactive: boolean
  selected: boolean
  onToggleSelected: () => void
  visualState: RequestVisualState
  registerRef?: (id: string, element: HTMLLIElement | null) => void
}

const VISUAL_LABEL: Record<RequestVisualState, string> = {
  idle: '',
  pending: 'Waiting…',
  hit: 'Cache hit',
  miss: 'Cache miss',
}

function CrowdWaveRow({
  request,
  interactive,
  selected,
  onToggleSelected,
  visualState,
  registerRef,
}: CrowdWaveRowProps) {
  const pressable = usePressable(onToggleSelected)
  const mainProps = interactive
    ? { ...pressable, 'aria-pressed': selected }
    : { 'data-interactive': 'false' as const }

  return (
    <li
      ref={(element) => registerRef?.(request.id, element)}
      className={styles.requestRow}
      data-visual={visualState}
    >
      <div className={styles.requestMain} {...mainProps}>
        <Text weight="medium">{request.visitorLabel}</Text>
        <Text size="sm" tone="muted">
          {request.resourceLabel} · tick {request.tick}
        </Text>
        {interactive ? (
          <span className={styles.checkbox} aria-hidden="true">
            {selected ? '✓' : ''}
          </span>
        ) : (
          VISUAL_LABEL[visualState] && (
            <Text size="sm" tone="muted">
              {VISUAL_LABEL[visualState]}
            </Text>
          )
        )}
      </div>
    </li>
  )
}

interface CrowdWaveListProps {
  requests: CacheRequest[]
  interactive: boolean
  selectedIds: ReadonlySet<string> | readonly string[]
  onToggleSelected?: (id: string) => void
  visualStateFor?: (id: string) => RequestVisualState
  registerRef?: (id: string, element: HTMLLIElement | null) => void
}

/**
 * The visitor-queue visual: one row per request, in arrival order. Shared by
 * the predicting/transfer selection view, the simulating reveal, and the
 * reacting result view, plus Storybook.
 */
export function CrowdWaveList({
  requests,
  interactive,
  selectedIds,
  onToggleSelected,
  visualStateFor,
  registerRef,
}: CrowdWaveListProps) {
  const selected = selectedIds instanceof Set ? selectedIds : new Set(selectedIds)

  return (
    <ol className={styles.requestList}>
      {requests.map((request) => (
        <CrowdWaveRow
          key={request.id}
          request={request}
          interactive={interactive}
          selected={selected.has(request.id)}
          onToggleSelected={() => onToggleSelected?.(request.id)}
          visualState={visualStateFor?.(request.id) ?? 'idle'}
          registerRef={registerRef}
        />
      ))}
    </ol>
  )
}

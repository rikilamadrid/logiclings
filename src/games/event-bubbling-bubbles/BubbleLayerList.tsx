import { Text } from '../../components/atoms/Text/Text'
import { usePressable } from '../runtime/input'
import type { BubbleLayer } from './domain/bubbling'
import styles from './EventBubblingGame.module.css'

export type LayerVisualState = 'idle' | 'reacting' | 'not-reacting' | 'pending'

interface BubbleLayerRowProps {
  layer: BubbleLayer
  index: number
  interactive: boolean
  selected: boolean
  onToggleSelected: () => void
  stopPlacementEnabled: boolean
  isStop: boolean
  onToggleStop: () => void
  visualState: LayerVisualState
  registerRef?: (id: string, element: HTMLDivElement | null) => void
}

function BubbleLayerRow({
  layer,
  index,
  interactive,
  selected,
  onToggleSelected,
  stopPlacementEnabled,
  isStop,
  onToggleStop,
  visualState,
  registerRef,
}: BubbleLayerRowProps) {
  const pressable = usePressable(onToggleSelected)
  const mainProps = interactive
    ? { ...pressable, 'aria-pressed': selected }
    : { 'data-interactive': 'false' as const }

  return (
    <li className={styles.layerItem}>
      {index > 0 && (
        <div className={styles.bubbleArrow} aria-hidden="true">
          ↑
        </div>
      )}
      <div
        ref={(element) => registerRef?.(layer.id, element)}
        className={styles.layer}
        data-selected={selected}
        data-visual={visualState}
        data-target={index === 0}
      >
        <div className={styles.layerMain} {...mainProps}>
          <Text weight="medium">{layer.label}</Text>
          {index === 0 && (
            <Text size="sm" tone="muted">
              tapped
            </Text>
          )}
          <span className={styles.checkbox} aria-hidden="true">
            {selected ? '✓' : ''}
          </span>
        </div>
        {stopPlacementEnabled && (
          <button
            type="button"
            className={styles.stopButton}
            aria-pressed={isStop}
            onClick={(event) => {
              event.stopPropagation()
              onToggleStop()
            }}
          >
            {isStop ? 'Stop placed' : 'Place stop'}
          </button>
        )}
      </div>
    </li>
  )
}

interface BubbleLayerListProps {
  layers: BubbleLayer[]
  interactive: boolean
  selectedIds: ReadonlySet<string> | readonly string[]
  onToggleSelected?: (id: string) => void
  stopPlacementEnabled: boolean
  stopId?: string | null
  onToggleStop?: (id: string) => void
  visualStateFor?: (id: string) => LayerVisualState
  registerRef?: (id: string, element: HTMLDivElement | null) => void
}

/**
 * The nested-bubble stack visual: one row per ancestor layer, ordered from
 * the tapped target outward. Shared by the live game (selection, reveal, and
 * result views) and by Storybook so each visual state can be shown directly.
 */
export function BubbleLayerList({
  layers,
  interactive,
  selectedIds,
  onToggleSelected,
  stopPlacementEnabled,
  stopId = null,
  onToggleStop,
  visualStateFor,
  registerRef,
}: BubbleLayerListProps) {
  const selected = selectedIds instanceof Set ? selectedIds : new Set(selectedIds)

  return (
    <ol className={styles.layerList}>
      {layers.map((layer, index) => (
        <BubbleLayerRow
          key={layer.id}
          layer={layer}
          index={index}
          interactive={interactive}
          selected={selected.has(layer.id)}
          onToggleSelected={() => onToggleSelected?.(layer.id)}
          stopPlacementEnabled={stopPlacementEnabled}
          isStop={stopId === layer.id}
          onToggleStop={() => onToggleStop?.(layer.id)}
          visualState={visualStateFor?.(layer.id) ?? 'idle'}
          registerRef={registerRef}
        />
      ))}
    </ol>
  )
}

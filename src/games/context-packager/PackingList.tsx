import { Text } from '../../components/atoms/Text/Text'
import { usePressable } from '../runtime/input'
import type { ContextItem, ContextItemCategory } from './domain/packaging'
import styles from './ContextPackagerGame.module.css'

export type ItemVisualState = 'excluded' | 'pending' | 'good' | 'extraneous' | 'missing'

const CATEGORY_LABEL: Record<ContextItemCategory, string> = {
  'relevant-file': 'File',
  'unrelated-file': 'Unrelated file',
  'stale-note': 'Stale note',
  'prior-decision': 'Decision doc',
  'spec-snippet': 'Spec',
  'log-dump': 'Log',
}

const VISUAL_LABEL: Record<ItemVisualState, string> = {
  excluded: '',
  pending: 'Packing…',
  good: 'Included — on target',
  extraneous: 'Included — not needed',
  missing: 'Left out — needed',
}

interface PackingListRowProps {
  item: ContextItem
  interactive: boolean
  packed: boolean
  onTogglePacked: () => void
  visualState: ItemVisualState
  registerRef?: (id: string, element: HTMLLIElement | null) => void
}

function PackingListRow({
  item,
  interactive,
  packed,
  onTogglePacked,
  visualState,
  registerRef,
}: PackingListRowProps) {
  const pressable = usePressable(onTogglePacked)
  const mainProps = interactive
    ? { ...pressable, 'aria-pressed': packed }
    : { 'data-interactive': 'false' as const }

  return (
    <li
      ref={(element) => registerRef?.(item.id, element)}
      className={styles.itemRow}
      data-visual={visualState}
    >
      <div className={styles.itemMain} {...mainProps}>
        <div className={styles.itemHeading}>
          <Text weight="medium">{item.label}</Text>
          <Text size="sm" tone="muted">
            {CATEGORY_LABEL[item.category]} · {item.cost} units
          </Text>
        </div>
        <Text size="sm" tone="muted">
          {item.description}
        </Text>
        {interactive ? (
          <span className={styles.checkbox} aria-hidden="true">
            {packed ? '✓' : ''}
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

interface PackingListProps {
  items: ContextItem[]
  interactive: boolean
  packedIds: ReadonlySet<string> | readonly string[]
  onTogglePacked?: (id: string) => void
  visualStateFor?: (id: string) => ItemVisualState
  registerRef?: (id: string, element: HTMLLIElement | null) => void
}

/**
 * The packable item list: one row per available piece of context, shared by
 * the packing/predicting selection view, the simulating reveal, and the
 * reacting result view, plus Storybook.
 */
export function PackingList({
  items,
  interactive,
  packedIds,
  onTogglePacked,
  visualStateFor,
  registerRef,
}: PackingListProps) {
  const packed = packedIds instanceof Set ? packedIds : new Set(packedIds)

  return (
    <ol className={styles.itemList}>
      {items.map((item) => (
        <PackingListRow
          key={item.id}
          item={item}
          interactive={interactive}
          packed={packed.has(item.id)}
          onTogglePacked={() => onTogglePacked?.(item.id)}
          visualState={visualStateFor?.(item.id) ?? 'excluded'}
          registerRef={registerRef}
        />
      ))}
    </ol>
  )
}

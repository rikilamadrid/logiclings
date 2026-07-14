import { Text } from '../../../components/atoms/Text/Text'
import { resourceMeterStatus, type ResourceMeterStatus } from './resourceMeterStatus'
import styles from './ResourceMeter.module.css'

const STATUS_LABEL: Record<ResourceMeterStatus, string> = {
  calm: 'Calm',
  busy: 'Busy',
  strained: 'Strained',
}

interface ResourceMeterProps {
  label: string
  value: number
  max?: number
}

/**
 * A generic resource/strain meter, shared across mini-games that visualize a
 * balance rather than a trace — origin-server strain here, any similar
 * bounded resource elsewhere. Status is conveyed through text and the
 * `data-status` attribute, never through color alone.
 */
export function ResourceMeter({ label, value, max = 100 }: ResourceMeterProps) {
  const clamped = Math.min(max, Math.max(0, value))
  const status = resourceMeterStatus(clamped, max)
  const percent = max <= 0 ? 0 : (clamped / max) * 100

  return (
    <div className={styles.meter}>
      <div className={styles.header}>
        <Text size="sm" weight="medium">
          {label}
        </Text>
        <Text size="sm" tone="muted">
          {Math.round(clamped)} / {max} · {STATUS_LABEL[status]}
        </Text>
      </div>
      <div
        className={styles.track}
        role="meter"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        data-status={status}
      >
        <div className={styles.fill} data-status={status} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'
import styles from './Badge.module.css'

type SemanticTone = 'neutral' | 'success' | 'warning' | 'danger'

type TrackTone =
  | 'frontend'
  | 'backend'
  | 'apis'
  | 'databases'
  | 'algorithms'
  | 'system-design'
  | 'networking'
  | 'security'
  | 'devops'
  | 'ai-fundamentals'
  | 'agentic-coding'

export type BadgeTone = SemanticTone | TrackTone

interface BadgeProps {
  tone?: BadgeTone
  children: ReactNode
  className?: string
}

const toneClass: Record<BadgeTone, string> = {
  neutral: styles.neutral,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
  frontend: styles.frontend,
  backend: styles.backend,
  apis: styles.apis,
  databases: styles.databases,
  algorithms: styles.algorithms,
  'system-design': styles.systemDesign,
  networking: styles.networking,
  security: styles.security,
  devops: styles.devops,
  'ai-fundamentals': styles.aiFundamentals,
  'agentic-coding': styles.agenticCoding,
}

export function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  const classes = [styles.badge, toneClass[tone], className]
    .filter(Boolean)
    .join(' ')

  return <span className={classes}>{children}</span>
}

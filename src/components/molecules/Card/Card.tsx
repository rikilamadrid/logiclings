import type { ReactNode } from 'react'
import styles from './Card.module.css'

type CardElevation = 'flat' | 'raised'

interface CardProps {
  children: ReactNode
  elevation?: CardElevation
  className?: string
}

const elevationClass: Record<CardElevation, string> = {
  flat: styles.flat,
  raised: styles.raised,
}

export function Card({
  children,
  elevation = 'raised',
  className,
}: CardProps) {
  const classes = [styles.card, elevationClass[elevation], className]
    .filter(Boolean)
    .join(' ')

  return <div className={classes}>{children}</div>
}

import type { ReactNode } from 'react'
import styles from './Heading.module.css'

type HeadingLevel = 1 | 2 | 3 | 4

interface HeadingProps {
  level: HeadingLevel
  children: ReactNode
  className?: string
}

const sizeByLevel: Record<HeadingLevel, string> = {
  1: styles.size1,
  2: styles.size2,
  3: styles.size3,
  4: styles.size4,
}

export function Heading({ level, children, className }: HeadingProps) {
  const Tag = `h${level}` as const
  const classes = [styles.heading, sizeByLevel[level], className]
    .filter(Boolean)
    .join(' ')

  return <Tag className={classes}>{children}</Tag>
}

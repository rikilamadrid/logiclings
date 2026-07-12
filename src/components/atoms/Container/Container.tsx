import type { ReactNode } from 'react'
import styles from './Container.module.css'

type ContainerPadding = 'none' | 'sm' | 'md' | 'lg'

interface ContainerProps {
  children: ReactNode
  padding?: ContainerPadding
  className?: string
}

const paddingClass: Record<ContainerPadding, string> = {
  none: styles.paddingNone,
  sm: styles.paddingSm,
  md: styles.paddingMd,
  lg: styles.paddingLg,
}

export function Container({
  children,
  padding = 'md',
  className,
}: ContainerProps) {
  const classes = [styles.container, paddingClass[padding], className]
    .filter(Boolean)
    .join(' ')

  return <div className={classes}>{children}</div>
}

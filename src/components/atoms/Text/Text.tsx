import type { ElementType, ReactNode } from 'react'
import styles from './Text.module.css'

type TextSize = 'sm' | 'md' | 'lg'
type TextTone = 'default' | 'muted'

interface TextProps {
  as?: ElementType
  size?: TextSize
  tone?: TextTone
  weight?: 'regular' | 'medium' | 'bold'
  children: ReactNode
  className?: string
}

const sizeClass: Record<TextSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
}

const toneClass: Record<TextTone, string> = {
  default: styles.toneDefault,
  muted: styles.toneMuted,
}

const weightClass: Record<NonNullable<TextProps['weight']>, string> = {
  regular: styles.weightRegular,
  medium: styles.weightMedium,
  bold: styles.weightBold,
}

export function Text({
  as: Tag = 'p',
  size = 'md',
  tone = 'default',
  weight = 'regular',
  children,
  className,
}: TextProps) {
  const classes = [
    styles.text,
    sizeClass[size],
    toneClass[tone],
    weightClass[weight],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <Tag className={classes}>{children}</Tag>
}

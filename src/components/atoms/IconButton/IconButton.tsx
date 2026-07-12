import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './IconButton.module.css'

type IconButtonVariant = 'primary' | 'secondary' | 'ghost'

interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: ReactNode
  label: string
  variant?: IconButtonVariant
}

const variantClass: Record<IconButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
}

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  type = 'button',
  className,
  ...rest
}: IconButtonProps) {
  const classes = [styles.button, variantClass[variant], className]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} aria-label={label} {...rest}>
      {icon}
    </button>
  )
}

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

interface CommonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outlineLight'
  icon?: ReactNode
  className?: string
  children: ReactNode
}

type ButtonAsButton = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined }
type ButtonAsAnchor = CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & { href: string }

export type ButtonProps = ButtonAsButton | ButtonAsAnchor

const VARIANT_CLASSES: Record<NonNullable<CommonProps['variant']>, string> = {
  primary:
    'border border-gold-light/70 bg-gradient-to-r from-gold-light via-gold to-gold-light text-maroon-dark shadow-soft hover:shadow-lift hover:-translate-y-0.5',
  secondary: 'border border-gold bg-transparent text-maroon hover:bg-gold/10 hover:-translate-y-0.5',
  ghost: 'border border-transparent bg-transparent text-maroon underline decoration-gold decoration-2 underline-offset-4 hover:text-maroon-light',
  outlineLight: 'border border-ivory/50 bg-transparent text-ivory hover:bg-ivory/10 hover:-translate-y-0.5',
}

/** Shared CTA styling; renders an `<a>` when `href` is provided, otherwise a `<button>`. */
export function Button({ variant = 'primary', icon, className = '', children, ...props }: ButtonProps) {
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 font-body text-sm font-medium tracking-wide transition-all duration-300 ease-out sm:text-base ${VARIANT_CLASSES[variant]} ${className}`

  if (props.href) {
    const { href, ...anchorProps } = props
    return (
      <a href={href} className={classes} {...anchorProps}>
        {icon}
        {children}
      </a>
    )
  }

  const buttonProps = props as ButtonAsButton
  return (
    <button type="button" className={classes} {...buttonProps}>
      {icon}
      {children}
    </button>
  )
}

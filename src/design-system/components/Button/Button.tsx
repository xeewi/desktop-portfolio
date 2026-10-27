import type { ReactNode } from 'react'
import './Button.css'

type Common = { variant?: 'default' | 'primary'; block?: boolean; children: ReactNode }
type Props = Common & ({ onClick: () => void; href?: never } | { href: string; onClick?: never })

/** Push button, or a link styled as one when given `href`. */
export function Button({ variant = 'default', block, children, ...action }: Props) {
  const cls = 'ds-button' + (variant === 'primary' ? ' ds-button--primary' : '') + (block ? ' ds-button--block' : '')
  if (action.href) {
    const external = !action.href.startsWith('mailto:')
    return (
      <a className={cls} href={action.href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
        {children}
      </a>
    )
  }
  return (
    <button className={cls} onClick={action.onClick}>
      {children}
    </button>
  )
}

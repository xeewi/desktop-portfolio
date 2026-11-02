import type { ReactNode } from 'react'
import './Button.css'

type Common = { variant?: 'default' | 'primary'; block?: boolean; children: ReactNode }
type Props = Common & ({ onClick: () => void; href?: never } | { href: string; onClick?: never })

/** Push button, or a link styled as one when given `href`. */
export function Button({ variant = 'default', block, children, ...action }: Props) {
  const cls = 'ds-button' + (variant === 'primary' ? ' ds-button--primary' : '') + (block ? ' ds-button--block' : '')
  if (action.href) {
    // other sites and the PDF open in a tab; e-mail and this site's own pages stay here
    const external = /^https?:|\.pdf$/.test(action.href)
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

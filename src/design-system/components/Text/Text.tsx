import type { ReactNode } from 'react'
import './Text.css'

/** Paragraph. `subtitle`: accent-coloured tagline. `muted`: secondary info. */
export function Text({ variant = 'body', children }: { variant?: 'body' | 'subtitle' | 'muted'; children: ReactNode }) {
  return <p className={'ds-text ds-text--' + variant}>{children}</p>
}

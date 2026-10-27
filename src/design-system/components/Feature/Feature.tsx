import { Icon, type IconName } from '../Icon/Icon'
import type { ReactNode } from 'react'
import { Heading } from '../Heading/Heading'
import './Feature.css'

/** Big icon next to a title and some content. */
export function Feature({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) {
  return (
    <div className="ds-feature">
      <span className="ds-feature__icon">
        <Icon name={icon} />
      </span>
      <div>
        <Heading level={4}>{title}</Heading>
        {children}
      </div>
    </div>
  )
}

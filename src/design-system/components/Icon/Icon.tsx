import './Icon.css'

/** Keep in sync with NAMES in scripts/fetch-icons.mjs (each chrome sets one --icon-<name> token per name).
 *  Icon.test.ts checks every chrome has them all. */
export const ICON_NAMES = [
  'user', 'work', 'tools', 'folder', 'mail', 'appearance', 'pdf', 'computer', 'terminal',
  'file', 'code', 'location', 'info', 'display', 'network', 'server', 'cloud', 'ai', 'check', 'language',
  'search', 'video', 'gaming', 'editor', 'windows', 'mouse', 'accessibility', 'image', 'keyboard', 'science', 'package', 'money',
] as const
export type IconName = (typeof ICON_NAMES)[number]

/** The current OS's icon for `name`, 1em square: size it with font-size. Decorative. */
export function Icon({ name }: { name: IconName }) {
  return <span className="ds-icon" style={{ backgroundImage: `var(--icon-${name})` }} aria-hidden />
}

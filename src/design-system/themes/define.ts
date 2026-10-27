import type { Lang } from '../../content/types'
import type { Palette } from '../tokens/palette'

export type Desc = Record<Lang, string>
/** Component-token overrides (see tokens/base.css), e.g. { '--win-radius': '6px' }. */
export type Tokens = Record<`--${string}`, string>

export type Theme = {
  id: string
  name: string
  desc: Desc
  vars: Palette
  /** token overrides at every size */
  tokens?: Tokens
  /** token overrides on desktop only (kept out of the touch layout) */
  desktopTokens?: Tokens
}

export type OsId = '95' | 'xp' | 'vista' | '10' | 'ubuntu' | 'mac'
/** Which chrome file (chromes/*.css) styles the components. */
export type Chrome = 'classic' | 'xp' | 'vista' | 'modern' | 'gnome' | 'mac'
/** `year`: when this look came out. `sub`: what its themes are. */
export type Os = { id: OsId; name: string; year: number; chrome: Chrome; sub: Desc; themes: Theme[] }

/** A theme only lists what it changes from its OS base palette. */
export const t = (
  base: Palette,
  id: string,
  name: string,
  desc: Desc,
  vars: Partial<Palette>,
  extra: Pick<Theme, 'tokens' | 'desktopTokens'> = {},
): Theme => ({ id, name, desc, vars: { ...base, ...vars }, ...extra })

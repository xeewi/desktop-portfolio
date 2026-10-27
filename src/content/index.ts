import { en, type Content } from './en'
import { fr } from './fr'
import type { Lang } from './types'

export { links } from './links'
export type { Content, Lang }

export const content: Record<Lang, Content> = { en, fr }

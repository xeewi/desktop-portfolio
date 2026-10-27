import type { IconName } from '../design-system'

/** The apps on the desktop, in order. Titles live in content (ui.apps). */
export const APPS = [
  { id: 'about', icon: 'user', width: 620 },
  { id: 'xp', icon: 'work', width: 820 },
  { id: 'skills', icon: 'tools', width: 640 },
  { id: 'projects', icon: 'folder', width: 720 },
  { id: 'contact', icon: 'mail', width: 460 },
  { id: 'themes', icon: 'appearance', width: 880 },
  { id: 'system', icon: 'computer', width: 760 },
  { id: 'hood', icon: 'terminal', width: 720 },
  { id: 'tour', icon: 'info', width: 420 },
] as const satisfies readonly { id: string; icon: IconName; width: number }[]

export type AppId = (typeof APPS)[number]['id']

import type { IconName } from '../design-system'

/** The apps on the desktop, in order. Titles live in content (ui.apps). */
export const APPS = [
  { id: 'about', icon: 'user', width: 680 },
  { id: 'xp', icon: 'work', width: 820 },
  { id: 'skills', icon: 'tools', width: 640 },
  { id: 'projects', icon: 'folder', width: 720 },
  { id: 'contact', icon: 'mail', width: 460 },
  { id: 'themes', icon: 'appearance', width: 880 },
  { id: 'system', icon: 'computer', width: 760 },
  { id: 'hood', icon: 'terminal', width: 720 },
  // other sites of mine, in a frame. Last, so the first icon column doesn't change
  { id: 'costcalc', icon: 'package', width: 960, web: true },
  { id: 'mixcoach', icon: 'video', width: 960, web: true },
  { id: 'directchange', icon: 'money', width: 960, web: true },
] as const satisfies readonly { id: string; icon: IconName; width: number; web?: true }[]

export type AppId = (typeof APPS)[number]['id']

import type { Os } from './define'
import { WINDOWS95 } from './windows95'
import { WINDOWSXP } from './windowsXp'
import { WINDOWSVISTA } from './windowsVista'
import { WINDOWS10 } from './windows10'
import { UBUNTU } from './ubuntu'
import { MACOS } from './macos'

export * from './define'

/** In tab order. */
export const OSES: Os[] = [WINDOWS95, WINDOWSXP, WINDOWSVISTA, WINDOWS10, UBUNTU, MACOS]

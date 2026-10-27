// Palette = the colour/font layer a theme changes. Defaults are Vista's Aero.
// Set as CSS variables on <html> (and on each theme preview) by runtime/theme.ts.
export const basePalette = {
  '--font': "'Segoe UI', 'Noto Sans', system-ui, -apple-system, sans-serif",
  '--wall':
    'radial-gradient(120% 80% at 80% 110%, #0b6d5a 0%, transparent 55%), radial-gradient(90% 70% at 10% 0%, #0a4f8a 0%, transparent 60%), linear-gradient(160deg, #021827 0%, #063a55 45%, #04463f 100%)',
  // signature printed on the wallpaper: light on dark walls, dark on light ones
  '--wall-ink': '#ffffff',
  '--wall-blend': 'overlay', // light walls: 'multiply' with a dark, see-through ink
  '--rib1a': '#7af0c8',
  '--rib1b': '#48c6ff',
  '--rib2a': '#b7ff7a',
  '--rib2b': '#2fd6b0',
  '--rib3': '#3aa0ff55',
  '--glass': 'rgba(140, 190, 220, 0.28)',
  '--glass-active': 'rgba(110, 175, 220, 0.42)',
  '--title-ink': '#000',
  '--title-glow': '#fff',
  '--taskbar': 'rgba(10, 18, 28, 0.78)',
  '--taskbar-ink': '#fff',
  '--orb-a': '#1a8fd8',
  '--orb-b': '#0a3a6a',
  '--orb-glow': '#6cf7a0',
  '--accent': '#1a5fd0',
  '--heading': '#1e3c8c',
  '--close': '#c5402a',
  '--paper': '#ffffff',
  '--ink': '#1e1e1e',
  '--muted': '#5a6b7b',
  // used by 95 (button face, title gradient) and XP (title, frame)
  '--face': '#c0c0c0',
  '--title-a': '#000080',
  '--title-b': '#1084d0',
}

export type Palette = typeof basePalette

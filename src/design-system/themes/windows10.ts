import { basePalette as aero } from '../tokens/palette'
import { t, type Os, type Theme } from './define'

// ---------- Windows 10 : flat, community colour palettes ----------
const hero =
  'radial-gradient(25% 45% at 38% 50%, #8fd0ff 0%, transparent 70%), conic-gradient(from 230deg at 36% 50%, transparent 0deg, #1a6ad0aa 15deg, transparent 35deg, #0a4ab0aa 55deg, transparent 80deg), linear-gradient(90deg, #000814, #00163a)'
const w10 = {
  ...aero,
  '--wall': hero,
  '--title-a': '#ffffff',
  '--title-ink': '#000',
  '--taskbar': 'rgba(16, 16, 16, 0.9)',
  '--taskbar-ink': '#fff',
  '--accent': '#0078d7',
  '--heading': '#005a9e',
  '--paper': '#ffffff',
  '--ink': '#1a1a1a',
  '--muted': '#666',
}
const dark = (paper: string, title: string, ink: string, muted: string, accent: string, heading: string, wall: string, taskbar: string) => ({
  '--paper': paper, '--title-a': title, '--title-ink': ink, '--ink': ink, '--muted': muted, '--accent': accent, '--heading': heading, '--wall': wall, '--taskbar': taskbar,
})

const themes: Theme[] = [
  t(w10, 'light', 'Windows Light', { en: 'The default: white windows, blue light.', fr: 'Par défaut : fenêtres blanches, lumière bleue.' }, {}),
  t(w10, 'dark', 'Dark mode', { en: 'Because every app has one now.', fr: 'Parce que toutes les applis en ont un maintenant.' }, dark('#1f1f1f', '#202020', '#eeeeee', '#aaaaaa', '#0078d7', '#4cc2ff', hero, 'rgba(10, 10, 10, 0.92)')),
  t(w10, 'nord', 'Nord', { en: 'Arctic blues, a community classic.', fr: 'Bleus arctiques, un classique de la communauté.' }, dark('#2e3440', '#3b4252', '#e5e9f0', '#8f9bb3', '#88c0d0', '#8fbcbb', 'radial-gradient(60% 40% at 70% 30%, #88c0d044, transparent), radial-gradient(50% 40% at 20% 80%, #b48ead33, transparent), linear-gradient(160deg, #2e3440, #434c5e)', 'rgba(46, 52, 64, 0.94)')),
  t(w10, 'dracula', 'Dracula', { en: 'Purple and pink, the dark theme for everything.', fr: 'Violet et rose, le thème sombre pour tout.' }, dark('#282a36', '#21222c', '#f8f8f2', '#6272a4', '#bd93f9', '#ff79c6', 'radial-gradient(50% 40% at 70% 40%, #bd93f944, transparent), radial-gradient(40% 30% at 20% 70%, #ff79c633, transparent), #1e1f29', 'rgba(25, 26, 33, 0.94)')),
  t(w10, 'catppuccin', 'Catppuccin', { en: 'Soothing pastels, very popular on GitHub.', fr: 'Pastels apaisants, très populaires sur GitHub.' }, dark('#1e1e2e', '#181825', '#cdd6f4', '#a6adc8', '#cba6f7', '#f5c2e7', 'radial-gradient(60% 50% at 70% 30%, #cba6f733, transparent), radial-gradient(50% 40% at 20% 80%, #89b4fa33, transparent), #11111b', 'rgba(17, 17, 27, 0.92)')),
  t(w10, 'gruvbox', 'Gruvbox', { en: 'Warm retro browns for long nights.', fr: 'Bruns rétro chaleureux pour les longues nuits.' }, dark('#282828', '#1d2021', '#ebdbb2', '#a89984', '#fe8019', '#fabd2f', 'radial-gradient(60% 50% at 70% 70%, #d65d0e33, transparent), linear-gradient(160deg, #1d2021, #3c3836)', 'rgba(29, 32, 33, 0.94)')),
  t(w10, 'rosepine', 'Rosé Pine', { en: 'Muted rose and pine, all natural.', fr: 'Rose poudré et pin, tout en douceur.' }, dark('#191724', '#1f1d2e', '#e0def4', '#908caa', '#ebbcba', '#c4a7e7', 'radial-gradient(60% 50% at 30% 30%, #eb6f9233, transparent), radial-gradient(50% 40% at 80% 70%, #31748f44, transparent), #191724', 'rgba(25, 23, 36, 0.94)')),
  t(w10, 'tokyo', 'Tokyo Night', { en: 'City lights after midnight.', fr: 'Les lumières de la ville après minuit.' }, dark('#1a1b26', '#16161e', '#c0caf5', '#787c99', '#7aa2f7', '#bb9af7', 'radial-gradient(50% 40% at 70% 80%, #7aa2f733, transparent), radial-gradient(40% 30% at 30% 30%, #bb9af733, transparent), linear-gradient(#16161e, #24283b)', 'rgba(22, 22, 30, 0.94)')),
  t(w10, 'solarized', 'Solarized Light', { en: 'The carefully balanced cream palette.', fr: 'La palette crème soigneusement équilibrée.' }, {
    '--paper': '#fdf6e3', '--title-a': '#eee8d5', '--title-ink': '#4f6369', '--ink': '#586e75', '--muted': '#93a1a1', '--accent': '#268bd2', '--heading': '#cb4b16',
    '--wall': 'radial-gradient(60% 50% at 70% 30%, #b5890033, transparent), radial-gradient(50% 40% at 20% 80%, #2aa19833, transparent), linear-gradient(160deg, #fdf6e3, #eee8d5)', '--taskbar': 'rgba(0, 43, 54, 0.94)',
  }),
]

export const WINDOWS10: Os = { id: '10', name: 'Windows 10', year: 2015, chrome: 'modern', themes, sub: { en: 'Popular community colour palettes, recreated in CSS.', fr: 'Des palettes de couleurs populaires de la communauté, recréées en CSS.' } }

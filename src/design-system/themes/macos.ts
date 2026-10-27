import { basePalette as aero } from '../tokens/palette'
import { t, type Os, type Theme } from './define'

// ---------- macOS : barre de menus + dock ----------
const sonomaWall =
  'radial-gradient(70% 60% at 80% 20%, #f0b070cc, transparent 60%), radial-gradient(60% 60% at 20% 80%, #3a5ad8cc, transparent 60%), linear-gradient(135deg, #0a1a5a, #4a2a8a 45%, #e06a8a 80%)'
const sonoma = {
  ...aero,
  '--font': "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Segoe UI', sans-serif",
  '--wall': sonomaWall,
  '--title-a': '#ececec',
  '--title-ink': '#1d1d1f',
  '--paper': '#ffffff',
  '--ink': '#1d1d1f',
  '--muted': '#6e6e73',
  '--accent': '#007aff',
  '--heading': '#0a5ad8',
  '--close': '#ff5f57',
  '--taskbar': 'rgba(255, 255, 255, 0.55)',
  '--taskbar-ink': '#000',
}
const lucida = "'Lucida Grande', 'Helvetica Neue', sans-serif"

const themes: Theme[] = [
  t(sonoma, 'sonoma', 'Sonoma', { en: 'Today’s look: light, colourful, rounded.', fr: 'Le look actuel : clair, coloré, arrondi.' }, {}),
  t(sonoma, 'mojave', 'Dark Mode', { en: 'Desert night, the dark mode that started it all.', fr: 'Nuit dans le désert, le mode sombre qui a tout lancé.' }, {
    '--wall': 'linear-gradient(180deg, #0b1a3a 0%, #3a2a5a 45%, #c47a4a 70%, #3a1f1a 72%, #1a0f0a 100%)',
    '--title-a': '#2b2b2d', '--title-ink': '#dddddd', '--paper': '#1e1e1e', '--ink': '#e5e5e5', '--muted': '#98989d', '--accent': '#0a84ff', '--heading': '#64d2ff',
    '--taskbar': 'rgba(30, 30, 30, 0.6)', '--taskbar-ink': '#fff',
  }),
  t(sonoma, 'graphite', 'Graphite', { en: 'All the colour drained out, on purpose.', fr: 'Toute la couleur retirée, exprès.' }, {
    '--wall': 'radial-gradient(60% 60% at 70% 30%, #9a9aa0, transparent 70%), linear-gradient(160deg, #2a2a2e, #6a6a70)',
    '--accent': '#8e8e93', '--heading': '#3a3a3c',
  }),
  t(sonoma, 'yosemite', 'Yosemite', { en: 'The 2014 flat redesign, mountains included.', fr: 'Le passage au flat de 2014, montagnes comprises.' }, {
    '--wall': 'linear-gradient(170deg, transparent 55%, #3a4a5a 55.3%, #1a2a3a 100%), linear-gradient(190deg, transparent 50%, #5a6a7a 50.3%), linear-gradient(180deg, #e8a87a, #8ab0d8 50%)',
    '--title-a': '#f6f6f6', '--accent': '#1a82fb', '--heading': '#0a64d8',
  }),
  t(sonoma, 'aqua-x', 'Aqua', { en: 'Pinstripes and blue gel buttons, Mac OS X 10.0 style.', fr: 'Fines rayures et boutons gel bleus, façon Mac OS X 10.0.' }, {
    '--font': lucida,
    '--wall': 'radial-gradient(90% 50% at 50% 110%, #a8d8ff, transparent 70%), radial-gradient(60% 40% at 30% 30%, #5a9ae8, transparent 70%), linear-gradient(#0a3a8a, #3a7ad8)',
    '--title-a': 'repeating-linear-gradient(#e8e8e8 0 2px, #f8f8f8 2px 4px)',
    // the darker pinstripe of the window body: the hardest background for dark text and outlines
    '--paper': '#f2f2f2',
    '--accent': '#3a7fd9', '--heading': '#1a4fa8', '--taskbar': 'rgba(250, 250, 250, 0.85)',
  }, {
    tokens: {
      '--win-body-bg': 'repeating-linear-gradient(#f2f2f2 0 2px, #fff 2px 4px)',
      '--btn-primary-radius': '99px', '--btn-primary-bg': 'linear-gradient(#a8d0ff, #3a8ae8 50%, #1a6ad8 51%, #7ab8ff)', '--btn-primary-shadow': '0 1px 3px #0005',
    },
  }),
  t(sonoma, 'metal', 'Brushed Metal', { en: 'The brushed aluminium of the Tiger years.', fr: "L'aluminium brossé des années Tiger." }, {
    '--font': lucida,
    '--wall': 'radial-gradient(70% 60% at 30% 30%, #5a8ad8, transparent 70%), linear-gradient(160deg, #0a2a6a, #3a6ac0)',
    '--title-a': 'repeating-linear-gradient(90deg, #c8c8c8 0 1px, #d4d4d4 1px 3px, #c0c0c0 3px 4px), linear-gradient(#e0e0e0, #b8b8b8)',
    '--accent': '#3875d7', '--heading': '#1a4a9a', '--taskbar': 'rgba(235, 235, 235, 0.85)',
  }),
  t(sonoma, 'platinum', 'Platinum', { en: 'Mac OS 9 grey, as remixed by the Kaleidoscope crowd.', fr: 'Le gris de Mac OS 9, revisité par la communauté Kaleidoscope.' }, {
    '--font': "Geneva, 'Lucida Grande', sans-serif",
    '--wall': 'repeating-linear-gradient(45deg, #6a6ab8 0 2px, #7676c4 2px 4px)',
    '--title-a': 'repeating-linear-gradient(#dddddd 0 1px, #bbbbbb 1px 2px)', '--title-ink': '#000', '--paper': '#ffffff', '--ink': '#000', '--muted': '#555',
    '--accent': '#6666cc', '--heading': '#333399', '--taskbar': 'rgba(221, 221, 221, 0.97)',
  }, { tokens: { '--win-radius': '0', '--win-border': '1px solid #000', '--win-shadow': '2px 2px 0 #0006', '--win-shadow-active': '2px 2px 0 #0006', '--title-weight': '700' } }),
  t(sonoma, 'latte', 'Catppuccin Latte', { en: 'The pastel community palette, light roast.', fr: 'La palette pastel de la communauté, version claire.' }, {
    '--wall': 'radial-gradient(60% 50% at 70% 30%, #ea76cb55, transparent 70%), radial-gradient(60% 60% at 20% 80%, #1e66f555, transparent 70%), linear-gradient(135deg, #eff1f5, #ccd0da)',
    '--title-a': '#e6e9ef', '--title-ink': '#4c4f69', '--paper': '#eff1f5', '--ink': '#4c4f69', '--muted': '#7c7f93', '--accent': '#8839ef', '--heading': '#d20f39',
  }),
]

export const MACOS: Os = { id: 'mac', name: 'macOS', year: 2001, chrome: 'mac', themes, sub: { en: 'Twenty years of Mac looks plus a community palette, recreated in CSS.', fr: 'Vingt ans de looks Mac et une palette de la communauté, recréés en CSS.' } }

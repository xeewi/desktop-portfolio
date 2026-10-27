import { basePalette as aero } from '../tokens/palette'
import { t, type Os, type Theme } from './define'

// ---------- Ubuntu : GNOME, barre du haut + dock à gauche ----------
const jammy =
  'radial-gradient(60% 60% at 72% 38%, #e95420bb, transparent 60%), radial-gradient(70% 70% at 20% 85%, #77216fcc, transparent 60%), linear-gradient(135deg, #2c001e, #5e2750 60%, #e95420)'
const yaru = {
  ...aero,
  '--font': "Ubuntu, Cantarell, 'Noto Sans', system-ui, sans-serif",
  '--wall': jammy,
  '--title-a': '#ebebeb',
  '--title-ink': '#3d3d3d',
  '--paper': '#fafafa',
  '--ink': '#3d3d3d',
  '--muted': '#77767b',
  '--accent': '#e95420',
  '--heading': '#c34113',
  '--close': '#e95420',
  '--taskbar': 'rgba(0, 0, 0, 0.92)',
  '--taskbar-ink': '#fff',
}
const gtkDark = (title: string, paper: string, ink: string, muted: string) => ({ '--title-a': title, '--title-ink': ink, '--paper': paper, '--ink': ink, '--muted': muted })

const themes: Theme[] = [
  t(yaru, 'yaru', 'Yaru', { en: "Ubuntu's own theme, made by its community.", fr: "Le thème d'Ubuntu, conçu par sa communauté." }, {}),
  t(yaru, 'yaru-dark', 'Yaru Dark', { en: 'The same, after sunset.', fr: 'Le même, après le coucher du soleil.' }, { ...gtkDark('#303030', '#242424', '#ffffff', '#aaaaaa'), '--heading': '#f99b6e' }),
  t(yaru, 'ambiance', 'Ambiance', { en: 'Dark brown headers and orange, the 2010–2016 look.', fr: 'En-têtes brun foncé et orange, le look 2010–2016.' }, {
    '--wall': 'radial-gradient(90% 40% at 50% 100%, #ff6a33aa, transparent 70%), radial-gradient(80% 50% at 30% 30%, #9a3a8acc, transparent 70%), linear-gradient(160deg, #2c001e, #77216f 55%, #e95420)',
    '--title-a': '#3c3b37', '--title-ink': '#dfdbd2', '--paper': '#f2f1f0', '--accent': '#f07746', '--heading': '#dd4814', '--close': '#f07746',
  }),
  t(yaru, 'human-gtk', 'Human', { en: 'Brown and orange, where it all started in 2004.', fr: 'Brun et orange, là où tout a commencé en 2004.' }, {
    '--wall': 'radial-gradient(60% 50% at 30% 30%, #d8a060aa, transparent 70%), linear-gradient(170deg, #4a2a12, #b8864a)',
    '--title-a': '#8c6a4a', '--title-ink': '#ffffff', '--paper': '#efebe7', '--accent': '#d87e2c', '--heading': '#8a5a2a', '--close': '#d87e2c', '--taskbar': 'rgba(58, 42, 26, 0.95)',
  }),
  t(yaru, 'adwaita', 'Adwaita', { en: 'Plain GNOME, blue and clean.', fr: 'GNOME tout simple, bleu et net.' }, {
    '--wall': 'radial-gradient(50% 50% at 70% 30%, #99c1f1, transparent 70%), radial-gradient(60% 60% at 20% 80%, #1a5fb4, transparent 70%), linear-gradient(135deg, #1c71d8, #3584e4)',
    '--title-a': '#ebebeb', '--title-ink': '#2e3436', '--paper': '#ffffff', '--ink': '#2e3436', '--accent': '#3584e4', '--heading': '#1c71d8', '--close': '#c0bfbc',
  }),
  t(yaru, 'arc', 'Arc', { en: 'Flat greys and blue, a community favourite for years.', fr: 'Gris plats et bleu, un favori de la communauté pendant des années.' }, {
    '--wall': 'linear-gradient(160deg, #2f343f, #4b5162 60%, #5294e2)',
    '--title-a': '#e7e8eb', '--title-ink': '#5c616c', '--paper': '#f5f6f7', '--ink': '#5c616c', '--accent': '#5294e2', '--heading': '#3b7ad0', '--close': '#cc575d', '--taskbar': 'rgba(47, 52, 63, 0.96)',
  }),
  t(yaru, 'pop', 'Pop', { en: 'Warm darks with teal and orange, from Pop!_OS.', fr: 'Sombre et chaleureux, sarcelle et orange, de Pop!_OS.' }, {
    ...gtkDark('#2b2928', '#333130', '#e6e6e6', '#a8a39f'),
    '--wall': 'radial-gradient(60% 40% at 50% 100%, #faa41a, transparent 70%), linear-gradient(170deg, #1f1c1a, #574f4a 60%, #8a5a2a)',
    '--accent': '#48b9c7', '--heading': '#fbb86c', '--close': '#fbb86c',
  }),
  t(yaru, 'mint', 'Mint-Y', { en: 'Soft mint green, borrowed from Linux Mint.', fr: 'Vert menthe doux, emprunté à Linux Mint.' }, {
    '--wall': 'radial-gradient(60% 50% at 70% 30%, #9ab87a88, transparent 70%), linear-gradient(160deg, #1f2a1a, #5a7a3a)',
    '--title-a': '#e8e8e8', '--title-ink': '#303030', '--paper': '#f8f8f8', '--ink': '#303030', '--accent': '#8fa876', '--heading': '#5c7a3a', '--close': '#8fa876',
  }),
  t(yaru, 'sweet', 'Sweet', { en: 'Neon purple and pink, all over r/unixporn.', fr: 'Violet et rose néon, partout sur r/unixporn.' }, {
    ...gtkDark('#161925', '#1b1e2b', '#c3c7d1', '#7c8296'),
    '--wall': 'radial-gradient(50% 50% at 75% 30%, #ff008066, transparent 70%), radial-gradient(60% 60% at 20% 80%, #c74ded66, transparent 70%), linear-gradient(135deg, #161925, #3a1a5a)',
    '--accent': '#c74ded', '--heading': '#ff4aa0', '--close': '#ff0080', '--taskbar': 'rgba(22, 25, 37, 0.95)',
  }),
]

export const UBUNTU: Os = { id: 'ubuntu', name: 'Ubuntu', year: 2004, chrome: 'gnome', themes, sub: { en: 'Official and community GTK themes, from 2004 to today, recreated in CSS.', fr: "Thèmes GTK officiels et communautaires, de 2004 à aujourd'hui, recréés en CSS." } }

import { basePalette as aero } from '../tokens/palette'
import { t, type Os, type Theme } from './define'

// ---------- Windows 95 : classic grey bevels ----------
const classicFont = "Tahoma, 'MS Sans Serif', 'Microsoft Sans Serif', 'Segoe UI', sans-serif"
const w95 = {
  ...aero,
  '--font': classicFont,
  '--wall': '#008080',
  '--face': '#c0c0c0',
  '--title-a': '#000080',
  '--title-b': '#000080',
  '--title-ink': '#fff',
  '--paper': '#fff',
  '--ink': '#000',
  '--muted': '#555',
  '--accent': '#000080',
  '--heading': '#000080',
  '--taskbar-ink': '#000',
}

const themes: Theme[] = [
  t(w95, 'w95', 'Windows Standard', { en: 'Teal desktop, grey windows, navy titles.', fr: 'Bureau sarcelle, fenêtres grises, titres bleu marine.' }, {}),
  t(w95, 'hotdog', 'Hot Dog Stand', { en: 'The infamous red-and-yellow scheme, back by popular demand.', fr: 'Le tristement célèbre jeu rouge et jaune, à la demande générale.' }, {
    '--wall': '#ff0000', '--face': '#ffff00', '--title-a': '#ff0000', '--title-b': '#ff0000', '--paper': '#ffff00', '--accent': '#ff0000', '--heading': '#c00000', '--muted': '#600',
  }),
  t(w95, 'plum', 'Plum', { en: 'Dusty purple, very mid-90s.', fr: 'Violet poudré, très milieu des années 90.' }, {
    '--wall': '#402840', '--face': '#a89890', '--title-a': '#483048', '--title-b': '#483048', '--accent': '#483048', '--heading': '#483048',
  }),
  t(w95, 'rainy', 'Rainy Day', { en: 'Blue-grey, like a Sunday afternoon.', fr: 'Gris-bleu, comme un dimanche après-midi.' }, {
    '--wall': '#3c4f64', '--face': '#8098a8', '--title-a': '#4f657d', '--title-b': '#4f657d', '--accent': '#4f657d', '--heading': '#2f4258',
  }),
  t(w95, 'marine', 'Marine', { en: 'Sea green and deep teal.', fr: 'Vert d’eau et sarcelle profond.' }, {
    '--wall': '#004848', '--face': '#88c0b8', '--title-a': '#007070', '--title-b': '#007070', '--accent': '#007070', '--heading': '#005050',
  }),
  t(w95, 'desert', 'Desert', { en: 'Sand-coloured windows with teal titles.', fr: 'Fenêtres couleur sable et titres sarcelle.' }, {
    '--wall': '#a08868', '--face': '#d5ccbb', '--title-a': '#008080', '--title-b': '#008080', '--accent': '#008080', '--heading': '#006060',
  }),
  t(w95, 'contrast', 'High Contrast', { en: 'Black, white and purple, built for readability.', fr: 'Noir, blanc et violet, pensé pour la lisibilité.' }, {
    '--wall': '#000', '--face': '#000', '--title-a': '#800080', '--title-b': '#800080', '--paper': '#000', '--ink': '#fff', '--muted': '#ff0', '--accent': '#800080', '--heading': '#0ff', '--taskbar-ink': '#fff',
  }, { tokens: { '--face-ink': '#fff' } }),
  t(w95, 'vapor', 'Vaporwave', { en: 'The internet’s favourite 95 nostalgia.', fr: 'La nostalgie 95 préférée d’internet.' }, {
    '--wall': 'repeating-linear-gradient(0deg, #ff71ce33 0 2px, transparent 2px 40px), repeating-linear-gradient(90deg, #01cdfe33 0 2px, transparent 2px 40px), linear-gradient(180deg, #2b1055 0%, #d53a9d 60%, #ff9a8b 100%)',
    '--face': '#d9c2e8', '--title-a': '#ff71ce', '--title-b': '#01cdfe', '--accent': '#b967ff', '--heading': '#7a2fbf',
  }),
]

export const WINDOWS95: Os = { id: '95', name: 'Windows 95', year: 1995, chrome: 'classic', themes, sub: { en: 'Colour schemes of the era plus a modern fan favourite, recreated in CSS.', fr: "Les jeux de couleurs de l'époque et un favori des fans d'aujourd'hui, recréés en CSS." } }

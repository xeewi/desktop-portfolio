import { basePalette as aero } from '../tokens/palette'
import { t, type Os, type Theme } from './define'

// ---------- Windows XP : Luna ----------
const bliss =
  'radial-gradient(120% 60% at 30% 100%, #5fae2e 0%, #3f8a1e 45%, transparent 46%), radial-gradient(140% 70% at 85% 110%, #6cbf3a 0%, #4a9a2a 40%, transparent 41%), radial-gradient(30% 12% at 70% 22%, #ffffffcc, transparent 70%), radial-gradient(25% 10% at 25% 30%, #ffffffaa, transparent 70%), linear-gradient(180deg, #2a6ad8 0%, #5a9ae8 45%, #9ac8f0 70%)'
const luna = {
  ...aero,
  '--font': "Tahoma, 'Segoe UI', sans-serif",
  '--wall': bliss,
  '--title-a': '#0a5ae8',
  '--title-b': '#0831d9',
  '--title-ink': '#fff',
  '--taskbar': '#245edb',
  '--taskbar-ink': '#fff',
  '--orb-a': '#3c9a35',
  '--orb-b': '#2a6a22',
  '--close': '#e0502a',
  '--face': '#ece9d8',
  '--accent': '#316ac5',
  '--heading': '#0b3da8',
  '--paper': '#fff',
  '--ink': '#000',
  '--muted': '#5a5a5a',
}

const themes: Theme[] = [
  t(luna, 'luna', 'Luna Blue', { en: 'Rolling green hills and that blue taskbar.', fr: 'Collines vertes et la fameuse barre bleue.' }, {}),
  t(luna, 'olive', 'Luna Olive', { en: 'The olive-green variant nobody admits using.', fr: 'La variante vert olive que personne n’avoue utiliser.' }, {
    '--wall': bliss.replace('#5fae2e', '#c0a040').replace('#6cbf3a', '#b88a30').replace('#3f8a1e', '#8a6a20').replace('#4a9a2a', '#a07020'),
    '--title-a': '#8aa25a', '--title-b': '#738a4a', '--taskbar': '#596a30', '--accent': '#7a8f4a', '--heading': '#55692a',
  }),
  t(luna, 'silver', 'Luna Silver', { en: 'Brushed metal, very 2005.', fr: 'Métal brossé, très 2005.' }, {
    '--wall': 'radial-gradient(70% 50% at 50% 110%, #8a96a8, transparent), linear-gradient(180deg, #5a6a80, #b8c4d4)',
    '--title-a': '#c4c4d6', '--title-b': '#b0b0c4', '--title-ink': '#222', '--taskbar': '#a8a8bc', '--taskbar-ink': '#000', '--accent': '#6a6a8a', '--heading': '#3a3a5a',
  }),
  t(luna, 'royale', 'Royale', { en: 'The glossy Media Center look everyone hunted for.', fr: 'Le look brillant Media Center que tout le monde cherchait.' }, {
    '--wall': 'radial-gradient(80% 50% at 60% 70%, #3a9ae0aa, transparent), radial-gradient(60% 40% at 30% 40%, #3ae0a0aa, transparent), linear-gradient(160deg, #0a1a4a, #1a4a8a)',
    '--title-a': '#3a6ad8', '--title-b': '#2a4aa8', '--taskbar': '#1a3a8a', '--orb-a': '#2aa02a', '--accent': '#3a6ad8', '--heading': '#1a3a8a',
  }),
  t(luna, 'noir-xp', 'Royale Noir', { en: 'The leaked black Royale, on its original system.', fr: 'Le Royale noir qui avait fuité, sur son système d’origine.' }, {
    '--wall': 'radial-gradient(70% 50% at 50% 110%, #1a2a4a, transparent), #000',
    '--title-a': '#2a2a2e', '--title-b': '#1a1a1e', '--taskbar': '#141418', '--orb-a': '#3a8a3a', '--accent': '#3a5a9a', '--heading': '#1a2a4a',
  }),
  t(luna, 'zune', 'Zune', { en: 'Black and orange, the free theme from the music player.', fr: 'Noir et orange, le thème gratuit du baladeur.' }, {
    '--wall': 'radial-gradient(60% 50% at 70% 60%, #f0802055, transparent), linear-gradient(#111, #222)',
    '--title-a': '#2a2a2a', '--title-b': '#1a1a1a', '--taskbar': '#111', '--orb-a': '#f08020', '--orb-b': '#a04a00', '--close': '#e05a10', '--accent': '#f08020', '--heading': '#c05a00',
  }),
  t(luna, 'watercolor', 'Watercolor', { en: 'Soft pastels from the XP betas, revived by fans.', fr: 'Pastels doux des bêtas d’XP, ressuscités par les fans.' }, {
    '--wall': 'radial-gradient(40% 30% at 30% 40%, #a8c8f0aa, transparent), radial-gradient(35% 30% at 70% 60%, #f0c8d8aa, transparent), radial-gradient(40% 30% at 50% 80%, #c8f0d0aa, transparent), #f4f1ea',
    '--title-a': '#e8ecf5', '--title-b': '#c8d0e8', '--title-ink': '#1a2a5a', '--taskbar': '#d8dff0', '--taskbar-ink': '#1a2a5a', '--wall-ink': '#1a2a5a44', '--wall-blend': 'multiply', '--orb-a': '#8ab0e0', '--orb-b': '#4a70b0', '--accent': '#4a70b0', '--heading': '#2a4a8a',
  }),
  t(luna, 'crystal', 'Crystal', { en: 'Shiny cyan, straight from the transformation packs.', fr: 'Cyan brillant, tout droit des packs de transformation.' }, {
    '--wall': 'radial-gradient(30% 30% at 70% 30%, #ffffff55, transparent), radial-gradient(70% 60% at 30% 80%, #2ac0f0, transparent), linear-gradient(160deg, #0a3a6a, #1a8ac0)',
    '--title-a': '#5ab0e0', '--title-b': '#3a90c8', '--taskbar': '#1f5f99', '--orb-a': '#3ab0ff', '--orb-b': '#1a5a9a', '--accent': '#2a80c0', '--heading': '#1a5a90',
  }),
  t(luna, 'pinkxp', 'Pink Luna', { en: 'Every teenager’s bedroom PC in 2004.', fr: 'Le PC de chambre de tous les ados en 2004.' }, {
    '--wall': bliss.replace('#5fae2e', '#f08ac0').replace('#6cbf3a', '#f0a0d0').replace('#3f8a1e', '#d0609a').replace('#4a9a2a', '#e070b0'),
    '--title-a': '#e05a9a', '--title-b': '#c03a7a', '--taskbar': '#b03070', '--orb-a': '#ff8ac0', '--orb-b': '#a02a60', '--accent': '#c03a7a', '--heading': '#8a1a50',
  }),
]

export const WINDOWSXP: Os = { id: 'xp', name: 'Windows XP', year: 2001, chrome: 'xp', themes, sub: { en: 'The visual styles everyone patched their system for (2001–2008), recreated in CSS.', fr: 'Les styles visuels pour lesquels tout le monde patchait son système (2001–2008), recréés en CSS.' } }

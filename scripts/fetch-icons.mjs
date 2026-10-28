// Downloads each OS's app icons from open-source icon themes, into src/design-system/icons/<chrome>/,
// and writes icons/icons.css (the --icon-* tokens) + icons/CREDITS.md.
//
//   node scripts/fetch-icons.mjs          (set GITHUB_TOKEN to lift the API rate limit)
//
// Every theme below follows the freedesktop naming spec, so one name list works for all of them.
// Add an OS: add a SETS entry. Add an icon: add a NAMES entry (first name found wins).
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { posix } from 'node:path'

/** semantic name (what the site uses) → freedesktop names, in order of preference */
const NAMES = {
  user: ['user-info', 'avatar-default', 'system-users'],
  work: ['x-office-calendar', 'x-office-address-book', 'applications-office'],
  tools: ['preferences-system'],
  folder: ['folder'],
  mail: ['internet-mail', 'mail-client'],
  appearance: ['preferences-desktop-theme', 'preferences-desktop-display'],
  pdf: ['application-pdf'],
  computer: ['computer', 'user-desktop'],
  terminal: ['utilities-terminal', 'terminal', 'org.gnome.Terminal', 'gnome-terminal', 'xterm'],
  // icons inside the apps (skills, projects, under the hood, contact)
  file: ['text-x-generic'],
  code: ['applications-development'],
  location: ['mark-location', 'find-location', 'org.gnome.Maps', 'gnome-maps', 'applications-internet'],
  info: ['dialog-information'],
  display: ['video-display', 'preferences-desktop-display'],
  network: ['network-workgroup'],
  server: ['network-server'],
  cloud: ['weather-overcast', 'org.gnome.Weather', 'folder-remote'],
  ai: ['applications-engineering', 'system-run'],
  check: ['emblem-default', 'dialog-ok'],
  language: ['preferences-desktop-locale', 'locale', 'applications-internet'],
  search: ['system-search'],
  video: ['applications-multimedia', 'video-x-generic'],
  gaming: ['input-gaming'],
  editor: ['accessories-text-editor'],
  windows: ['preferences-system-windows', 'preferences-desktop-display'],
  mouse: ['input-mouse'],
  accessibility: ['preferences-desktop-accessibility'],
  image: ['image-x-generic'],
  keyboard: ['input-keyboard'],
  science: ['applications-science', 'utilities-system-monitor'],
  package: ['package-x-generic'],
  // the Windows themes have no money icon: a calculator there, GnuCash's bills and coins on macOS
  money: ['gnucash-icon', 'accessories-calculator'],
}

/** chrome id (see themes/define.ts) → icon theme. `roots` in order of preference, `names` overrides NAMES. */
const SETS = {
  vista: { repo: 'B00merang-Artwork/Windows-7', branch: 'master', roots: [''], license: 'no license stated', name: 'Windows 7 (B00merang)' },
  classic: { repo: 'grassmunk/Chicago95', branch: 'master', roots: ['Icons/Chicago95/'], names: { folder: ['folder-documents'] }, license: 'GPL-3.0', name: 'Chicago95' },
  xp: { repo: 'B00merang-Artwork/Windows-XP', branch: 'master', roots: [''], license: 'GPL-2.0', name: 'Windows XP (B00merang)' },
  modern: { repo: 'B00merang-Artwork/Windows-10', branch: 'master', roots: [''], license: 'no license stated', name: 'Windows 10 (B00merang)' },
  gnome: { repo: 'ubuntu/yaru', branch: 'master', roots: ['icons/Yaru/'], license: 'CC-BY-SA-4.0', name: 'Yaru' },
  mac: { repo: 'vinceliuice/WhiteSur-icon-theme', branch: 'master', roots: ['src/'], names: { user: ['userinfo'], appearance: ['preferences-desktop-wallpaper'], terminal: ['terminal'] }, license: 'GPL-3.0', name: 'WhiteSur' },
}
/** the default set: declared on [data-chrome], like tokens/base.css (Vista is the reference look) */
const DEFAULT = 'vista'

const OUT = new URL('../src/design-system/icons/', import.meta.url)
const headers = process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}

async function get(url, as = 'json') {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return as === 'json' ? res.json() : Buffer.from(await res.arrayBuffer())
}

const raw = (set, path) => get(`https://raw.githubusercontent.com/${set.repo}/${set.branch}/${path}`, 'buffer')

/** biggest first ('scalable' > 256 > … ; unknown size counts as 48), svg beats png at the same size.
 *  Skips symbolic/dark/@2x variants. */
function score(path) {
  if (/symbolic|dark|@2x/i.test(path)) return -1
  const sizes = [...path.matchAll(/(?:^|\/)(\d+)(?:x\d+)?(?=\/)/g)].map((m) => +m[1])
  const size = /\/scalable\//.test(path) ? 512 : Math.min(sizes.length ? Math.max(...sizes) : 48, 256)
  return size * 2 + (path.endsWith('.svg') ? 1 : 0)
}

/** every matching file, best first: by name preference, then root, then score */
const candidatesFor = (tree, set, names) =>
  names.flatMap((n) =>
    set.roots.flatMap((root) =>
      tree
        .filter((f) => f.path.startsWith(root) && posix.basename(f.path).match(new RegExp(`^${n}\\.(svg|png)$`)))
        .map((f) => [score(f.path), f])
        .filter(([s]) => s >= 0)
        .sort((a, b) => b[0] - a[0])
        .map(([, f]) => f),
    ),
  )

/** follows git symlinks (their blob is the target path); null when the link is broken */
async function download(set, tree, file) {
  for (let i = 0; i < 5; i++) {
    if (file.mode !== '120000') return { path: file.path, data: await raw(set, file.path) }
    const target = posix.normalize(posix.join(posix.dirname(file.path), (await raw(set, file.path)).toString().trim()))
    file = tree.find((f) => f.path === target)
    if (!file) return null
  }
  throw new Error('symlink loop')
}

/** some SVGs (B00merang XP) use xlink:href without declaring the namespace: browsers then draw nothing */
function fixSvg(data) {
  const svg = data.toString()
  if (!svg.includes('xlink:') || svg.includes('xmlns:xlink')) return data
  const ns = (svg.match(/<svg[^>]*\sxmlns=/) ? '' : ' xmlns="http://www.w3.org/2000/svg"') + ' xmlns:xlink="http://www.w3.org/1999/xlink"'
  return svg.replace(/<svg\b/, '<svg' + ns)
}

await rm(OUT, { recursive: true, force: true })
let css = '/* Generated by scripts/fetch-icons.mjs. Do not edit: change the script and run it again. */\n'
let credits = '# Icon credits\n\nGenerated by `scripts/fetch-icons.mjs`.\n\n| Chrome | Icon theme | License | Files |\n|---|---|---|---|\n'

for (const [chrome, set] of Object.entries(SETS)) {
  const { tree } = await get(`https://api.github.com/repos/${set.repo}/git/trees/${set.branch}?recursive=1`)
  const blobs = tree.filter((f) => f.type === 'blob')
  await mkdir(new URL(`${chrome}/`, OUT), { recursive: true })
  const selector = chrome === DEFAULT ? '[data-chrome]' : `[data-chrome='${chrome}']`
  css += `\n/* ${set.name}, ${set.license}: https://github.com/${set.repo} */\n${selector} {\n`
  const used = []
  for (const [name, candidates] of Object.entries(NAMES)) {
    let got = null
    for (const file of candidatesFor(blobs, set, set.names?.[name] ?? candidates)) if ((got = await download(set, blobs, file))) break
    if (!got) throw new Error(`${chrome}: no icon for "${name}" (${candidates.join(', ')})`)
    const { path, data } = got
    const ext = posix.extname(path)
    await writeFile(new URL(`${chrome}/${name}${ext}`, OUT), ext === '.svg' ? fixSvg(data) : data)
    css += `  --icon-${name}: url('./${chrome}/${name}${ext}');\n`
    used.push(`\`${name}\` ← ${path}`)
    console.log(`${chrome.padEnd(8)} ${name.padEnd(11)} ← ${path}`)
  }
  css += '}\n'
  credits += `| ${chrome} | [${set.name}](https://github.com/${set.repo}) | ${set.license} | ${used.join('<br>')} |\n`
}

await writeFile(new URL('icons.css', OUT), css)
await writeFile(new URL('CREDITS.md', OUT), credits)

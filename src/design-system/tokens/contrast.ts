// WCAG 2.2 contrast maths, and the pass that makes every theme readable (AA: 4.5:1 for text).
// Themes copy real OS palettes, and many of those fail AA (macOS blue under white text is 4:1).
// Instead of hand-tuning each theme, text colours are nudged darker (light themes) or lighter
// (dark themes) until they pass. The hue stays, so the theme still looks like itself.

type Rgb = [number, number, number]

/** AA for body text. A hair above 4.5 so color-mix rounding in the browser can't drop below it. */
export const AA = 4.6
/** WCAG 1.4.11, 3:1 for the outline of a control, with the same rounding margin. */
export const UI = 3.1
/** Darkest accent tint text sits on (selected sidebar item: color-mix up to 26%). */
const TINT = 0.3
/** Darkest tint accent-coloured text sits on (selected theme card: 16%). Kept low so accents stay close
 *  to the original OS colour. */
const ACCENT_TINT = 0.16
const WHITE: Rgb = [255, 255, 255]
const BLACK: Rgb = [0, 0, 0]

export function parseHex(s: string): Rgb | null {
  const m = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(s.trim())
  if (!m) return null
  const h = m[1].length <= 4 ? [...m[1]].map((c) => c + c).join('') : m[1]
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb
}

const toHex = (c: Rgb) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
const mix = (a: Rgb, b: Rgb, t: number) => a.map((v, i) => v + (b[i] - v) * t) as Rgb

const luminance = (c: Rgb) => {
  const [r, g, b] = c.map((v) => {
    v /= 255
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG contrast ratio, 1 to 21. */
export function contrast(a: Rgb, b: Rgb) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Moves `fg` toward `away` (black or white) until it reaches `min` against every background
 *  `bgs(candidate)` returns (a function, because a tint of the colour itself can be a background). */
function push(fg: Rgb, away: Rgb, bgs: (c: Rgb) => Rgb[], min = AA) {
  for (let t = 0; t <= 1; t += 0.02) {
    const c = mix(fg, away, t)
    if (bgs(c).every((bg) => contrast(c, bg) >= min)) return c
  }
  return away
}

type Derived = { '--on-accent': string; '--desk-ink': string; '--edge': string }

/** The palette with --ink, --muted, --heading and --accent made readable on --paper and on accent
 *  tints, plus --on-accent (text on an --accent background) and --desk-ink (desktop icon labels:
 *  white, or black on a flat wallpaper too light for white; gradient walls keep white + shadow)
 *  and --edge (outline of a control, e.g. a button, that must stand out from --paper at 3:1). */
export function readable<P extends Record<string, string>>(vars: P): P & Derived {
  const wall = parseHex(vars['--wall'] ?? '')
  const deskInk = wall && contrast(WHITE, wall) < AA ? '#000' : '#fff'
  const paper = parseHex(vars['--paper'] ?? '')
  const accent0 = parseHex(vars['--accent'] ?? '')
  if (!paper || !accent0) return { ...vars, '--on-accent': '#fff', '--desk-ink': deskInk, '--edge': '#767676' }

  // light paper: text gets darker; dark paper: lighter
  const away = contrast(paper, BLACK) >= contrast(paper, WHITE) ? BLACK : WHITE
  const accent = push(accent0, away, (c) => [paper, mix(paper, c, ACCENT_TINT)])
  const tint = mix(paper, accent, TINT)

  const out: Record<string, string> = { ...vars, '--accent': toHex(accent) }
  for (const k of ['--ink', '--muted', '--heading']) {
    const c = parseHex(vars[k] ?? '')
    if (c) out[k] = toHex(push(c, away, () => [paper, tint]))
  }
  out['--on-accent'] = contrast(WHITE, accent) >= AA ? '#fff' : '#000'
  out['--desk-ink'] = deskInk
  // a grey between paper and ink (keeps the theme's tint), darkened/lightened until it reaches 3:1
  const ink = parseHex(vars['--ink'] ?? '') ?? away
  out['--edge'] = toHex(push(mix(paper, ink, 0.35), away, () => [paper], UI))
  return out as P & Derived
}

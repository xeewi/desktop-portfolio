# Design system

The site is a fake desktop that can look like 6 operating systems, each with its own themes.
Everything is split in three layers, and each layer only talks to the one below it.

```
themes/*.ts         palette    --accent, --paper, --wall, --title-a…   (one file per OS)
chromes/*.css       tokens     --win-radius, --ctrl-bg, --task-h…      (one file per OS family)
components/X/       components read tokens only, never know which OS they're on
```

## 1. Palette — `themes/`

A **theme** is a set of colours and fonts. Each OS file has a base palette and a list of themes.
A theme only lists what it changes from that base:

```ts
t(luna, 'zune', 'Zune', { en: '…', fr: '…' }, { '--title-a': '#2a2a2a', '--accent': '#f08020' })
```

The 5th argument is optional, for the rare theme that also tweaks a component:
`{ tokens: {…} }` (every screen size) or `{ desktopTokens: {…} }` (desktop only, e.g. Vista's Aqua traffic lights).

All palette variables and their defaults: `tokens/palette.ts`.

**Readable by construction.** Themes copy real OS colours, and many of those fail WCAG AA. When a theme is
applied (`themeVars`), `readable()` in `tokens/contrast.ts` nudges `--ink`, `--muted`, `--heading` and
`--accent` darker (light themes) or lighter (dark themes) until they reach 4.5:1 on `--paper` and on accent
tints, keeping the hue. It also adds two variables: `--on-accent` (white or black, for text on an accent
background: use it instead of `#fff`), `--desk-ink` (desktop icon labels on a flat wallpaper) and `--edge`
(outline of a control, 3:1 on `--paper`: use it for button borders instead of a pale `color-mix`).
Colours outside the palette (title bars, taskbars) are checked by the axe e2e tests: fix those in the theme.

## 2. Tokens — `tokens/base.css` + `chromes/`

A **chrome** is the look of an OS family: bevels (95), Luna (XP), glass (Vista), flat (10),
GNOME (Ubuntu), macOS. Each chrome file only sets **token values**. No selectors on components.

- `tokens/base.css`: every token with its default (the Vista look), with comments.
- `chromes/_flat.css`: shared by everything except Vista; `chromes/_shell.css`: shared by Ubuntu and macOS.
- Desktop-only values go in the file's `@media (min-width: 761px) and (min-height: 501px)` block.
- `initial` means "no override, the component keeps its own value".

Tokens are declared on `[data-chrome]`, not `:root`: the page *and* each theme preview carry a
`data-chrome` attribute, so a preview can render another OS with the same components.

## 3. Components — `components/X/X.tsx` + `X.css`

- One component per folder. Props in, JSX out: no global state, no `localStorage`, no clock inside.
- The CSS only reads tokens and palette variables (`var(--…)`), never `[data-chrome]` or a theme id.
- States are data or ARIA attributes (`data-active`, `aria-pressed`…), not extra classes.
- Accessible by default (WCAG 2.2 AA): native elements, keyboard support,
  names on icon-only controls, `aria-hidden` on decoration. `.ds-sr-only` hides text from the eye only.
- Bigger pieces are compound: `StartMenu.Root / .Apps / .App…`, `Explorer.Root / .Sidebar…`.

Import from `design-system` (see `index.ts`), and load `styles.css` once at the app root.

## Icons — `icons/`

App icons come from open-source icon themes, one per chrome (Chicago95, B00merang XP / 7 / 10, Yaru, WhiteSur).
Each chrome sets one token per icon, `--icon-user`, `--icon-folder`…, in the generated `icons/icons.css`
(Vista's set is the default, on `[data-chrome]`). `<Icon name="folder" />` shows the current OS's image,
1em square: size it with `font-size`. Only the current chrome's images are downloaded.

`node scripts/fetch-icons.mjs` downloads everything again. The themes all follow the freedesktop naming spec,
so the script maps each icon name to freedesktop names once, for every OS. Credits and licenses: `icons/CREDITS.md`.

## How to…

- **Add a theme**: add a `t(...)` line in the OS file in `themes/`.
- **Change how a component looks on one OS**: change a token in that OS's chrome file.
- **Give a component a new knob**: add the token with its default to `tokens/base.css`, read it in the
  component's CSS, then set it in the chrome files that need it.
- **Add an OS**: a palette file in `themes/` (add it to `themes/index.ts`), a chrome file in `chromes/`
  (add it to `chromes/index.css`), its `Chrome` id in `themes/define.ts`, and its icon theme in `SETS`
  in `scripts/fetch-icons.mjs` (any freedesktop icon theme on GitHub; without one it gets Vista's icons).
- **Add an icon**: a `NAMES` entry in `scripts/fetch-icons.mjs`, the same name in `IconName`
  (`components/Icon/Icon.tsx`), then run the script.
- **Give one theme other icons**: `{ tokens: { '--icon-folder': `url(${importedUrl})` } }` on its `t(...)` line.

## Breakpoints

CSS can't share constants, so they are written out and kept in sync with `runtime/media.ts`:

- touch: `(max-width: 760px), (max-height: 500px)`: full-screen windows, big targets
- desktop: `(min-width: 761px) and (min-height: 501px)`

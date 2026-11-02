---
name: Guillaume Gautier, classic site
description: The site as a talk; a dark room, one lit slide per section, a presenter view in liquid glass that follows the reading and carries the action.
colors:
  signal: "#f2c94c"
  signal-hover: "#f7d977"
  room: "#08090a"
  slide: "#16181c"
  text: "#eceae4"
  soft: "#a9aeb6"
  line: "rgb(255 255 255 / 0.1)"
  on-signal: "#141414"
  logo-tile: "#f4f2ec"
typography:
  display:
    fontFamily: "Mona Sans, system-ui, sans-serif"
    fontSize: "clamp(3rem, 1.2rem + 5.2vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.93
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Mona Sans, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.2rem + 1.8vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  counter:
    fontFamily: "Mona Sans, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  title:
    fontFamily: "Mona Sans, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1rem + 0.9vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  subhead:
    fontFamily: "Mona Sans, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Mona Sans, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Mona Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "Mona Sans, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
  caption:
    fontFamily: "Mona Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
rounded:
  marker: "2px"
  thumb: "6px"
  control: "8px"
  slide: "12px"
  button: "14px"
  presenter: "22px"
  pill: "999px"
spacing:
  gutter: "clamp(0.75rem, 3vw, 2.5rem)"
  pad: "clamp(1.4rem, 5.5vw, 5.25rem)"
  slide-gap: "2.5rem"
  container: "75rem"
  presenter-room: "10.5rem"
components:
  button-signal:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.on-signal}"
    rounded: "{rounded.button}"
    padding: "0 1.4rem"
    height: "3.25rem"
  button-signal-hover:
    backgroundColor: "{colors.signal-hover}"
  button-glass:
    backgroundColor: "rgb(255 255 255 / 0.06)"
    textColor: "{colors.text}"
    rounded: "{rounded.button}"
    padding: "0 1.4rem"
    height: "3.25rem"
  button-glass-hover:
    backgroundColor: "rgb(255 255 255 / 0.11)"
  quiet-control:
    textColor: "{colors.soft}"
    rounded: "{rounded.control}"
    padding: "0 0.7rem"
    height: "2.5rem"
  quiet-control-hover:
    backgroundColor: "rgb(255 255 255 / 0.06)"
    textColor: "{colors.text}"
  slide:
    backgroundColor: "{colors.slide}"
    textColor: "{colors.text}"
    rounded: "{rounded.slide}"
    padding: "{spacing.pad}"
  slide-thumb:
    backgroundColor: "{colors.slide}"
    rounded: "{rounded.thumb}"
    width: "10.5rem"
    height: "5.9rem"
  stack-tag:
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "0.2rem 0.75rem"
  presenter-bar:
    backgroundColor: "rgb(22 24 28 / 0.55)"
    textColor: "{colors.text}"
    rounded: "{rounded.presenter}"
    padding: "1rem 1.25rem 1.5rem 1.75rem"
---

# Design System: Guillaume Gautier, classic site

## Overview

**Creative North Star: "La conférence"**

The classic page (`/classic`) is his talk. The page is a dark room; each section is one lit slide, read by scrolling, never clicked through. A presenter view in liquid glass sits across the bottom of the room: it says which slide you are on, previews the next one, shows a one-line speaker note, and carries the two actions. Content leads: clients, missions, subjects and skills are what the slides hold; the room only frames them.

The room stays black at rest. Light comes from the slides (one charcoal surface with a faint rim and a deep, soft drop into the dark) and from the action (one signal yellow). Each mission slide adds exactly one more colour, its client's brand, as a short rule above the lead. Liquid glass is held to the edges: the presenter bar and the secondary buttons, clear in the middle, light caught at the rim. Everything is set in Mona Sans; hierarchy is size, weight and tight tracking.

Motion is small and honest: the progress line follows the scroll (CSS scroll-driven animation, stepping with the slide number where unsupported or under reduced motion), a mission reached by anchor flashes a yellow ring once, smooth scrolling only without reduced motion, 0.15s colour shifts on hover. Reduced motion zeroes all of it.

**Key Characteristics:**
- Near-black room, charcoal slides, warm off-white text; one signal yellow for what moves or acts.
- One slide per section, deck-numbered in its footer line (01 to 08); missions are one slide per client.
- Each mission's only colour is its client's brand, as a short rule above the lead.
- Liquid glass only on the presenter bar and secondary buttons.
- Mona Sans alone, 400/600/700; tabular numerals for counters and the clock.

## Colors

A warm-neutral dark palette with one yellow voice and one borrowed brand colour per mission.

### Primary
- **Signal Yellow** (`signal`): the primary action's fill ("Email me about a mission", in the presenter and on the closing slide), the progress line, the focus ring, the skip link, the copied-address confirmation, the anchor flash ring, link hover, and text selection at 35%. Its hover is **Signal Lit** (`signal-hover`). Labels on it are **Near Black** (`on-signal`).

### Tertiary
- **Client Brand** (per mission, from content `color`, set as `--brand`): mixed 28% toward white in oklab so black and navy brands still show, drawn only as the 2.75rem × 3px rule above a mission's lead.

### Neutral
- **Room** (`room`): the page ground, the root background and scrollbar track. Nothing sits on it but the top line, the missions divider and the footer.
- **Slide** (`slide`): every slide's surface, the next-slide thumbnail, and the presenter's tint at 55% (97% on phones).
- **Chalk** (`text`): headings, reading text, links at rest, the 2px rule that opens each service, the no-logo monogram tile.
- **Ash** (`soft`): secondary text: leads, offer, nav, meta, slide footers, notes, bullets' body. 8.1:1 on Slide, 9.4:1 on Room.
- **Hairline** (`line`, white 10%): fact, skill, project, talk and aside separators.
- **Logo Tile** (`logo-tile`): the light ground behind client logos, with a 20%-white rim, so dark brand marks read on the slide.

### Named Rules
**The Signal Rule.** Yellow marks only what moves or acts: progress, the primary action, focus, confirmation. Never a heading, a decoration or a second button.

**The One Borrowed Colour Rule.** A mission slide takes its client's brand colour, lifted toward white, as one short rule above the lead, and nowhere else. No other slide has a colour.

## Typography

**Display Font:** Mona Sans (self-hosted variable woff2, normal width), with system-ui
**Body Font:** Mona Sans, with system-ui

**Character:** One grotesque for slide titles and presenter notes alike, as a speaker's deck would use; hierarchy comes from size, weight and negative tracking, never a second face or monospace.

### Hierarchy
- **Display** (700, fluid 3–6rem, 0.93, -0.04em): the name on the title slide only. The closing slide's heading is a step down (fluid 2.5–4.25rem, -0.035em).
- **Headline** (700, fluid 1.75–3rem, 1.08, -0.025em): every slide title; followed by content at 2.5rem.
- **Counter** (700, 2.5rem, tabular): the presenter's "01 / 08" (1.5rem under 960px, 1.25rem under 560px). The title slide's facts use the same voice at 1.875rem.
- **Title** (600, fluid 1.25–1.75rem, 1.25): the professional title under the name.
- **Subhead** (600, 1.25rem, 1.3): service names, client names, and the mission lead (600, 1.45, max 40em).
- **Lead** (400, 1.125rem, Ash, max 40em): slide leads; the offer is fluid 1.0625–1.25rem, max 30em.
- **Body** (400, 1.0625rem, 1.6): reading text; mission points max 44em in Ash.
- **Small** (400 or 600, 0.9375rem): nav, quiet controls, meta, the presenter note.
- **Caption** (400, 0.875rem): slide footers, stack tags, page footer; thumbnails go to 0.75–0.8125rem.

### Named Rules
**The One Voice Rule.** Mona Sans at 400 for reading, 600 for names, labels and buttons, 700 for titles and counters. No second face, no width axis, no monospace.

## Layout

A centred container, `min(75rem, 100% - 2 × gutter)`. The top line sits on the black (4.25rem): name left, section links, then "Desktop mode", FR/EN and live Paris time in tabular figures. Slides follow one per section, 2.5rem apart, with fluid inner padding (`pad`) and extra bottom room for the footer line (number · title left, speaker right, 1.5rem from the bottom edge). The missions section opens with a divider on the black ("04", title, lead) instead of a slide, then one slide per client.

Recurring splits: the title slide is text beside an 18.75rem facts column; missions and talks are 4fr / 8fr, the mission head sticky 1.5rem from the top; services three columns; clients three; skills auto-fill from 13rem; side projects two; the desktop-mode aside is 15rem image beside text. `main` keeps 10.5rem of room under the last slide for the presenter, and scroll padding matches.

The presenter is fixed 1rem above the bottom, at most 85rem wide: counter, next-slide thumbnail, note, actions, with the progress line along its lower rim. Under 1240px the note drops. Under 960px every split collapses to one column, the mission head turns static, the nav wraps to its own line, the next-slide preview drops and the presenter room shrinks to 7.5rem. Under 560px the presenter keeps only the count and the yellow action and turns near-opaque, the clock and the second slide-footer span hide, contact actions go full width, clients sit two-up with 44px logos.

## Elevation & Depth

Three planes: the room, the slides lit above it, the glass presenter floating over both. Slides lift with a hairline rim and one deep ambient drop; the presenter adds blur and a light-catching rim. Nothing else takes a shadow; separators inside a slide are hairlines.

### Shadow Vocabulary
- **Slide** (`box-shadow: 0 0 0 1px rgb(255 255 255 / 0.06), 0 40px 120px -40px rgb(0 0 0 / 0.9)`): every slide.
- **Glass rim** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.22), inset 0 -1px 0 rgb(255 255 255 / 0.04), inset 0 0 0 1px rgb(255 255 255 / 0.1)`): glass buttons.
- **Presenter** (glass rim at 0.05 / 0.08 plus `0 20px 50px -20px rgb(0 0 0 / 0.9)`, `backdrop-filter: blur(22px) saturate(1.6)`, and a 1px 160° gradient border, bright at the top-left and bottom-right corners).
- **Thumbnail / logo rings** (`0 0 0 1px` white 10% / 20%): next-slide thumbnail, client logo tiles.
- **Anchor flash** (`0 0 0 3px` Signal Yellow, fading over 1.8s): a mission reached by link.

### Named Rules
**The Glass At The Edges Rule.** Liquid glass is for the presenter bar and secondary buttons only. Slides are solid; content never sits on glass.

## Shapes

Rounded rectangles whose radius grows with the object: 2px bullet squares and the brand rule, 5–6px thumbnail parts, 8px quiet controls, copy button and the aside image, 12px slides and mission screenshots, 14px buttons and client logos (11px at 44px), 18–22px for the presenter, pill stack tags. Separators are 1px hairlines, except the 2px Chalk rule that opens each service and the 3px progress and brand rules. Icons are stroke SVGs at weight 1.8, round caps and joins, sized 1.15em in text.

## Components

### Buttons
Solid signal for the one action, glass for the rest.
- **Shape:** 14px radius, min height 3.25rem, 0 1.4rem padding, weight 600, optional leading icon with a 0.55rem gap.
- **Signal:** Signal Yellow fill, Near Black label; hover to Signal Lit in 0.15s.
- **Glass:** white 6% fill, Chalk label, Glass rim; hover to white 11%. Resume (PDF), LinkedIn, GitHub.
- **Focus:** 3px Signal Yellow outline, 3px offset, everywhere.

### Chips
- **Stack tag:** static pill, inset 1px white-16% ring, no fill, 0.875rem. Not interactive.

### Cards / Containers
- **Slide** is the container: Slide fill, 12px radius, Slide shadow, fluid padding, footer line in Ash at 0.875rem. Nothing nests inside it as a box; inner structure is hairlines and top rules.

### Navigation
The top line on the black: name (600, Chalk), section links in Ash at 0.9375rem turning Chalk on hover, then quiet controls (no border, white 6% on hover) and the live clock.

### Presenter View (signature)
The liquid-glass bar: the current slide's counter and name (tracked from the slide crossing mid-screen, mission slides naming their client), a 10.5rem × 5.9rem thumbnail of the next slide, a three-line note, the Signal and Glass buttons, and a 3px progress line in Signal Yellow on a white-8% track.

### Mission Slide (signature)
One per client, 4fr / 8fr: a sticky head (56px logo on its light tile, or a Chalk monogram tile; company, role, period, external link) beside the body (the brand rule, the 600 lead, square-bulleted points in Ash, stack tags, a horizontally scrolling strip of real screenshots at 14–20rem tall).

### Copyable Address
The email as text beside a 2.25rem icon button that copies it; the confirmation shows in Signal Yellow.

## Do's and Don'ts

### Do:
- **Do** put every section on one slide, numbered in its footer, and let the page scroll like a page.
- **Do** keep Signal Yellow for progress, the primary action, focus and confirmation only.
- **Do** give a mission slide its client's brand colour, lifted 28% toward white, as the one rule above its lead.
- **Do** keep liquid glass on the presenter bar and secondary buttons only.
- **Do** keep secondary text in Ash (above 8:1 on Slide).
- **Do** use real client logos on the light tile and real product screenshots as the only imagery.
- **Do** keep live chrome honest: slide number, Paris time, nothing invented.
- **Do** set French strings with a narrow no-break space (U+202F) before `:` `;` `?` `!` and curly apostrophes (’).

### Don't:
- **Don't** wear the dev-tool dark landing page: no glow, gradient blobs or neon.
- **Don't** turn the talk into a click-through slideshow; no slide transitions, no scroll hijack.
- **Don't** add a second face or monospace; Mona Sans is a reviewed exception to the overused-font detector (see `.impeccable/config.json`).
- **Don't** put colour on a slide beyond its brand rule and Signal Yellow.
- **Don't** box content inside a slide; use hairlines and top rules.

## The desktop mode

The desktop (`/`, the home page) is a separate surface with its own design system (themed windows, Windows 95 to macOS), in `src/design-system/` and documented in `src/design-system/README.md`. Its styles never load on `/classic` and these never load there. Nothing in this file applies to it.

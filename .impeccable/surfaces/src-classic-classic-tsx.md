---
version: 1
slug: "src-classic-classic-tsx"
primary_target: "src/classic/Classic.tsx"
related_targets: []
---

# Classic site (`/classic`)

Mode: Persuade. Audience: CTO / engineering manager / founder hiring a senior freelance, secondarily recruiters; 30 seconds, often from LinkedIn, desktop or phone. Action: email for a mission; then PDF resume, LinkedIn, GitHub. Proof: clients and missions (logos, product screenshots, what was done), the three things he is brought in for, skills, side projects, talks; the desktop (`/`, the home page since 2026-11-02) stays the deep technical showcase and links here from About me.

User steers (2026-11-02): (1) design serves the content, clients and subjects first; the plain consultant version is kept on branch `classic-plain` as the base. (2) Then: more distinctive and modern, liquid glass on the edges, not too much, must not look AI-made. (3) Re-roll steer: more universal, developer world, dark mode. User chose "La conférence" on the decision page; chosen sketch `.impeccable/mocks/decision/r1-assigned.html`.

## Direction contract

THESIS: The site is his talk: a dark room, each section a lit 16:9-ish slide read by scrolling, and a presenter view in liquid glass that follows the reading and carries the action. Refuses the dev-tool dark landing page (glow, gradient blobs, neon) and the click-through slideshow: the page scrolls like a page.

OWN-WORLD: Room #08090a, slide #16181c, text #eceae4, secondary #a9aeb6, hairlines white 10%. One signal yellow #f2c94c rationed to what moves or acts: progress bar and the primary button. Each mission slide carries its client's brand colour as its only colour (a top edge). Mona Sans, 400/600/700, one grotesque for slide titles and presenter notes alike. Liquid glass only on the presenter bar and the secondary buttons: clear centre, light caught at the rim.

STORY: 01 who (name, title, offer, three true facts), 02 clients, 03 what I'm brought in for (each linked to its missions), 04 missions as one slide per client, 05 expertise, 06 side projects, 07 trainings and talks, 08 contact ("let's work together"), with the desktop mode as a quiet line on the last slide.

FIRST VIEWPORT: Top line on the black: name, sections, Mode bureau, FR/EN, live Paris time. Centre: the title slide, name ~96px, title, offer, a facts column (10+ years, twice CTO, N missions derived from content), email and place in the slide footer. Bottom: the presenter bar in liquid glass: "01 / 08" + slide name, next-slide preview, a one-line note, yellow "Email me about a mission" and glass "Resume (PDF)", the yellow progress line.

FORM: candidate 4 of my grounded list on re-roll 1 (dev, universal, dark), chosen by the user. seed:5ef69e5b2dc17301
Raises: from the minihompy room, small honest live chrome (slide number, Paris time, nothing invented); from Rietveld, colour rationed to what moves; from the design annual, one grotesque for everything; from the plankton sea, the room stays black at rest and light comes from the slide and the action; from the gravity garden, each client keeps its brand colour as the only colour of its slide.
Signature interaction: the presenter bar tracks the slide crossing the middle of the screen (number, name, next slide) and the progress line follows the scroll (CSS scroll-driven animation, static fallback).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

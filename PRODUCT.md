# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19, TypeScript 7, Vite 8. Static site served by nginx (SPA fallback to index.html). Runtime dependencies: `react` and `react-dom` only; every other need (i18n, theming, storage) is hand-written. No new dependency without a strong reason.

## What it is

Guillaume Gautier's personal site: resume and portfolio of a Senior Full-Stack Engineer & AI Workflow Advisor (10+ years, two-time CTO, freelance, Paris · full remote).

Two surfaces share one content source (`src/content/`, English and French, French typed by English):

- **Desktop mode** (`/`, the home page; `/desktop` still works): the resume as a playable desktop (Windows 95 to macOS, 55 themes). The technical showcase, with "Under the hood" explaining every choice, the source browser and test results. Its About me window links to the classic site.
- **Classic site** (`/classic`): the essentials, readable in seconds, for someone deciding whether to contact Guillaume.

## Users and job

- Primary (inferred, approved by the user without detail): a CTO, engineering manager or founder looking for a senior freelance; secondarily a tech recruiter. Limited time, often arriving from LinkedIn or a shared link, on desktop or phone.
- Job: decide quickly whether Guillaume fits (seniority, scope, stack, AI practice), then act.
- Primary action: write to him for a mission (email). Secondary: download the PDF resume, LinkedIn, GitHub.

## Positioning

- Front-end specialist (React, TypeScript) with real back-end and infra practice (NestJS, Node, AWS, Scaleway).
- Brought in to clean up, structure and grow existing codebases: legacy audits, monorepo migrations, design-system consolidation.
- Integrates agentic AI (Claude Code, custom agents) into team workflows and trains developers.
- The site itself is proof of craft: minimal dependencies, accessibility by construction, tests on every theme.

## Evidence and content

All facts live in `src/content/en.ts` / `fr.ts` and `src/content/links.ts`: profile, 7 experiences (Believe, Sunday, Lola Health, Travel retail [client anonymised], Chronogolf, Seaver, Deskover) with logos and product screenshots in `public/xp/`, skills, 4 side projects (MixCoach, noMigrationCost, DirectChange live; wheel2pad in progress), 4 trainings/talks, contact, `public/cv.pdf`. Never invent clients, numbers, testimonials or claims beyond these.

No portrait photo is available.

## Constraints

- WCAG 2.2 AA on every surface; keyboard and screen-reader reachable; respects `prefers-reduced-motion`.
- Bilingual EN/FR, a missing translation is a type error.
- Every feature ships with a test (Vitest for logic, Playwright + axe-core for what a visitor does).

## Brand commitment

Content first, always (user, 2026-11-02): clients, subjects and skills lead the classic site. Its look is modern and distinctive without looking AI-made: dark, developer-universal, liquid glass only on the edges, no glow or gradient blobs. The current form is the talk (each section a slide, a presenter view). A plain conventional version is kept on branch `classic-plain`. Heavy design play stays in the desktop (`/`).

## Voice

Plain, concrete, first person, short sentences; facts over adjectives. No hype.

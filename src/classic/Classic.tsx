import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { content, links, type Content } from '../content'
import costcalc from '../design-system/icons/apps/costcalc.svg'
import directchange from '../design-system/icons/apps/directchange.svg'
import github from '../design-system/icons/apps/github.svg'
import linkedin from '../design-system/icons/apps/linkedin.svg'
import malt from '../design-system/icons/apps/malt.svg'
import mixcoach from '../design-system/icons/apps/mixcoach.svg'
import { useLang } from '../hooks/useLang'
import { anchor } from './anchor'
import './classic.css'

// ponytail: six hand-drawn strokes, one weight; an icon library when this list grows
const ICONS = {
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  download: <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />,
  external: <path d="M14 4h6v6m0-6-9 9m7 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  desktop: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8m-4-4v4" />
    </>
  ),
}

const Icon = ({ name }: { name: keyof typeof ICONS }) => (
  <svg className="cl-icon" viewBox="0 0 24 24" aria-hidden="true">
    {ICONS[name]}
  </svg>
)

function External({ href, c, className, children }: { href: string; c: Content; className?: string; children: ReactNode }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
      <Icon name="external" />
      <span className="cl-sr"> {c.ui.newTab}</span>
    </a>
  )
}

// where else to find me: the same logos the desktop shows (icons/apps.css)
const PROFILES = [
  { name: 'LinkedIn', href: links.linkedin, logo: linkedin },
  { name: 'Malt', href: links.malt, logo: malt },
  { name: 'GitHub', href: links.github, logo: github },
]

/** My profiles, each with its logo: as named links, or as logos alone where room is short. */
function Profiles({ c, iconsOnly }: { c: Content; iconsOnly?: boolean }) {
  return (
    <ul className={iconsOnly ? 'cl-profiles cl-profiles--icons' : 'cl-profiles'}>
      {PROFILES.map((p) => (
        <li key={p.name}>
          <a href={p.href} target="_blank" rel="noreferrer">
            <img src={p.logo} alt="" width={22} height={22} />
            <span className={iconsOnly ? 'cl-sr' : undefined}>{p.name}</span>
            <span className="cl-sr"> {c.ui.newTab}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

/** The address, a link and copyable: a mailto alone does nothing on a machine without a mail app. */
function Address({ c }: { c: Content }) {
  const [copied, setCopied] = useState(false)
  const copy = () =>
    navigator.clipboard?.writeText(links.email).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      },
      () => {}, // clipboard refused: the address stays selectable
    )
  return (
    <p className="cl-address">
      <Icon name="mail" />
      <a href={`mailto:${links.email}`}>{links.email}</a>
      <button type="button" className="cl-copy" onClick={copy} aria-label={c.classic.copy}>
        <Icon name={copied ? 'check' : 'copy'} />
      </button>
      <output>{copied ? c.classic.copied : ''}</output>
    </p>
  )
}

const pad = (n: number) => String(n).padStart(2, '0')

// the side projects' real logos: the same files the desktop shows (icons/apps.css), imported as plain URLs so no desktop CSS comes along
const PROJECT_LOGOS: Partial<Record<string, string>> = { costcalc, directchange, mixcoach }

/** The time in Paris, live: small honest chrome, the kind a talk's screen shows. */
function ParisTime({ c }: { c: Content }) {
  const [now, setNow] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(c.ui.locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'Europe/Paris' })
    const tick = () => setNow(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [c.ui.locale])
  return (
    <span className="cl-now">
      {c.classic.paris} <time>{now}</time>
    </span>
  )
}

/** The slide's footer line, like every deck has: its number and title, the speaker. */
const Foot = ({ n, title, name }: { n: number; title: string; name: string }) => (
  <p className="cl-slide__foot" aria-hidden="true">
    <span>
      {pad(n)} · {title}
    </span>
    <span>{name}</span>
  </p>
)

/** The classic site: the talk. Each section is a slide; the presenter view follows the reading and carries the action. */
export default function Classic() {
  const { lang, toggleLang } = useLang()
  const c = content[lang]
  const k = c.classic
  const xps = c.experiences
  const newest = xps[0]
  const oldest = xps[xps.length - 1]
  const name = c.profile.name
  const slides = [k.slideIntro, k.clientsTitle, k.servicesTitle, k.workTitle, k.skillsTitle, c.ui.projectsTitle, c.ui.talksTitle, c.ui.contactTitle]

  // the slide crossing the middle of the screen is the one being presented
  const [at, setAt] = useState({ n: 1, sub: '' })
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const el = e.target as HTMLElement
          setAt({ n: Number(el.dataset.slide), sub: el.dataset.sub ?? '' })
        }
      },
      { rootMargin: '-45% 0px -54% 0px' },
    )
    document.querySelectorAll('[data-slide]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [lang])
  const next = slides[at.n] // slides is 0-based, at.n 1-based: this is the following one
  // what the next slide holds, in one line: the preview is a miniature, not an empty box
  const logos = xps.filter((e) => e.logo)
  const previews = [
    '',
    logos.map((e) => e.company).join(', '),
    k.services.map((s) => s.title).join(' · '),
    xps.map((e) => e.company).join(', '),
    c.skills.map((s) => s.group).join(' · '),
    c.projects.map((p) => p.name).join(' · '),
    c.talks[0],
    links.email,
  ]
  const note = k.notes[at.n - 1]

  return (
    <div className="cl" id="top">
      <a className="cl-skip" href="#main">
        {k.skip}
      </a>
      <header className="cl-top cl-wrap">
        <a className="cl-brand" href="#top">
          {name}
        </a>
        <nav className="cl-nav" aria-label={k.navLabel}>
          <a href="#work">{k.nav.work}</a>
          <a href="#expertise">{k.nav.expertise}</a>
          <a href="#projects">{k.nav.projects}</a>
          <a href="#contact">{k.nav.contact}</a>
        </nav>
        <div className="cl-tools">
          <Profiles c={c} iconsOnly />
          <a className="cl-quiet" href="/">
            <Icon name="desktop" />
            <span className="cl-hide-s">{k.desktopMode}</span>
          </a>
          <button type="button" className="cl-quiet" onClick={toggleLang}>
            {lang.toUpperCase()}
            <span className="cl-sr" lang={lang === 'en' ? 'fr' : 'en'}>
              , {c.ui.switchLang}
            </span>
          </button>
          <ParisTime c={c} />
        </div>
      </header>

      <main id="main" className="cl-wrap">
        <section className="cl-slide cl-title" data-slide="1" aria-labelledby="cl-name">
          <div>
            <h1 id="cl-name">{name}</h1>
            <p className="cl-role">{c.profile.title}</p>
            <p className="cl-offer">{k.offer}</p>
          </div>
          <dl className="cl-facts">
            <div>
              <dt>{k.facts.years}</dt>
              <dd>{k.facts.yearsText}</dd>
            </div>
            <div>
              <dt>{k.facts.cto}</dt>
              <dd>{k.facts.ctoText}</dd>
            </div>
            <div>
              <dt>{k.facts.missions(xps.length)}</dt>
              <dd>{k.facts.missionsText(`${oldest.company} (${oldest.period.slice(0, 4)})`, `${newest.company} (${newest.period.slice(0, 4)})`)}</dd>
            </div>
          </dl>
          <div className="cl-title__foot">
            <Address c={c} />
            <Profiles c={c} />
            <p>{c.profile.location}</p>
          </div>
        </section>

        <section className="cl-slide" data-slide="2" aria-labelledby="clients-h">
          <h2 id="clients-h">{k.clientsTitle}</h2>
          <ul className="cl-clients">
            {xps
              .filter((e) => e.logo)
              .map((e) => (
                <li key={e.company}>
                  <a href={`#${anchor(e.company)}`}>
                    <img className="cl-logo" src={e.logo} alt="" width={56} height={56} />
                    <span>
                      {e.company}
                      <small>{e.period}</small>
                    </span>
                  </a>
                </li>
              ))}
          </ul>
          <Foot n={2} title={k.clientsTitle} name={name} />
        </section>

        <section className="cl-slide" data-slide="3" aria-labelledby="services-h">
          <h2 id="services-h">{k.servicesTitle}</h2>
          <ul className="cl-services">
            {k.services.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <p className="cl-where">
                  {k.servicesWhere}{' '}
                  {s.where.map((w, i) => (
                    <span key={w}>
                      <a href={`#${anchor(w)}`}>{w}</a>
                      {i < s.where.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ul>
          <Foot n={3} title={k.servicesTitle} name={name} />
        </section>

        <section id="work" aria-labelledby="work-h">
          <header className="cl-divider">
            <span aria-hidden="true">04</span>
            <div>
              <h2 id="work-h">{k.workTitle}</h2>
              <p>{k.workLead}</p>
            </div>
          </header>
          <ol className="cl-cases">
            {xps.map((e, i) => (
              <li
                key={e.company}
                id={anchor(e.company)}
                className="cl-slide cl-case"
                data-slide="4"
                data-sub={e.company}
                style={{ '--brand': e.color } as CSSProperties}
              >
                <div className="cl-case__head">
                  {e.logo ? (
                    <img className="cl-logo" src={e.logo} alt="" width={56} height={56} />
                  ) : (
                    <span className="cl-case__nologo" aria-hidden="true">
                      {e.company.split(' ').map((w) => w[0].toUpperCase())}
                    </span>
                  )}
                  <div>
                    <h3>{e.company}</h3>
                    <p className="cl-case__role">{e.role}</p>
                    <p className="cl-muted">
                      {e.period} · {e.place}
                    </p>
                    {e.link ? (
                      <External className="cl-link" href={e.link.href} c={c}>
                        {e.link.label}
                      </External>
                    ) : (
                      <p className="cl-muted">{k.anonymised}</p>
                    )}
                  </div>
                </div>
                <div className="cl-case__body">
                  <p className="cl-case__lead">{e.lead}</p>
                  <ul className="cl-points">
                    {e.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <p className="cl-stack">
                    <span className="cl-sr">{k.stackLabel}: </span>
                    {e.stack.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </p>
                  {e.shots && (
                    // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrolls sideways on a phone: the keyboard must reach it
                    <div className="cl-shots" tabIndex={0}>
                      {e.shots.map((s) => (
                        <img key={s.src} src={s.src} alt={s.alt} loading="lazy" />
                      ))}
                    </div>
                  )}
                </div>
                <Foot n={4} title={`${k.workTitle} ${i + 1}/${xps.length}`} name={name} />
              </li>
            ))}
          </ol>
        </section>

        <section id="expertise" className="cl-slide" data-slide="5" aria-labelledby="skills-h">
          <h2 id="skills-h">{k.skillsTitle}</h2>
          <dl className="cl-skills">
            {c.skills.map((s) => (
              <div key={s.group}>
                <dt>{s.group}</dt>
                <dd>
                  <ul>
                    {s.items.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
          <Foot n={5} title={k.skillsTitle} name={name} />
        </section>

        <section id="projects" className="cl-slide" data-slide="6" aria-labelledby="projects-h">
          <h2 id="projects-h">{c.ui.projectsTitle}</h2>
          <p className="cl-lead">{c.ui.projectsSub}</p>
          <ul className="cl-projects">
            {c.projects.map((p) => (
              <li key={p.name}>
                <div className="cl-project__head">
                  {PROJECT_LOGOS[p.icon] ? (
                    <img className="cl-project__logo" src={PROJECT_LOGOS[p.icon]} alt="" width={44} height={44} />
                  ) : (
                    // ponytail: no logo yet (wheel2pad): its initial, in the same tile
                    <span className="cl-project__logo cl-project__logo--none" aria-hidden="true">
                      {p.name[0].toUpperCase()}
                    </span>
                  )}
                  <h3>{p.name}</h3>
                </div>
                <p>{p.desc}</p>
                <p className="cl-muted">{p.stack.join(' · ')}</p>
                {p.opens && (
                  <External className="cl-link" href={links[p.opens]} c={c}>
                    {c.ui.openProject(p.name)}
                  </External>
                )}
              </li>
            ))}
          </ul>
          <Foot n={6} title={c.ui.projectsTitle} name={name} />
        </section>

        <section className="cl-slide cl-talks" data-slide="7" aria-labelledby="talks-h">
          <h2 id="talks-h">{c.ui.talksTitle}</h2>
          <ul>
            {c.talks.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <Foot n={7} title={c.ui.talksTitle} name={name} />
        </section>

        <section id="contact" className="cl-slide cl-contact" data-slide="8" aria-labelledby="contact-h">
          <h2 id="contact-h">{c.ui.contactTitle}</h2>
          <p className="cl-lead">{c.ui.contactText}</p>
          <div className="cl-actions">
            <a className="cl-btn" href={`mailto:${links.email}`}>
              <Icon name="mail" />
              {k.mission}
            </a>
            <a className="cl-btn cl-btn--glass" href="/cv.pdf" download>
              <Icon name="download" />
              {c.ui.cvShort}
            </a>
            {PROFILES.map((p) => (
              <External key={p.name} className="cl-btn cl-btn--glass" href={p.href} c={c}>
                <img className="cl-btn__logo" src={p.logo} alt="" width={22} height={22} />
                {p.name}
              </External>
            ))}
          </div>
          <Address c={c} />
          <div className="cl-aside">
            <img src="/classic/desktop-mode.webp" alt={k.siteShot} width={2560} height={1520} loading="lazy" />
            <div>
              <h3>{k.siteTitle}</h3>
              <p>{k.siteText}</p>
              <a className="cl-link" href="/">
                <Icon name="desktop" />
                {k.launch}
              </a>
            </div>
          </div>
          <Foot n={8} title={c.ui.contactTitle} name={name} />
        </section>

        <footer className="cl-foot">
          <a href={`mailto:${links.email}`}>{links.email}</a>
          <Profiles c={c} />
          <p>
            © {name} · {k.footer}
          </p>
        </footer>
      </main>

      <aside className="cl-presenter" aria-label={k.presenter}>
        <p className="cl-count">
          <b>
            {pad(at.n)} / {pad(slides.length)}
          </b>
          <span>{at.sub || slides[at.n - 1]}</span>
        </p>
        {next && (
          <div className="cl-next" aria-hidden="true">
            <span className="cl-thumb">
              <b>{next}</b>
              {at.n === 1 || at.n === 3 ? (
                <span className="cl-thumb__logos">
                  {logos.map((e) => (
                    <img key={e.company} className="cl-logo" src={e.logo} alt="" width={20} height={20} />
                  ))}
                </span>
              ) : (
                <span className="cl-thumb__line">{previews[at.n]}</span>
              )}
            </span>
            <small>
              {k.next}
              <br />
              {pad(at.n + 1)}
            </small>
          </div>
        )}
        <p className="cl-note">
          <b>{k.noteLabel}</b>
          {note}
        </p>
        <div className="cl-presenter__actions">
          <a className="cl-btn" href={`mailto:${links.email}`}>
            <Icon name="mail" />
            {k.mission}
          </a>
          <a className="cl-btn cl-btn--glass" href="/cv.pdf" download>
            <Icon name="download" />
            {c.ui.cvShort}
          </a>
        </div>
        <span className="cl-progress" aria-hidden="true">
          <i style={{ '--p': at.n / slides.length } as CSSProperties} />
        </span>
      </aside>
    </div>
  )
}

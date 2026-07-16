import { useEffect, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  Clapperboard,
  Inbox,
  Link2,
  Lock,
  Minus,
  Radar,
  ScrollText,
  Sparkles,
  Store,
  ToyBrick,
  UserCheck,
  Users,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { StatusPill } from '@/components/ui/StatusPill'
import { PreviewWidget } from '@/components/ui/PreviewWidget'
import { AskAnseraShowcase } from '@/components/askAnsera/AskAnseraShowcase'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { WaitlistForm } from '@/components/landing/WaitlistForm'
import {
  BlankSiteScene,
  ClutterScene,
  ControlScene,
  HeroScene,
  RingLightScene,
  ScrollScene,
} from '@/components/landing/scenes'

/* ---------------------------------------------------------------- content */

const ANCHOR_NAV = [
  { label: 'Modules', href: '#modules' },
  { label: 'Why Ansera', href: '#fragmented' },
  { label: 'Ask Ansera', href: '#ask-ansera' },
  { label: 'Security', href: '#security' },
]

const USE_CASE_CHIPS = [
  'Dropshippers',
  'Solo founders',
  'E-commerce brands',
  'Content-led sellers',
  'Agencies',
]

const MODULES = [
  {
    id: 'inbox',
    name: 'Ansera Inbox',
    live: true,
    icon: Inbox,
    tagline: 'AI Customer Support',
    appPath: '/inbox',
    card: 'AI drafts every customer reply using your own past responses and store data — you approve once, and it learns. High-confidence replies send themselves.',
    detail:
      'Every reply drafted from your store’s real data and your own past corrections. Auto-send when confidence is high, review when it isn’t.',
    preview: ['Draft ready', '“Re: Order #4127 shipping delay”', '94% confidence', 'Auto-sent'],
  },
  {
    id: 'sites',
    name: 'Ansera Sites',
    live: false,
    icon: Store,
    tagline: 'AI Website Builder',
    appPath: '/sites',
    card: 'Tell Ansera what you sell and who you sell to. It generates a complete, live storefront — copy, layout, and product pages included — in minutes, not weeks.',
    detail:
      'Describe your store in a sentence. Get a complete, editable storefront — product pages, checkout flow, and brand-matched design — generated end to end.',
    preview: ['Generating storefront', '“Minimalist skincare brand, 12 products”', '6 pages built'],
  },
  {
    id: 'scout',
    name: 'Ansera Scout',
    live: false,
    icon: Radar,
    tagline: 'Winning Product Discovery',
    appPath: '/scout',
    card: 'AI continuously scans marketplaces, ad libraries, and social trends to surface products with rising demand and low competition, before they’re everywhere.',
    detail:
      'AI tracks demand signals across marketplaces and social platforms, ranks products by rising-interest and low-saturation, and explains why.',
    preview: ['Trending', 'Ceramic plant pots', '+340% search interest', 'Low ad saturation'],
  },
  {
    id: 'studio',
    name: 'Ansera Studio',
    live: false,
    icon: Clapperboard,
    tagline: 'Automated Video & Posting',
    appPath: '/studio',
    card: 'Feed it your product catalog. Ansera Studio generates short-form video content and posts it to Instagram and TikTok on a schedule — no filming, no editing, no manual posting.',
    detail:
      'From product photos to posted content — Ansera Studio scripts, generates, and schedules short-form video across Instagram and TikTok.',
    preview: ['Scheduled', '3 videos this week', 'TikTok + Instagram Reels', 'Auto-posting Tue/Thu/Sat'],
  },
]

const PAIN_POINTS = [
  {
    headline: 'Support that doesn’t scale',
    body: 'Every reply written from scratch is an hour you didn’t spend sourcing or marketing. Generic help-desk software wasn’t built to sound like you.',
    link: { label: 'See Ansera Inbox', href: '#inbox' },
    Scene: ClutterScene,
  },
  {
    headline: 'Building a store takes weeks you don’t have',
    body: 'By the time a website is live, the trend it was built around has already moved on. Speed to launch is the whole game.',
    link: { label: 'See Ansera Sites', href: '#sites' },
    Scene: BlankSiteScene,
  },
  {
    headline: 'Winning products get found by everyone at once',
    body: 'Manually scrolling for trending products means you’re always reacting to what’s already saturated, never ahead of it.',
    link: { label: 'See Ansera Scout', href: '#scout' },
    Scene: ScrollScene,
  },
  {
    headline: 'Content is the bottleneck, not the idea',
    body: 'You know what would sell. You don’t have six hours a day to film, edit, and post it across two platforms.',
    link: { label: 'See Ansera Studio', href: '#studio' },
    Scene: RingLightScene,
  },
]

const SUITE_POINTS = [
  {
    icon: Link2,
    title: 'Everything connected by default',
    body: 'Customer questions surface product gaps Scout can act on. Site traffic informs what Studio should promote next. No manual exporting between tools.',
  },
  {
    icon: Sparkles,
    title: 'Intelligence that helps you decide',
    body: 'Not just automation — an AI layer that explains why it drafted a reply the way it did, or why it flagged a product as rising.',
  },
  {
    icon: ToyBrick,
    title: 'Start with what you need',
    body: 'Use Ansera Inbox today. Add Sites, Scout, or Studio when you’re ready. No forced bundle.',
  },
]

const COMPARISON_ROWS = [
  {
    feature: 'Full business operating layer',
    detail: 'Support, storefront, sourcing, and content in one platform, not five subscriptions.',
    ansera: 'All-in-one',
    others: 'Fragmented',
  },
  {
    feature: 'Learns from your corrections',
    detail: 'Every edit you make trains the system, it doesn’t repeat the same mistake twice.',
    ansera: 'Adaptive',
    others: 'Static',
  },
  {
    feature: 'AI woven through every module',
    detail:
      'Not a chatbot bolted onto a dashboard; intelligence in sourcing, support, and content generation alike.',
    ansera: 'Built in',
    others: 'Not available',
  },
  {
    feature: 'Start with one module, no forced bundle',
    detail: 'Use what you need today, add modules as you grow.',
    ansera: 'Modular',
    others: 'All-or-nothing',
  },
  {
    feature: 'Built for operators, not just enterprises',
    detail: 'Designed for solo founders and small teams, not procurement committees.',
    ansera: 'Everyone',
    others: 'Enterprise-only',
  },
]

const DIFFERENT_POINTS = [
  {
    title: 'A calm, focused interface',
    body: 'Designed for clarity, not clutter. Every screen shows exactly what needs your attention, nothing else.',
  },
  {
    title: 'Automations that save hours',
    body: 'Reduce manual work with auto-send thresholds, scheduled content, and AI-ranked product alerts.',
  },
  {
    title: 'You’re always one edit away from control',
    body: 'Every AI action is reviewable and reversible. Automation with a human still in the loop when it matters.',
  },
]

const SEGMENTS = [
  {
    title: 'Dropshippers & Sourcers',
    body: 'Find winning products before they saturate, and let support run itself while you focus on sourcing.',
  },
  {
    title: 'Solo Founders',
    body: 'Run support, storefront, and marketing without hiring — Ansera covers the work a small team would normally split.',
  },
  {
    title: 'E-commerce Brands',
    body: 'Connect support insight directly to product and content decisions instead of guessing what to promote next.',
  },
  {
    title: 'Content-Led Sellers',
    body: 'Turn your product catalog into a constant stream of posted video content without touching a camera.',
  },
]

const INTEGRATIONS = ['Gmail', 'Shopify', 'Instagram', 'TikTok', 'Stripe', 'WooCommerce', 'Slack', 'Zapier']

const TRUST_BADGES = [
  {
    icon: Lock,
    title: 'Encrypted in transit and at rest',
    body: 'Customer and store data is encrypted end to end. Keys rotated automatically.',
  },
  {
    icon: Users,
    title: 'Role-based access controls',
    body: 'Granular permissions for every team member — control who can approve auto-sends, edit sites, or publish content.',
  },
  {
    icon: UserCheck,
    title: 'Human-in-the-loop by default',
    body: 'AI drafts, you approve, until you explicitly raise the auto-send threshold. Nothing sends without your configured confidence level.',
  },
  {
    icon: ScrollText,
    title: 'Full audit trail',
    body: 'Every AI action — draft, edit, send, post — is logged and reviewable.',
  },
]

/* ------------------------------------------------------------- primitives */

/** Anchor styled like the Button component, for in-page CTAs. */
function CtaLink({
  href,
  className = '',
  children,
}: {
  href: string
  className?: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-all duration-150 ease-out hover:bg-accent-hover hover:shadow-card active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page ${className}`}
    >
      {children}
    </a>
  )
}

function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string
  title: string
  intro?: string
}) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      {eyebrow && (
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-accent">{eyebrow}</p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-base leading-relaxed text-ink-secondary">{intro}</p>}
    </div>
  )
}

function StatusBadgePill({ live }: { live: boolean }) {
  return <StatusPill tone={live ? 'live' : 'muted'}>{live ? 'Live' : 'Coming soon'}</StatusPill>
}

/* ------------------------------------------------------------------ page */

export function HomePage() {
  const location = useLocation()

  // Router navigations like "/#waitlist" (topbar Join Waitlist from another
  // tab) don't trigger native anchor scrolling — do it after render. Plain
  // in-page anchor clicks scroll natively and never reach this effect.
  useEffect(() => {
    if (!location.hash) return
    document.getElementById(location.hash.slice(1))?.scrollIntoView()
  }, [location])

  return (
    <div>
      {/* slim in-page anchor nav — sticks under the topbar (main is the scroll container) */}
      <div className="sticky top-0 z-30 border-b border-border-light bg-page/85 backdrop-blur">
        <nav
          aria-label="Home sections"
          className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-1 px-6 py-2.5"
        >
          {ANCHOR_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-ink-secondary transition-colors duration-150 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <main>
        {/* 1 — hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-14 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-wide text-accent">
              The AI operating system for your online business
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
              Run your online business the way you do — with AI doing the work.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-secondary">
              Support, storefronts, product research, and content — one AI suite instead of five
              disconnected tools.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <CtaLink href="#waitlist">Join Waitlist</CtaLink>
              <Link
                to="/inbox"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors duration-150 hover:text-accent-hover"
              >
                See what's live
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
          <div className="aspect-video overflow-hidden rounded-2xl shadow-raised">
            <HeroScene />
          </div>
        </section>

        {/* use-case chips strip */}
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-2 px-6 pb-20">
          <span className="mr-1 text-sm text-ink-muted">Built for</span>
          {USE_CASE_CHIPS.map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-surface px-4 py-1.5 text-sm text-ink-secondary shadow-soft"
            >
              {chip}
            </span>
          ))}
        </div>

        {/* 2 — module grid */}
        <section id="modules" className="scroll-mt-16 bg-surface py-20">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading
              title="Everything you do to run your business. All in one place."
              intro="Not another support widget. A unified operating layer for launching, sourcing, marketing, and supporting an online business."
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {MODULES.map((module) => (
                <div
                  key={module.id}
                  className="flex flex-col rounded-2xl bg-page p-6 shadow-soft transition-shadow duration-200 hover:shadow-card"
                >
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-accent-tint">
                    <module.icon className="size-5 text-accent" aria-hidden />
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-base font-semibold text-ink">{module.name}</h3>
                  </div>
                  <div className="mb-3">
                    <StatusBadgePill live={module.live} />
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-ink-secondary">{module.card}</p>
                  <a
                    href={`#${module.id}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors duration-150 hover:text-accent-hover"
                  >
                    Learn more
                    <ArrowRight className="size-3.5" aria-hidden />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3 — the cost of running fragmented */}
        <section id="fragmented" className="scroll-mt-16 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading
              title="The cost of running fragmented"
              intro="Most online sellers run their business across five or six disconnected tools. Every handoff between them is where time, money, and momentum get lost."
            />
            <div className="grid gap-8 sm:grid-cols-2">
              {PAIN_POINTS.map((pain) => (
                <div
                  key={pain.headline}
                  className="overflow-hidden rounded-2xl bg-surface shadow-card"
                >
                  <div className="aspect-[16/9]">
                    <pain.Scene />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-ink">{pain.headline}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{pain.body}</p>
                    <a
                      href={pain.link.href}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors duration-150 hover:text-accent-hover"
                    >
                      {pain.link.label}
                      <ArrowRight className="size-3.5" aria-hidden />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4 — one suite, every stage */}
        <section id="suite" className="scroll-mt-16 bg-surface py-20">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading
              title="One suite. Every stage of your business."
              intro="Ansera connects support, storefronts, sourcing, and content into a single coherent layer — so insights from one module inform the others."
            />
            <div className="grid gap-6 md:grid-cols-3">
              {SUITE_POINTS.map((point) => (
                <div key={point.title} className="rounded-2xl bg-page p-6 shadow-soft">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-accent-tint">
                    <point.icon className="size-5 text-accent" aria-hidden />
                  </div>
                  <h3 className="text-base font-semibold text-ink">{point.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{point.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5 — detailed module breakdown */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading eyebrow="The modules" title="A closer look at each one." />
            <div className="grid gap-6 md:grid-cols-2">
              {MODULES.map((module) => (
                <Card key={module.id} id={module.id} className="scroll-mt-20 flex flex-col">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-ink">
                      {module.name}
                      <span className="font-normal text-ink-muted"> — {module.tagline}</span>
                    </h3>
                    <StatusBadgePill live={module.live} />
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-ink-secondary">{module.detail}</p>
                  <div className="mt-5">
                    <PreviewWidget parts={module.preview} live={module.live} />
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <Link
                      to={module.appPath}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors duration-150 hover:text-accent-hover"
                    >
                      {module.live ? 'Open Ansera Inbox' : 'Open in app'}
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                    {!module.live && (
                      <a
                        href="#waitlist"
                        className="text-sm text-ink-muted transition-colors duration-150 hover:text-ink"
                      >
                        Join the waitlist for early access
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 6 — comparison table */}
        <section id="compare" className="scroll-mt-16 bg-surface py-20">
          <div className="mx-auto max-w-5xl px-6">
            <SectionHeading title="Not another point solution" />
            <div className="overflow-x-auto">
              <div className="min-w-[640px] overflow-hidden rounded-2xl bg-page shadow-card">
                <div className="grid grid-cols-[1.6fr_1fr_1fr] border-b border-border-light">
                  <div className="px-6 py-4" />
                  <div className="px-6 py-4 text-sm font-semibold text-ink">Ansera</div>
                  <div className="px-6 py-4 text-sm font-semibold text-ink-muted">Others</div>
                </div>
                {COMPARISON_ROWS.map((row, i) => (
                  <div
                    key={row.feature}
                    className={`grid grid-cols-[1.6fr_1fr_1fr] items-center ${
                      i > 0 ? 'border-t border-border-light' : ''
                    }`}
                  >
                    <div className="px-6 py-5">
                      <p className="text-sm font-semibold text-ink">{row.feature}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{row.detail}</p>
                    </div>
                    <div className="flex items-center gap-2 px-6 py-5">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-tint">
                        <Check className="size-3.5 text-accent" aria-hidden />
                      </span>
                      <span className="text-sm font-medium text-ink">{row.ansera}</span>
                    </div>
                    <div className="flex items-center gap-2 px-6 py-5">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-hover">
                        <Minus className="size-3.5 text-ink-muted" aria-hidden />
                      </span>
                      <span className="text-sm text-ink-muted">{row.others}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7 — support that feels different */}
        <section id="different" className="scroll-mt-16 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading
              title="Support that feels different"
              intro="Built with the same care as the tools you already trust with your business."
            />
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div className="aspect-[16/10] overflow-hidden rounded-2xl shadow-raised">
                <ControlScene />
              </div>
              <div className="flex flex-col gap-8">
                {DIFFERENT_POINTS.map((point) => (
                  <div key={point.title}>
                    <h3 className="text-base font-semibold text-ink">{point.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{point.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 8 — ask ansera */}
        <section id="ask-ansera" className="scroll-mt-16 bg-surface py-20">
          <div className="mx-auto max-w-4xl px-6">
            <SectionHeading
              eyebrow="Ask Ansera"
              title="Signals in. Next steps out."
              intro="Ansera reads the signals across your support tickets, storefront traffic, product trends, and content performance — then turns them into clear next steps."
            />
            <AskAnseraShowcase on="surface" />
          </div>
        </section>

        {/* 9 — built for the way you sell */}
        <section id="segments" className="scroll-mt-16 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading title="Built for the way you sell" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {SEGMENTS.map((segment) => (
                <div key={segment.title} className="rounded-2xl bg-surface p-6 shadow-soft">
                  <h3 className="text-base font-semibold text-ink">{segment.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{segment.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10 — integrations */}
        <section className="bg-surface py-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-xl font-semibold text-ink">Works with the tools you already use.</h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {INTEGRATIONS.map((name) => (
                <span
                  key={name}
                  className="rounded-full bg-page px-5 py-2 text-sm font-medium text-ink-secondary shadow-soft"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 11 — trust & security */}
        <section id="security" className="scroll-mt-16 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading title="Built on trust" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST_BADGES.map((badge) => (
                <div key={badge.title} className="rounded-2xl bg-surface p-6 shadow-soft">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-accent-tint">
                    <badge.icon className="size-5 text-accent" aria-hidden />
                  </div>
                  <h3 className="text-base font-semibold text-ink">{badge.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{badge.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 12 — waitlist */}
        <section id="waitlist" className="scroll-mt-16 bg-surface py-20">
          <div className="mx-auto max-w-3xl px-6">
            <SectionHeading
              title="The future of running your business starts here."
              intro="Ansera Inbox is live today. Join the waitlist for early access to Sites, Scout, and Studio as each one ships."
            />
            <WaitlistForm />
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}

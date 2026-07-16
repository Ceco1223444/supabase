import { Wordmark } from '@/components/layout/Wordmark'

type FooterLink = { label: string; href: string; soon?: boolean }

const COLUMNS: { heading: string; links: FooterLink[] }[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Ansera Inbox', href: '#inbox' },
      { label: 'Ansera Sites', href: '#sites', soon: true },
      { label: 'Ansera Scout', href: '#scout', soon: true },
      { label: 'Ansera Studio', href: '#studio', soon: true },
    ],
  },
  {
    heading: 'Solutions',
    links: [
      { label: 'Dropshippers & Sourcers', href: '#segments' },
      { label: 'Solo Founders', href: '#segments' },
      { label: 'E-commerce Brands', href: '#segments' },
      { label: 'Content-Led Sellers', href: '#segments' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Help center', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Contact', href: 'mailto:hello@ansera.app' },
    ],
  },
]

export function LandingFooter() {
  return (
    <footer className="border-t border-border-light bg-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 py-14 sm:grid-cols-4">
        {COLUMNS.map((column) => (
          <div key={column.heading}>
            <h3 className="mb-4 text-sm font-semibold text-ink">{column.heading}</h3>
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.label} className="flex items-center gap-2">
                  <a
                    href={link.href}
                    className="text-sm text-ink-secondary transition-colors duration-150 hover:text-ink"
                  >
                    {link.label}
                  </a>
                  {link.soon && (
                    <span className="rounded-full bg-surface-hover px-2 py-0.5 text-[10px] font-medium text-ink-muted">
                      Coming soon
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border-light">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-8 sm:flex-row sm:justify-between">
          <div className="scale-75 sm:origin-left">
            <Wordmark />
          </div>
          <p className="text-sm text-ink-muted">The AI operating system for your online business.</p>
          <p className="text-sm text-ink-muted">© 2026 Ansera</p>
        </div>
      </div>
    </footer>
  )
}

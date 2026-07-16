// Suite module registry — drives the topbar module switcher, the per-module
// tab row, and the login gate. One shell for everyone: Home and the preview
// modules are public, Inbox (real data) requires an account.
export type ModuleId = 'home' | 'inbox' | 'sites' | 'scout' | 'studio'
export type PreviewModuleId = 'sites' | 'scout' | 'studio'

export const SUITE_MODULES: {
  id: ModuleId
  label: string
  to: string
  pill: 'live' | 'preview' | null
  requiresAuth: boolean
}[] = [
  { id: 'home', label: 'Home', to: '/', pill: null, requiresAuth: false },
  { id: 'inbox', label: 'Inbox', to: '/inbox', pill: 'live', requiresAuth: true },
  { id: 'sites', label: 'Sites', to: '/sites', pill: 'preview', requiresAuth: false },
  { id: 'scout', label: 'Scout', to: '/scout', pill: 'preview', requiresAuth: false },
  { id: 'studio', label: 'Studio', to: '/studio', pill: 'preview', requiresAuth: false },
]

// The Inbox-era routes stay top-level (/analytics, /settings, …), so any
// non-empty section that isn't a preview module belongs to Inbox.
export function moduleFromPathname(pathname: string): ModuleId {
  const section = pathname.split('/')[1] ?? ''
  if (section === '') return 'home'
  if (section === 'sites' || section === 'scout' || section === 'studio') return section
  return 'inbox'
}

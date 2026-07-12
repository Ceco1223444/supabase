import { Outlet, useLocation } from 'react-router-dom'
import { Topbar } from './Topbar'
import { TabNav } from './TabNav'

export function AppShell() {
  const location = useLocation()
  // Key by the top-level section only (e.g. "inbox"), not the full path, so
  // navigating between threads inside Inbox doesn't re-trigger the tab-switch
  // fade — only switching between Inbox/Analytics/etc. does.
  const section = location.pathname.split('/')[1] ?? ''

  return (
    <div className="flex min-h-svh flex-col bg-page">
      <Topbar />
      <TabNav />
      <main className="flex-1 overflow-y-auto p-6">
        <div key={section} className="animate-[page-fade-in_180ms_ease-out]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

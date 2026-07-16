import { Outlet } from 'react-router-dom'
import { EmailList } from '@/components/inbox/EmailList'

export function InboxPage() {
  // 12.75rem = topbar (5) + tab nav (3.75) + main vertical padding (4).
  return (
    <div className="flex h-[calc(100svh-12.75rem)] gap-8">
      <div className="w-96 shrink-0">
        <EmailList />
      </div>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}

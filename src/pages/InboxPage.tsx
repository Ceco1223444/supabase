import { Outlet } from 'react-router-dom'
import { EmailList } from '@/components/inbox/EmailList'

export function InboxPage() {
  return (
    <div className="flex h-[calc(100svh-8rem)] gap-6">
      <div className="w-96 shrink-0 border-r border-border pr-6">
        <EmailList />
      </div>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}

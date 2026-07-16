import { AutoSendToggle } from '@/components/settings/AutoSendToggle'
import { PolicyRequestForm } from '@/components/settings/PolicyRequestForm'

export function SettingsPage() {
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Settings</h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          Control how Ansera replies on your behalf.
        </p>
      </div>
      <AutoSendToggle />
      <PolicyRequestForm />
    </div>
  )
}

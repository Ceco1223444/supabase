import { AutoSendToggle } from '@/components/settings/AutoSendToggle'
import { PolicyRequestForm } from '@/components/settings/PolicyRequestForm'

export function SettingsPage() {
  return (
    <div className="flex max-w-xl flex-col gap-4">
      <h1 className="text-lg font-semibold text-ink">Settings</h1>
      <AutoSendToggle />
      <PolicyRequestForm />
    </div>
  )
}

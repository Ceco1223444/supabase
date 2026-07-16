import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { PreviewBanner } from '@/components/preview/PreviewBanner'
import { DisabledAction } from '@/components/preview/DisabledAction'

export function SitesSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PreviewBanner module="sites" />
      <Card>
        <h2 className="text-sm font-semibold text-ink">Domain</h2>
        <p className="mt-1 text-xs text-ink-muted">
          Every storefront launches on an Ansera subdomain. Bring your own domain any time.
        </p>
        <div className="mt-4 max-w-md">
          <Input type="text" placeholder="yourstore.ansera.site" disabled />
        </div>
        <DisabledAction label="Connect custom domain" className="mt-4" />
      </Card>
    </div>
  )
}

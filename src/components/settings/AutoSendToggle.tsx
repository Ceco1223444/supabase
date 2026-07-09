import { useClient, useUpdateAutoSend } from '@/hooks/useClient'
import { Switch } from '@/components/ui/Switch'
import { Card } from '@/components/ui/Card'

export function AutoSendToggle() {
  const { data: client, isLoading } = useClient()
  const updateAutoSend = useUpdateAutoSend()

  if (isLoading || !client) return null

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ink">Auto-send AI replies</p>
          <p className="text-xs text-ink-muted">
            When off, replies wait in your Inbox for manual approval before sending.
          </p>
        </div>
        <Switch
          checked={client.auto_send}
          disabled={updateAutoSend.isPending}
          onChange={(next) => updateAutoSend.mutate(next)}
        />
      </div>
    </Card>
  )
}

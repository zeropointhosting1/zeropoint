import { DiscordIcon } from "@/components/nav/brand-icons"
import { Button } from "@/components/ui/button"
import { DISCORD_URL } from "@/lib/site-config"

export function DiscordCallout() {
  return (
    <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-surface-raised p-5 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <DiscordIcon className="size-5 text-primary" />
        <div>
          <p className="text-sm font-medium text-foreground">Hit something similar?</p>
          <p className="text-sm text-text-secondary">Talk it through in the Homelab Discord.</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full sm:w-auto"
        render={<a href={DISCORD_URL} target="_blank" rel="noreferrer" />}
      >
        Join
      </Button>
    </div>
  )
}

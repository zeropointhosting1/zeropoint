import { TriangleAlert } from "lucide-react"

export function ReviewBanner() {
  return (
    <div className="mx-auto mb-10 flex max-w-3xl items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 px-5 py-4 text-sm text-warning">
      <TriangleAlert className="mt-0.5 size-4 shrink-0" />
      <p>
        Starter text — accurate to how this site actually works today, but not legal advice.
        Have it reviewed before you rely on it, and update it if what the site does changes.
      </p>
    </div>
  )
}

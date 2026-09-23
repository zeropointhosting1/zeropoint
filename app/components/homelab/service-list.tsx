import { cn } from "@/lib/utils"
import type { Service } from "@/lib/homelab-data"

export function ServiceList({ services }: { services: Service[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface-raised">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-text-tertiary uppercase">
            <th className="px-5 py-4 font-mono font-normal tracking-wider">Status</th>
            <th className="px-5 py-4 font-mono font-normal tracking-wider">Service</th>
            <th className="px-5 py-4 font-mono font-normal tracking-wider">Role</th>
            <th className="px-5 py-4 font-mono font-normal tracking-wider">Node</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => {
            const running = s.status === "Running"
            return (
              <tr key={s.id} className="border-b border-border last:border-0">
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase",
                      running ? "text-success" : "text-text-tertiary"
                    )}
                  >
                    <span className={cn("size-1.5 rounded-full", running ? "bg-success" : "bg-text-tertiary")} />
                    {s.status}
                  </span>
                </td>
                <td className="px-5 py-4 font-medium text-foreground">{s.label}</td>
                <td className="px-5 py-4 text-text-secondary">{s.role}</td>
                <td className="px-5 py-4 font-mono text-xs text-text-secondary">{s.node}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

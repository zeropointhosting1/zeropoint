"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

// rehype-pretty-code renders each fenced block as <pre><code>…</code></pre>;
// this intercepts just the <pre> to add a copy button without touching the
// highlighted markup inside.
export function MdxPre({ className, children, ...props }: React.ComponentPropsWithoutRef<"pre">) {
  const preRef = React.useRef<HTMLPreElement>(null)
  const [copied, setCopied] = React.useState(false)

  const onCopy = React.useCallback(() => {
    const text = preRef.current?.textContent ?? ""
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [])

  return (
    <div className="theme-dark group relative">
      <pre ref={preRef} className={cn("overflow-x-auto rounded-xl border border-border bg-surface-raised p-4 text-sm", className)} {...props}>
        {children}
      </pre>
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy code"
        className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-md border border-border bg-surface text-text-tertiary opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
      >
        {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  )
}

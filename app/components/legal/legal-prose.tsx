// Mirrors components/docs/mdx-components.tsx's styling via descendant
// selectors instead of per-element components, since these pages are
// plain JSX rather than MDX.
export function LegalProse({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-none [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-text-secondary [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:text-text-secondary [&_li]:leading-relaxed [&_a]:text-primary [&_a]:underline-offset-4 [&_a:hover]:underline [&_strong]:font-semibold [&_strong]:text-foreground [&_code]:rounded [&_code]:bg-surface-raised [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm">
      {children}
    </div>
  )
}

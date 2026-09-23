// Renders a JSON-LD structured-data block. `data` is trusted, build-time
// content (frontmatter, config) — never pass through unsanitized user input.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

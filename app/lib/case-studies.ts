// Real client work, one per finished project — the /work/[slug] template
// (Phase 5) reads from this. Empty until a real case study exists; nothing
// here is invented, so CaseStudiesSlot renders nothing while this is empty
// rather than showing a placeholder or sample project.
export type CaseStudy = {
  slug: string
  title: string
  summary: string
  tags: string[]
}

export const CASE_STUDIES: CaseStudy[] = []

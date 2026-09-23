import fs from "node:fs"
import path from "node:path"

// Server-only (uses Node's fs) — call from a Server Component or a plain
// data/page module, never from a "use client" file. Checked at build time
// since this is a static export with no runtime filesystem to query.
export function localPhoto(publicRelativePath: string): string | null {
  const abs = path.join(process.cwd(), "public", publicRelativePath)
  return fs.existsSync(abs) ? `/${publicRelativePath}` : null
}

// Same check for a whole set of ids at once, keyed by id — for handing a
// plain string map down into a "use client" component as a prop.
export function localPhotoMap(ids: string[], dir: string, ext = "jpg"): Record<string, string> {
  const map: Record<string, string> = {}
  for (const id of ids) {
    const photo = localPhoto(`${dir}/${id}.${ext}`)
    if (photo) map[id] = photo
  }
  return map
}

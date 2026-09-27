// Validate local links and anchors against a completed static export.
import fs from "node:fs"
import path from "node:path"

const root = path.resolve("out")
const basePath = process.env.BASE_PATH ?? ""
const files = fs.readdirSync(root, { recursive: true }).filter((name) => name.endsWith(".html"))
const failures = new Set()
let checked = 0
const decode = (value) => value.replaceAll("&amp;", "&").replaceAll("&#x27;", "'").replaceAll("&quot;", '"')
for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), "utf8")
  const route = "/" + file.replaceAll("\\", "/").replace(/index\.html$/, "")
  for (const [, raw] of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)) {
    const href = decode(raw)
    if (!href || /^(?:https?:|mailto:|tel:|data:|\/\/)/.test(href)) continue
    const url = new URL(href, `https://local.test${basePath}${route}`)
    let pathname = decodeURIComponent(url.pathname)
    if (basePath && pathname.startsWith(basePath + "/")) pathname = pathname.slice(basePath.length)
    const target = path.join(root, pathname.replace(/^\//, ""))
    const candidates = [target, path.join(target, "index.html"), target + ".html"]
    const found = candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile())
    checked++
    if (!found) { failures.add(`${route} → ${href} (missing page)`); continue }
    if (url.hash && found.endsWith(".html")) {
      const body = fs.readFileSync(found, "utf8")
      const ids = new Set([...body.matchAll(/\bid="([^"]*)"/g)].map((match) => decode(match[1])))
      if (!ids.has(decodeURIComponent(url.hash.slice(1)))) failures.add(`${route} → ${href} (missing anchor)`)
    }
  }
}
if (failures.size) { console.error([...failures].join("\n")); process.exitCode = 1 }
else console.log(`Checked ${checked} internal links across ${files.length} exported pages: no missing pages or anchors.`)

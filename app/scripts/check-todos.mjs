// Runs after `next build` (see package.json's "postbuild" script) and lists
// any {{TODO placeholder that made it into the static export — the whole
// point of marking placeholders that way instead of inventing values. It only
// warns by default so deploys aren't blocked while content is still being
// filled in; set STRICT_TODOS=1 to make it fail the build instead.
import fs from "node:fs"
import path from "node:path"

const OUT_DIR = path.join(process.cwd(), "out")

function walk(dir) {
  let files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files = files.concat(walk(full))
    else if (/\.(html|js|json|xml|txt)$/.test(entry.name)) files.push(full)
  }
  return files
}

if (!fs.existsSync(OUT_DIR)) {
  console.error(`check-todos: "${OUT_DIR}" doesn't exist — run "next build" first.`)
  process.exit(1)
}

const PLACEHOLDER = /\{\{TODO[^}]*\}\}/g
let hits = 0

for (const file of walk(OUT_DIR)) {
  const text = fs.readFileSync(file, "utf8")
  const matches = text.match(PLACEHOLDER)
  if (!matches) continue
  const rel = path.relative(OUT_DIR, file)
  for (const match of new Set(matches)) {
    console.error(`  ${rel}: ${match}`)
    hits += matches.filter((m) => m === match).length
  }
}

if (hits > 0) {
  console.error(`\ncheck-todos: found ${hits} unresolved {{TODO placeholder(s) in the exported site — see TODO-CONTENT.md.`)
  if (process.env.STRICT_TODOS) process.exit(1)
  process.exit(0)
}

console.log("check-todos: no {{TODO placeholders in the exported site.")

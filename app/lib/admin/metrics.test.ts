import test from "node:test"
import assert from "node:assert/strict"
import { averageResponse, countByDay, formatPercent, hourlySlots, initials, timeAgo, uptimePercent } from "./metrics.ts"

const NOW = new Date(2026, 8, 27, 15, 30).getTime()

test("countByDay returns one zero-filled bucket per day ending today", () => {
  const buckets = countByDay([new Date(2026, 8, 27, 9).toISOString(), new Date(2026, 8, 27, 1).toISOString(), new Date(2026, 8, 25, 12).toISOString()], 7, NOW)
  assert.equal(buckets.length, 7)
  assert.deepEqual(buckets.map((b) => b.count), [0, 0, 0, 0, 1, 0, 2])
})

test("countByDay ignores timestamps outside the window", () => {
  const buckets = countByDay([new Date(2026, 7, 1).toISOString()], 7, NOW)
  assert.equal(buckets.reduce((s, b) => s + b.count, 0), 0)
})

test("hourlySlots places checks in the right hour and counts failures", () => {
  const slots = hourlySlots(
    [
      { checked_at: new Date(NOW - 5 * 60_000).toISOString(), is_up: true, response_ms: 100 },
      { checked_at: new Date(NOW - 10 * 60_000).toISOString(), is_up: false, response_ms: null },
      { checked_at: new Date(NOW - 30 * 3_600_000).toISOString(), is_up: false, response_ms: null },
    ],
    24,
    NOW
  )
  assert.equal(slots.length, 24)
  assert.deepEqual(slots.at(-1), { start: slots.at(-1)!.start, total: 2, down: 1 })
  assert.equal(slots.reduce((s, x) => s + x.total, 0), 2)
})

test("uptime and average response only count what they should", () => {
  const checks = [
    { checked_at: "", is_up: true, response_ms: 100 },
    { checked_at: "", is_up: true, response_ms: 300 },
    { checked_at: "", is_up: false, response_ms: 9000 },
    { checked_at: "", is_up: true, response_ms: null },
  ]
  assert.equal(uptimePercent(checks), 75)
  assert.equal(averageResponse(checks), 200)
  assert.equal(uptimePercent([]), null)
  assert.equal(averageResponse([]), null)
})

test("formatting helpers", () => {
  assert.equal(formatPercent(100), "100%")
  assert.equal(formatPercent(99.456), "99.46%")
  assert.equal(formatPercent(92.25), "92.3%")
  assert.equal(formatPercent(null), "—")
  assert.equal(initials("ada lovelace byron"), "AB")
  assert.equal(initials("Cher"), "C")
  assert.equal(initials("  "), "?")
  assert.equal(timeAgo(new Date(NOW - 10_000).toISOString(), NOW), "just now")
  assert.equal(timeAgo(new Date(NOW - 5 * 60_000).toISOString(), NOW), "5m ago")
  assert.equal(timeAgo(new Date(NOW - 3 * 3_600_000).toISOString(), NOW), "3h ago")
})

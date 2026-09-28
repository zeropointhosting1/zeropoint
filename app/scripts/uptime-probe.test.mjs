import test from "node:test"
import assert from "node:assert/strict"
import { checkSite } from "./uptime-probe.mjs"

test("healthy HEAD needs no GET", async () => {
  const methods = []
  const result = await checkSite("https://example.com", { fetchImpl: async (_, options) => {
    methods.push(options.method)
    return new Response(null, { status: 200 })
  } })
  assert.equal(result.isUp, true)
  assert.deepEqual(methods, ["HEAD"])
})

for (const failure of ["rejected", "network", "timeout"]) {
  test(`GET recovers from ${failure} HEAD`, async () => {
    const methods = []
    const result = await checkSite("https://example.com", { timeoutMs: 10, fetchImpl: async (_, options) => {
      methods.push(options.method)
      if (options.method === "GET") {
        assert.equal(options.signal.aborted, false)
        return new Response("ok")
      }
      if (failure === "rejected") return new Response(null, { status: 405 })
      if (failure === "network") throw new Error("HEAD unavailable")
      return new Promise((_, reject) => options.signal.addEventListener("abort", () => reject(new Error("timeout"))))
    } })
    assert.equal(result.isUp, true)
    assert.deepEqual(methods, ["HEAD", "GET"])
  })
}

test("HTTP failures are recorded as down", async () => {
  const result = await checkSite("https://example.com", { fetchImpl: async () => new Response(null, { status: 503 }) })
  assert.equal(result.isUp, false)
  assert.equal(result.statusCode, 503)
  assert.equal(result.error, "HTTP 503")
})

test("network failures are recorded as down", async () => {
  const result = await checkSite("https://example.com", { fetchImpl: async () => { throw new Error("unreachable") } })
  assert.equal(result.isUp, false)
  assert.equal(result.statusCode, null)
  assert.equal(result.error, "unreachable")
})

test("non-web URLs are rejected without fetching", async () => {
  const result = await checkSite("file:///etc/hosts", { fetchImpl: () => assert.fail("must not fetch") })
  assert.equal(result.isUp, false)
})

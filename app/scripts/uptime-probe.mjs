// Separate deadlines let GET retry even when a server times out on HEAD.
export async function checkSite(url, { fetchImpl = fetch, timeoutMs = 10_000 } = {}) {
  const startedAt = Date.now()
  try {
    if (!["http:", "https:"].includes(new URL(url).protocol)) throw new Error("Expected an HTTP or HTTPS URL")
    for (const method of ["HEAD", "GET"]) {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), timeoutMs)
      try {
        const response = await fetchImpl(url, { method, redirect: "follow", signal: controller.signal })
        await response.body?.cancel()
        if (response.ok || method === "GET") {
          return { isUp: response.ok, statusCode: response.status, responseMs: Date.now() - startedAt, error: response.ok ? null : `HTTP ${response.status}` }
        }
      } catch (error) {
        if (method === "GET") throw error
      } finally {
        clearTimeout(timeout)
      }
    }
  } catch (error) {
    return { isUp: false, statusCode: null, responseMs: Date.now() - startedAt, error: error instanceof Error ? error.message : String(error) }
  }
}

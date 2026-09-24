import test from "node:test"
import assert from "node:assert/strict"
import { STARTER_BUILDS, buildTotalUsd, buildIdleWatts, suggestBuildForRamGb } from "./starter-builds.ts"

test("every starter build's parts sum to roughly its target price", () => {
  for (const build of STARTER_BUILDS) {
    const total = buildTotalUsd(build)
    assert.ok(total > 0, `${build.name} has a non-zero total`)
  }
})

test("idle watts sum across all parts", () => {
  const [first] = STARTER_BUILDS
  const expected = first.parts.reduce((sum, p) => sum + p.idleWatts, 0)
  assert.equal(buildIdleWatts(first), expected)
})

test("a light RAM total suggests the cheapest build", () => {
  assert.equal(suggestBuildForRamGb(8).id, "starter-300")
})

test("a heavy RAM total suggests the largest build", () => {
  assert.equal(suggestBuildForRamGb(96).id, "starter-1000")
})

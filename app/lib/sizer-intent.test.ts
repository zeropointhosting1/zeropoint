import test from "node:test"
import assert from "node:assert/strict"
import { parseSizerIntent, sizerUrlFor } from "./sizer-intent.ts"

test("parses the brief's example query into apps and a hypervisor", () => {
  const intent = parseSizerIntent("how much RAM for Plex and Immich on Proxmox")
  assert.deepEqual(intent?.appIds.sort(), ["immich", "plex"])
  assert.equal(intent?.hypervisorId, "proxmox")
})

test("builds a Sizer URL with both apps and hypervisor preselected", () => {
  const intent = { appIds: ["plex", "immich"], hypervisorId: "proxmox" }
  const url = sizerUrlFor(intent)
  assert.match(url, /^\/sizer\?/)
  assert.match(url, /apps=plex%2Cimmich|apps=plex,immich/)
  assert.match(url, /hv=proxmox/)
})

test("returns null when nothing recognizable is mentioned", () => {
  assert.equal(parseSizerIntent("what's your favorite pizza topping"), null)
})

test("still recognizes a hypervisor mention with no app named", () => {
  const intent = parseSizerIntent("does this work with ESXi")
  assert.equal(intent?.hypervisorId, "esxi")
  assert.deepEqual(intent?.appIds, [])
})

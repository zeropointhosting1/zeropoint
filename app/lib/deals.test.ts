import test from "node:test"
import assert from "node:assert/strict"
import {
  listingRamGb,
  meetsMinRam,
  parseCpuGeneration,
  parseCpuLabel,
  isLegacyCpu,
  isWeakListing,
  isDatacenterCiscoGear,
  isHomelabFriendlyCisco,
  isBarebonesListing,
  shippingCostUsd,
} from "./deals.ts"

test("RAM parsing prefers an explicit RAM-labeled figure over a bare GB match", () => {
  assert.equal(listingRamGb("HP EliteDesk 800 G4 Mini i5-8500T 256GB SSD 16GB RAM"), 16)
})

test("RAM parsing picks the RAM-typical figure when neither number is labeled at all", () => {
  // The reported bug, verbatim: no "SSD"/"RAM" word anywhere, so the old
  // fallback (first GB number wins) read the 256GB drive as the RAM size.
  assert.equal(listingRamGb("HP EliteDesk 800 Mini i5-9500, 256GB,16Gb"), 16)
})

test("RAM parsing rejects a storage-sized bare number even unlabeled", () => {
  assert.equal(listingRamGb("Lenovo M720q i5-8500T 512GB, tiny desktop"), null)
})

test("RAM parsing handles real-feed-style compact titles", () => {
  assert.equal(listingRamGb("HP EliteDesk 800 G4 DM 65W i5-8500T 8GB/256GB SSD Win11 Pro"), 8)
  assert.equal(listingRamGb("Dell OptiPlex 7050 Micro i5-7500T 16GB RAM 240GB SSD"), 16)
  assert.equal(listingRamGb("Lenovo ThinkCentre M920q i7-9700T 32GB DDR4 1TB NVMe"), 32)
})

test("RAM parsing no longer reads a storage size as RAM when RAM isn't mentioned", () => {
  // This is the actual bug: a title with only a storage GB figure used to
  // be read as the RAM size, which is how an 8/16 GB machine passed a
  // 70+ GB Sizer filter.
  assert.equal(listingRamGb("HP EliteDesk 800 G4 Mini i5-8500T 256GB SSD, no RAM listed"), null)
})

test("RAM parsing handles RAM mentioned before storage too", () => {
  assert.equal(listingRamGb("Lenovo M720q 32GB RAM 1TB NVMe"), 32)
})

test("meetsMinRam rejects listings with unknown RAM instead of passing them through", () => {
  assert.equal(meetsMinRam("UniFi Flex Mini 5-Port Switch", 70), false)
})

test("meetsMinRam still accepts a listing that genuinely meets the threshold", () => {
  assert.equal(meetsMinRam("HP EliteDesk 800 G5 Mini i5-9500T 32GB RAM 512GB NVMe", 32), true)
})

test("CPU generation parses standard Intel Core naming", () => {
  assert.equal(parseCpuGeneration("HP EliteDesk 800 G4 Mini i5-8500T"), 8)
  assert.equal(parseCpuGeneration("Dell OptiPlex i5-7500 SFF"), 7)
  assert.equal(parseCpuGeneration("Lenovo M920q i7-10700"), 10)
})

test("CPU generation parses Intel NUC naming", () => {
  assert.equal(parseCpuGeneration("Intel NUC5i5RYH Mini PC"), 5)
})

test("CPU generation parses Ryzen naming", () => {
  assert.equal(parseCpuGeneration("Mini PC Ryzen 5 1600 6-core"), 1)
})

test("CPU label extraction reads a clean model string", () => {
  assert.equal(parseCpuLabel("HP EliteDesk 800 G4 Mini i5-8500T 16GB"), "i5-8500T")
})

test("pre-8th-gen Intel is flagged as legacy", () => {
  assert.equal(isLegacyCpu("Dell OptiPlex 7040 i5-7500 SFF"), true)
})

test("8th-gen and newer Intel is not flagged as legacy", () => {
  assert.equal(isLegacyCpu("HP EliteDesk 800 G4 Mini i5-8500T"), false)
})

test("first-gen Ryzen is flagged as legacy", () => {
  assert.equal(isLegacyCpu("Mini PC Ryzen 5 1600"), true)
})

test("weak listing catches SFF/Tower form factors and old AMD APUs", () => {
  assert.equal(isWeakListing("HP EliteDesk 800 G4 SFF i5-8500 16GB"), true)
  assert.equal(isWeakListing("HP EliteDesk 705 AMD A8-9600 8GB"), true)
  assert.equal(isWeakListing("HP EliteDesk 800 G4 Mini i5-8500T 16GB"), false)
})

test("datacenter-scale Cisco gear is identified for exclusion", () => {
  assert.equal(isDatacenterCiscoGear("Cisco Catalyst 9500-48Y4C Switch"), true)
  assert.equal(isDatacenterCiscoGear("Cisco Catalyst 3850 48 Port Switch"), true)
  assert.equal(isDatacenterCiscoGear("Cisco Catalyst 2960-CX-8PC-L"), false)
})

test("homelab-friendly Cisco models are identified for preferred sorting", () => {
  assert.equal(isHomelabFriendlyCisco("Cisco Catalyst 2960-CX-8PC-L Switch"), true)
  assert.equal(isHomelabFriendlyCisco("Cisco Catalyst 3560-CX-8PC-S"), true)
  assert.equal(isHomelabFriendlyCisco("Cisco Catalyst 9200L 48-Port"), false)
})

test("barebones listings are detected from common title phrasing", () => {
  assert.equal(isBarebonesListing("HP EliteDesk 800 G4 Mini - Barebones, No HDD/SSD, No OS"), true)
  assert.equal(isBarebonesListing("HP EliteDesk 800 G4 Mini i5-8500T 16GB 256GB SSD Win 11"), false)
})

test("shipping cost parses free, flat, and unknown shipping", () => {
  assert.equal(shippingCostUsd("Free shipping"), 0)
  assert.equal(shippingCostUsd("+$12.50 shipping"), 12.5)
  assert.equal(shippingCostUsd(null), 0)
})

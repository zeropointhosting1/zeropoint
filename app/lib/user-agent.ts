// Deliberately minimal, coarse family-detection — no fingerprinting library,
// no client hints beyond what's already in the request. Good enough to say
// "Chrome on macOS," not enough to identify a specific visitor.

export type ParsedUserAgent = {
  device: "Desktop" | "Mobile" | "Tablet"
  os: string
  browser: string
}

export function parseUserAgent(ua: string): ParsedUserAgent {
  const isTablet = /iPad|Tablet|(Android(?!.*Mobile))/i.test(ua)
  const isMobile = !isTablet && /Mobi|Android|iPhone/i.test(ua)
  const device: ParsedUserAgent["device"] = isTablet
    ? "Tablet"
    : isMobile
      ? "Mobile"
      : "Desktop"

  let os = "Unknown"
  if (/Windows NT/i.test(ua)) os = "Windows"
  else if (/Mac OS X/i.test(ua) && !/iPhone|iPad/i.test(ua)) os = "macOS"
  else if (/Android/i.test(ua)) os = "Android"
  else if (/iPhone|iPad|iOS/i.test(ua)) os = "iOS"
  else if (/Linux/i.test(ua)) os = "Linux"

  let browser = "Unknown"
  if (/Edg\//i.test(ua)) browser = "Edge"
  else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) browser = "Chrome"
  else if (/Firefox\//i.test(ua)) browser = "Firefox"
  else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari"

  return { device, os, browser }
}

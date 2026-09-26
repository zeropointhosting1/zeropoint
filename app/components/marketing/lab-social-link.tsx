import { TIKTOK } from "@/lib/site-config"

export function LabSocialLink() {
  return TIKTOK.url ? (
    <a href={TIKTOK.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline">Follow on TikTok · {TIKTOK.handle}</a>
  ) : <span className="text-sm text-text-secondary">TikTok · {TIKTOK.handle}</span>
}

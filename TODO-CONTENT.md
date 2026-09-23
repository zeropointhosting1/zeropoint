# TODO — content still needed from you

Nothing below is invented. Placeholders are marked `{{TODO: ...}}` in code (mostly in `app/lib/business-info.ts` and `app/lib/site-config.ts`) and collected here so you have one list to work through.

## Phase 1 — Technical fixes

- [ ] **Site URL** (`app/lib/site-config.ts` `SITE_URL`): currently defaults to the real GitHub Pages URL (`https://zeropointhosting1.github.io/zeropoint`). If you get a custom domain, set `NEXT_PUBLIC_SITE_URL` in the deploy workflow to override it.
- [ ] **Business info for JSON-LD / structured data** (`app/lib/business-info.ts`):
  - [ ] Your name or business name
  - [ ] Contact email
  - [ ] Phone (optional — leave blank to omit from JSON-LD)
  - [ ] City/region
  - [ ] On-site service area
- [ ] **Social links** (`app/lib/site-config.ts` `SOCIAL_LINKS`): GitHub profile URL, LinkedIn profile URL. Icons stay hidden in the nav/footer/About page until these are set.

## Phase 2 — Contact

- [ ] **Form endpoint** (`app/lib/contact-config.ts` `FORM_ENDPOINT`): sign up for [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com) (both free-tier, static-export friendly), create a form, and paste its endpoint URL here. Until this is set, the Contact page and both planners show a "not connected yet — email me directly" message instead of silently failing.
- [ ] **Booking link** (`app/lib/contact-config.ts` `BOOKING_URL`): optional. A Cal.com (or similar) scheduling link. Leave `null` to keep it hidden.
- [ ] **Response time** (`app/lib/contact-config.ts` `RESPONSE_DAYS`): how many business days you commit to replying within.

## Phase 4 — Page restructure

- [ ] **About page** (`app/lib/business-info.ts`):
  - [ ] `yearsInIt` — years of IT/networking experience
  - [ ] `credentialLine` — a confident one-line credential for the About hero (current role, years of experience, or what you've built)
  - [ ] `certifications` — array of certifications, if any (leave empty to omit that row)
  - [ ] Headshot: add a photo at `app/public/about/headshot.jpg` — the page falls back to an initials badge until it exists
- [ ] **New business service prices** (`app/lib/services.ts`, `SERVICE_OFFERINGS`) — starting prices weren't set for the new business-specific services, so each shows `{{TODO: starting price}}` until you set one: Office Network & Wi-Fi, Guest & Device Separation, Firewall & Remote Access, Backups, Onboarding/Offboarding & Account Hygiene, Monthly Support.
- [ ] **IoT & Camera Separation** (home, same file) — also needs a starting price.
- [ ] **Payment terms** (`app/services/page.tsx`, FAQ) — deposit/invoice terms for the "How does payment work?" answer.

## Phase 5 — Photos, and a finding on affiliate links

- [ ] **Photos** (optional — falls back to the existing icon treatment until added): project/hardware cards now check for a real photo and use it automatically once present.
  - `app/public/lab/projects/{id}.jpg` — one per project in `app/lib/projects.ts` (ids: `home-network`, `proxmox-cluster`, `enterprise-network-lab`, `zeropoint-website`, `sso`, `remote-access`, `internal-dashboard`, `vaultwarden`, `siem`, `windows-lab`)
  - `app/public/lab/hardware/{id}.jpg` — `gateway`, `switch`, `ap`
  - `app/public/about/headshot.jpg` (listed above too)
- [ ] **Affiliate disclosure — not needed, confirmed no affiliate program is wired up.** I checked `supabase/functions/ebay-deals/index.ts`: it uses eBay's Browse API and passes through `itemWebUrl` as-is — no campaign/partner/affiliate query params (no eBay Partner Network campaign ID, etc.) are appended anywhere. Since the links aren't actually affiliate links, I didn't add a disclosure — adding one would misrepresent the relationship. If you sign up for the eBay Partner Network later, the link-builder in that function is the one place to add the campaign ID, and a disclosure should go in at the same time.
- [ ] **Case studies** — the Work page and homepage both hide the case-study section until at least one exists. To add one: copy `app/content/work/_TEMPLATE.mdx` to a new file in that same folder without the leading underscore, fill in the frontmatter and the problem/design/build/result sections, and it'll appear automatically (and get its own `/work/<slug>/` page).

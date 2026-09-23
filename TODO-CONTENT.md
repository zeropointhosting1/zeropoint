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

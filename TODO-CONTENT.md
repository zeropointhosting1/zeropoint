# Content and launch checklist

All business, contact, and social settings live in `app/lib/site-config.ts`. The old business-info and contact-config modules re-export these values for existing consumers. Existing personal-detail edits made in the shared workspace during this task were preserved; no personal details were invented by this change.

## Remaining placeholders

The table lists every complete TODO token in source content, including optional settings and the unpublished case-study template. Generated HTML repeats these values across pages; its warning count is not the number of unique tasks. The scanner script's literal TODO search strings are not content placeholders.

| Source location | Placeholder |
| --- | --- |
| [app/lib/site-config.ts:17](app/lib/site-config.ts#L17) | `{{TODO: GitHub profile URL}}` |
| [app/lib/site-config.ts:18](app/lib/site-config.ts#L18) | `{{TODO: LinkedIn profile URL}}` |
| [app/lib/site-config.ts:25](app/lib/site-config.ts#L25) | `{{TODO: your name or business name}}` |
| [app/lib/site-config.ts:26](app/lib/site-config.ts#L26) | `{{TODO: contact email}}` |
| [app/lib/site-config.ts:27](app/lib/site-config.ts#L27) | `{{TODO: contact phone number}}` |
| [app/lib/site-config.ts:29](app/lib/site-config.ts#L29) | `{{TODO: on-site service area — e.g. "Boca Raton and X miles" or a list of counties}}` |
| [app/lib/site-config.ts:32](app/lib/site-config.ts#L32) | `{{TODO: certifications, if any — leave empty to omit the row}}` |
| [app/lib/site-config.ts:34](app/lib/site-config.ts#L34) | `{{TODO: deposit/invoice terms, e.g. "A deposit is due before work begins, with the balance invoiced on completion."}}` |
| [app/lib/site-config.ts:35](app/lib/site-config.ts#L35) | `{{TODO: a liability limitation appropriate for your business — e.g. "ZeroPoint's liability for any engagement is limited to the amount paid for that engagement." A lawyer should confirm this is appropriate for your situation.}}` |
| [app/lib/site-config.ts:36](app/lib/site-config.ts#L36) | `{{TODO: your state/jurisdiction, if you want to specify one}}` |
| [app/lib/site-config.ts:37](app/lib/site-config.ts#L37) | `{{TODO: date you publish the Privacy/Terms pages}}` |
| [app/lib/site-config.ts:45](app/lib/site-config.ts#L45) | `{{TODO: Formspree/Web3Forms endpoint URL}}` |
| [app/lib/site-config.ts:50](app/lib/site-config.ts#L50) | `{{TODO: form service name, e.g. Formspree or Web3Forms}}` |
| [app/lib/site-config.ts:54](app/lib/site-config.ts#L54) | `{{TODO: booking link, e.g. Cal.com}}` |
| [app/lib/site-config.ts:58](app/lib/site-config.ts#L58) | `{{TODO: reply time in business days, e.g. 1-2}}` |
| [app/lib/site-config.ts:67](app/lib/site-config.ts#L67) | `{{TODO: add your photo at public/about/headshot.jpg}}` |
| [app/lib/site-config.ts:70](app/lib/site-config.ts#L70) | `{{TODO: TikTok handle}}` |
| [app/lib/site-config.ts:71](app/lib/site-config.ts#L71) | `{{TODO: TikTok profile URL}}` |
| [app/content/work/_TEMPLATE.mdx:2](app/content/work/_TEMPLATE.mdx#L2) | `{{TODO: project title, e.g. "Office Network Rebuild for a 12-Person Studio"}}` |
| [app/content/work/_TEMPLATE.mdx:3](app/content/work/_TEMPLATE.mdx#L3) | `{{TODO: one sentence — what this project was and the outcome}}` |
| [app/content/work/_TEMPLATE.mdx:4](app/content/work/_TEMPLATE.mdx#L4) | `{{TODO: YYYY-MM-DD}}` |
| [app/content/work/_TEMPLATE.mdx:5](app/content/work/_TEMPLATE.mdx#L5) | `{{TODO: e.g. UniFi}}` |
| [app/content/work/_TEMPLATE.mdx:5](app/content/work/_TEMPLATE.mdx#L5) | `{{TODO: e.g. Small Business}}` |
| [app/content/work/_TEMPLATE.mdx:23](app/content/work/_TEMPLATE.mdx#L23) | `{{TODO: What wasn't working, in the client's own words if you can. What was actually happening — dead zones, an unreliable network, guest devices with too much access, whatever the real starting point was.}}` |
| [app/content/work/_TEMPLATE.mdx:27](app/content/work/_TEMPLATE.mdx#L27) | `{{TODO: What you proposed and why — the tradeoffs you considered, what you ruled out, and what the plan actually was before any hardware went in.}}` |
| [app/content/work/_TEMPLATE.mdx:31](app/content/work/_TEMPLATE.mdx#L31) | `{{TODO: What actually happened during the install/deployment. Real constraints you hit, anything that didn't go according to plan, and how it was handled.}}` |
| [app/content/work/_TEMPLATE.mdx:35](app/content/work/_TEMPLATE.mdx#L35) | `{{TODO: What changed. Be specific and honest — real numbers or outcomes if you have them, not vague claims.}}` |

## Editing and publishing content

- Plan prices, features, and shared terms: `app/lib/support-plans.ts`. Essentials $149/mo; Business $349/mo; Priority from $699/mo. Additional time $100/hr. Existing one-off prices remain in `app/lib/services.ts`; unset project prices show “Quote on request”.
- Client Work: copy `app/content/work/_TEMPLATE.mdx` to a new file without the leading underscore, replace every placeholder, and use real outcomes only. The template remains unpublished. Set `SHOW_CLIENT_WORK=true` in site config to expose navigation and the homepage case-study section. `/projects/` remains accessible while hidden.
- Testimonials: add real, approved entries to `app/lib/testimonials.ts` and set `SHOW_TESTIMONIALS=true`. Empty collections still render nothing. No testimonials were invented.
- Owner photo: `app/public/about/headshot.jpg` is present and is picked up at build time on Home and About. The config's photo placeholder is a fallback if the file is removed. Confirm the photo is the one you want before publishing.
- TikTok: enter a real handle and profile URL in site config. Until then, Home and The Lab show the handle placeholder as text, not a broken or invented profile link.
- Optional GitHub/LinkedIn and booking links remain hidden until configured. The existing Discord invite is retained on the Lab, Community, and other resource surfaces, but removed from the header.
- Contact and estimate forms need a real form endpoint and processor name. Nothing was submitted during validation. Contact email and phone remain placeholders.
- Set `NEXT_PUBLIC_SITE_URL` if using a custom domain. GitHub Pages builds use the repository `BASE_PATH` and retain every existing route.
- Optional lab photos: `app/public/lab/projects/{id}.jpg` for IDs in `app/lib/projects.ts`; `app/public/lab/hardware/{id}.jpg` for hardware. Existing icon treatments remain valid fallbacks.
- Existing affiliate-link note: no affiliate program was configured in the previous implementation; review disclosures if an affiliate program is added.

## Details still to define

The supplied plan inclusions and response promises are used exactly as requested. Device/user limits, support hours, unused-hour rollover, software-license charges, website build versus ongoing care scope, and the on-site service boundary were not supplied and were not invented. Confirm those details when preparing the service agreement. General contact reply time and payment terms remain placeholders.

## Validation for this change

- Normal production export and GitHub Pages-style export with `BASE_PATH=/Zeropoint` passed, including TypeScript.
- Repository lint and all 47 existing tests passed.
- Export audit checked all 24 HTML files, including route links, anchors, script/image/CSS assets, and repository-path handling. No broken internal destinations remain.
- Content checks verified homepage order, pricing order and amounts, all ten lab projects, hidden Client Work navigation, empty client-work state, existing routes, and aria-hidden marquee duplicates.
- No browser was available in this session, so rendered mobile/desktop appearance and live form submission were not verified.
- Nothing was committed, pushed, or deployed. Existing working-tree changes were preserved on `reposition/local-msp`.

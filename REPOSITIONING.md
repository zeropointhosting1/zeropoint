# ZeroPoint repositioning

The public site now leads with local Wi-Fi, UniFi networking, and on-demand technology help for Boca Raton homes and small businesses. Websites remain an additional service; Network Care is optional after an installation.

## Changed

- Homepage: existing hero animation and service shortcuts, service picker, common problems, UniFi specialty diagram, on-site/remote support, starting prices, Network Care, owner, process, principles, and Lab copy.
- Existing pages: Home Networking, Business Networking (`/services`), Pricing, About, Websites, Lab, Contact, and Estimate.
- Shared navigation, footer, service catalog, help-widget answers, metadata, sitemap, and business structured data.
- Missing contact/social details and unset legal fields no longer render placeholder strings. Existing legal prose remains subject to owner review.
- Logo, typography, color tokens, existing network interactions, Lab tools, and animation components remain in place.

## Added files

- `app/app/tech-support/page.tsx`
- `app/app/network-care/page.tsx`
- `app/components/marketing/local-services.tsx`
- `app/components/marketing/network-install-diagram.tsx`
- `app/scripts/check-site-links.mjs`
- This handoff document.

No existing files were removed as part of the repositioning. Concurrent Supabase/admin changes in this workspace are separate work and were preserved, including the new lead-submission integration.

## Information still needed

- Public email and phone: `NEXT_PUBLIC_CONTACT_EMAIL` and `NEXT_PUBLIC_CONTACT_PHONE` in the build environment. Unset details are hidden.
- Production domain: `NEXT_PUBLIC_SITE_URL`, so canonical URLs and social metadata use the intended public domain.
- Confirm the concurrently added Supabase lead intake is configured, migrated, and tested before launch. Contact/estimate forms show an unavailable notice when its public configuration is missing.
- Optional social/booking links. Missing TikTok, GitHub, LinkedIn, and booking URLs stay hidden. Future YouTube content has room in the Lab copy.
- Final business terms and publication date; any additional service-area specifics. No radius, credentials, or response-time guarantee was invented.

## Verification

- Production static build with `STRICT_TODOS=1`.
- TypeScript and ESLint.
- Existing 47 tests passed with explicit test-file arguments. The existing `npm test` directory argument does not resolve on the installed Windows/Node setup.
- `node scripts/check-site-links.mjs` validates local links and anchors in the export.
- Browser automation was unavailable (no connected browser surfaces), so a visual desktop/mobile and keyboard interaction pass remains outstanding. Responsive classes were reviewed, but this is not equivalent to device testing.
- External sites and live lead delivery were not tested.

## Next three improvements

1. Complete contact configuration and test a real request end to end, including owner notification and reply.
2. Add real installation photos and approved project stories showing the problem, work, and outcome.
3. Complete a phone/desktop visual and keyboard review, then finalize the public domain, social preview artwork, and local business profile details.

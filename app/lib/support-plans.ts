// Single source for homepage previews, pricing, and service summaries.
export const SUPPORT_PLANS = [
  { id: "essentials", name: "Essentials", price: 149, from: false, popular: false,
    features: ["Network monitoring", "Firmware & security updates", "1 hr remote help/mo", "Quarterly check-in"] },
  { id: "business", name: "Business", price: 349, from: false, popular: true,
    features: ["Everything in Essentials", "4 hrs remote help/mo", "Backup monitoring", "Microsoft 365 / Google Workspace user management", "Website hosting & updates", "Next-business-day on-site"] },
  { id: "priority", name: "Priority", price: 699, from: true, popular: false,
    features: ["Everything in Business", "Same-day response", "8 hrs help/mo", "Monthly on-site visit", "Annual security review"] },
] as const

export const SUPPORT_TERMS = {
  additionalHourlyRate: 100,
  commitment: "All plans month-to-month",
  hardware: "Hardware never marked up",
}

export function formatPlanPrice(plan: (typeof SUPPORT_PLANS)[number]) {
  return `${plan.from ? "From " : ""}$${plan.price}/mo`
}

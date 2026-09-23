import { FORM_ENDPOINT } from "@/lib/contact-config"

export type SubmitResult = "sent" | "not-configured" | "error"

// Posts JSON to the configured form endpoint (Formspree/Web3Forms-style —
// both accept a plain JSON POST and return 2xx on success). Shared by the
// Contact page and both project planners so "send" behaves identically
// everywhere.
export async function submitForm(data: Record<string, string>): Promise<SubmitResult> {
  if (!FORM_ENDPOINT) return "not-configured"
  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.ok ? "sent" : "error"
  } catch {
    return "error"
  }
}

"use client"

import * as React from "react"
import { useReducedMotion } from "framer-motion"
import { WORLD_MAP_PATH, WORLD_MAP_VIEWBOX, projectLatLon } from "./world-map-data"

type GeoResult =
  | { available: true; city: string; region: string; country: string; lat: number; lon: number }
  | { available: false }

type State = { status: "loading" } | { status: "done"; result: GeoResult }

function Beacon({ x, y, animated }: { x: number; y: number; animated: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {animated && (
        <circle r={4} className="fill-none stroke-primary" strokeWidth={1} opacity={0.6}>
          <animate attributeName="r" values="4;22;4" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="2.6s" repeatCount="indefinite" />
        </circle>
      )}
      <circle r={4} className="fill-primary" />
      <circle r={4} className="fill-none stroke-background" strokeWidth={1.5} />
    </g>
  )
}

// Default export so this can be next/dynamic-imported without a JS chunk
// loading until the visitor actually scrolls to the Connection section.
export default function LocationBeacon() {
  const [state, setState] = React.useState<State>({ status: "loading" })
  const reduced = useReducedMotion()

  React.useEffect(() => {
    let cancelled = false
    // Static site, no server — the browser calls the geolocation lookup
    // directly. ipapi.co resolves the caller's own IP when none is given.
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        if (data.error || typeof data.latitude !== "number" || typeof data.longitude !== "number") {
          setState({ status: "done", result: { available: false } })
          return
        }
        setState({
          status: "done",
          result: {
            available: true,
            city: data.city ?? "Unknown",
            region: data.region ?? "",
            country: data.country_name ?? "Unknown",
            // Rounded to ~11km — enough to place a beacon, not an address.
            lat: Math.round(data.latitude * 10) / 10,
            lon: Math.round(data.longitude * 10) / 10,
          },
        })
      })
      .catch(() => {
        if (!cancelled) setState({ status: "done", result: { available: false } })
      })
    return () => {
      cancelled = true
    }
  }, [])

  const result = state.status === "done" ? state.result : null

  return (
    <div className="rounded-2xl border border-primary/15 bg-surface-raised p-6 shadow-[0_0_40px_-16px_var(--accent-glow)]">
      <svg viewBox={WORLD_MAP_VIEWBOX} className="h-auto w-full overflow-visible">
        <path d={WORLD_MAP_PATH} className="fill-primary/[0.07] stroke-primary/25" strokeWidth={0.75} />
        {result?.available && (
          <Beacon
            x={projectLatLon(result.lat, result.lon)[0]}
            y={projectLatLon(result.lat, result.lon)[1]}
            animated={!reduced}
          />
        )}
      </svg>

      <div className="mt-4 border-t border-border pt-4">
        {state.status === "loading" ? (
          <p className="font-mono text-sm text-text-tertiary uppercase tracking-wider animate-pulse">
            Locating…
          </p>
        ) : result?.available ? (
          <p className="font-mono text-sm text-foreground">
            Connecting from{" "}
            <span className="text-primary">
              {result.city}
              {result.region ? `, ${result.region}` : ""}
            </span>
            , {result.country}
          </p>
        ) : (
          <p className="font-mono text-sm text-text-tertiary">
            Location lookup unavailable right now.
          </p>
        )}
        <p className="mt-1 text-xs text-text-tertiary">
          Estimated from your IP address, accurate to a city — not GPS, not
          an address.
        </p>
      </div>
    </div>
  )
}

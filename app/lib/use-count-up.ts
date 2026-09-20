import * as React from "react"
import { animate, useReducedMotion } from "framer-motion"

// Counts up to `target` once, when `start` flips true. Reduced-motion just
// snaps to the final value.
export function useCountUp(target: number, start: boolean) {
  const [value, setValue] = React.useState(0)
  const reduced = useReducedMotion()
  const done = React.useRef(false)

  React.useEffect(() => {
    if (!start || done.current) return
    done.current = true

    const controls = animate(0, target, {
      duration: reduced ? 0 : 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [start, target, reduced])

  return value
}

// Stat values are static content, known at build time — rendering them
// directly means the real number is already in the static HTML on first
// paint, with nothing to hydrate before it's correct. `start` is kept in
// the signature so call sites (which gate on scroll-into-view) don't need
// to change.
export function useCountUp(target: number, start: boolean) {
  void start
  return target
}

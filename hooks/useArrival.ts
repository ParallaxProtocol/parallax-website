// useArrival.ts
import { useEffect, useState } from "react"

// Set once the first page has hydrated; module state, so it lasts across
// client-side navigations and resets on a full load.
let arrived = false

/** True on the page the visitor landed on (its server HTML and hydration),
 *  false on anything mounted by a later client-side navigation. Fixed at
 *  mount. Lets entrances play on arrival but not on coming back. */
export function useArrival() {
  const [arriving] = useState(() => !arrived)
  useEffect(() => {
    arrived = true
  }, [])
  return arriving
}

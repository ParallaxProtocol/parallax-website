// Hashwarp's repository. Kept out of the 'use client' download button so the
// server-rendered page gets the strings themselves: a constant exported from
// a client module reaches a server component as a client reference.
export const HASHWARP_REPO = "ParallaxProtocol/hashwarp"
export const HASHWARP_REPO_URL = `https://github.com/${HASHWARP_REPO}`
export const HASHWARP_MINING_GUIDE = `${HASHWARP_REPO_URL}/blob/main/docs/MINING.md`

/** Track failed admin logins per IP + email; lock after threshold. */

const MAX_ATTEMPTS = 5
const LOCK_MS = 15 * 60 * 1000

type Entry = { fails: number; lockedUntil: number }

const store = new Map<string, Entry>()

function key(ip: string, email: string) {
  return `${ip}::${email.toLowerCase()}`
}

export function isLocked(ip: string, email: string): boolean {
  const k = key(ip, email)
  const e = store.get(k)
  if (!e) return false
  if (Date.now() < e.lockedUntil) return true
  if (e.fails >= MAX_ATTEMPTS) {
    store.delete(k)
  }
  return false
}

export function recordFailure(ip: string, email: string) {
  const k = key(ip, email)
  const e = store.get(k) || { fails: 0, lockedUntil: 0 }
  e.fails += 1
  if (e.fails >= MAX_ATTEMPTS) {
    e.lockedUntil = Date.now() + LOCK_MS
  }
  store.set(k, e)
}

export function clearFailures(ip: string, email: string) {
  store.delete(key(ip, email))
}

export function lockoutRemainingMs(ip: string, email: string): number {
  const e = store.get(key(ip, email))
  if (!e || Date.now() >= e.lockedUntil) return 0
  return e.lockedUntil - Date.now()
}

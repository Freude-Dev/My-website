/** In-memory revoked JWT jti → expiry (unix seconds). Clears expired on read. */

const revoked = new Map<string, number>()

function cleanup() {
  const now = Math.floor(Date.now() / 1000)
  for (const [jti, exp] of revoked) {
    if (exp <= now) revoked.delete(jti)
  }
}

export function revokeToken(jti: string, expUnixSeconds: number) {
  revoked.set(jti, expUnixSeconds)
  cleanup()
}

export function isRevoked(jti: string): boolean {
  cleanup()
  return revoked.has(jti)
}

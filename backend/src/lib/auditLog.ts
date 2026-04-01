import fs from 'fs'
import path from 'path'

const LOG_DIR = path.join(process.cwd(), 'logs')
const LOG_FILE = path.join(LOG_DIR, 'admin-audit.log')

function ensureDir() {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true })
  } catch {
    // ignore
  }
}

export type AuditEvent =
  | 'login_success'
  | 'login_failure'
  | 'logout'
  | 'token_refresh'
  | 'token_revoked'

export function auditLog(event: AuditEvent, detail: Record<string, unknown>) {
  ensureDir()
  const line = JSON.stringify({
    t: new Date().toISOString(),
    event,
    ...detail,
  })
  try {
    fs.appendFileSync(LOG_FILE, line + '\n')
  } catch {
    console.warn('[audit] failed to write log')
  }
}

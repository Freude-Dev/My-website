import bcrypt from 'bcrypt'

export function hasAdminPasswordConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_PASSWORD_HASH?.length ||
      process.env.ADMIN_PASSWORD !== undefined
  )
}

export async function verifyAdminPassword(plain: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH
  const legacy = process.env.ADMIN_PASSWORD

  if (hash?.length) {
    return bcrypt.compare(plain, hash)
  }
  if (legacy !== undefined) {
    return plain === legacy
  }
  return false
}

// SHA-256 integrity check using native SubtleCrypto API

export async function hashString(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function verifyHash(input: string, expectedHash: string): Promise<boolean> {
  const actualHash = await hashString(input)
  return actualHash === expectedHash
}

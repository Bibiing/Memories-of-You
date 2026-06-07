// AES-GCM 256-bit encryption using native SubtleCrypto API (HTTPS only)

const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256
const IV_LENGTH = 12 // bytes, standard for AES-GCM

// Derive a key from a fixed app-level seed (not user-provided secret)
// This prevents trivial manual editing of save files, not cryptographic security
const APP_KEY_MATERIAL = 'memories-of-you-save-key-v1'

let _cachedKey: CryptoKey | null = null

async function getDerivedKey(): Promise<CryptoKey> {
  if (_cachedKey) return _cachedKey

  const rawMaterial = new TextEncoder().encode(APP_KEY_MATERIAL)
  const importedKey = await crypto.subtle.importKey('raw', rawMaterial, 'PBKDF2', false, [
    'deriveKey',
  ])

  const salt = new TextEncoder().encode('moy-salt-2025')
  _cachedKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    importedKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  )

  return _cachedKey
}

export interface EncryptedBlob {
  iv: string // base64
  data: string // base64
}

export async function encryptData(plaintext: string): Promise<EncryptedBlob> {
  const key = await getDerivedKey()
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
  const encoded = new TextEncoder().encode(plaintext)

  const cipherBuffer = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, encoded)

  return {
    iv: btoa(String.fromCharCode(...iv)),
    data: btoa(String.fromCharCode(...new Uint8Array(cipherBuffer))),
  }
}

export async function decryptData(blob: EncryptedBlob): Promise<string> {
  const key = await getDerivedKey()
  const iv = Uint8Array.from(atob(blob.iv), (c) => c.charCodeAt(0))
  const cipherBuffer = Uint8Array.from(atob(blob.data), (c) => c.charCodeAt(0))

  const plainBuffer = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, cipherBuffer)
  return new TextDecoder().decode(plainBuffer)
}

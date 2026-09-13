import { describe, expect, it } from 'vitest'
import { isEmailValid, normalizeEmail, safeReturnTo } from './config'
import { generateToken, hashToken, isTokenShapeValid } from './crypto'

describe('auth input policy', () => {
  it('normalizes valid email addresses', () => {
    const email = normalizeEmail('  Learner@Example.COM ')
    expect(email).toBe('learner@example.com')
    expect(isEmailValid(email)).toBe(true)
    expect(isEmailValid('not-an-email')).toBe(false)
  })

  it.each(['//attacker.example', 'https://attacker.example', '/\\attacker', '/path\nheader'])('rejects unsafe return path %j', (path) => {
    expect(safeReturnTo(path)).toBe('/')
  })

  it('preserves same-origin relative return paths', () => {
    expect(safeReturnTo('/missions/the-heist?mode=learn')).toBe('/missions/the-heist?mode=learn')
  })
})

describe('opaque auth tokens', () => {
  it('generates independent 256-bit URL-safe values', () => {
    const first = generateToken()
    const second = generateToken()

    expect(first).not.toBe(second)
    expect(isTokenShapeValid(first)).toBe(true)
    expect(isTokenShapeValid(second)).toBe(true)
  })

  it('hashes tokens to stable SHA-256 hex', async () => {
    const hash = await hashToken('a'.repeat(43))

    expect(hash).toMatch(/^[a-f0-9]{64}$/)
    await expect(hashToken('a'.repeat(43))).resolves.toBe(hash)
    await expect(hashToken('b'.repeat(43))).resolves.not.toBe(hash)
  })
})

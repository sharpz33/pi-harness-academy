import type { ExtensionAPI } from '@earendil-works/pi-coding-agent'
import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import academyCompanion from '../companion/index'

const extension = readFileSync(decodeURIComponent(new URL('../companion/index.ts', import.meta.url).pathname), 'utf8')
const manifest = JSON.parse(readFileSync(decodeURIComponent(new URL('../package.json', import.meta.url).pathname), 'utf8')) as { pi?: { extensions?: string[] } }

describe('Academy companion package', () => {
  it('is discoverable and registers both Pi commands', () => {
    const registerCommand = vi.fn()
    academyCompanion({ registerCommand } as unknown as ExtensionAPI)

    expect(manifest.pi?.extensions).toEqual(['./companion/index.ts'])
    expect(registerCommand.mock.calls.map(([name]) => name)).toEqual(['academy-connect', 'academy-check'])
  })

  it('submits only fixed allowlisted The Heist evidence', () => {
    expect(extension).toContain("const REQUIRED_HEIST_CHECKS = ['capability-executed', 'source-unchanged', 'boundaries-held', 'choice-explained']")
    expect(extension).toContain('body: JSON.stringify({ passedChecks })')
    expect(extension).not.toMatch(/process\.env\[[^\]]+\]|private transcript|sessionManager\.get/)
  })

  it('stores the scoped credential with restrictive local permissions', () => {
    expect(extension).toContain("mode: 0o600")
    expect(extension).toContain("chmod(temporary, 0o600)")
    expect(extension).toContain("info.isSymbolicLink()")
    expect(extension).not.toMatch(/console\.(?:log|error)|credential\}\)/)
  })
})

import { describe, expect, it } from 'vitest'
import { heistMission, missions } from './missions'

describe('mission catalog', () => {
  it('contains twelve ordered missions with unique slugs', () => {
    expect(missions).toHaveLength(12)
    expect(missions.map((mission) => mission.number)).toEqual(Array.from({ length: 12 }, (_, index) => index + 1))
    expect(new Set(missions.map((mission) => mission.slug))).toHaveProperty('size', missions.length)
    expect(missions.filter((mission) => mission.availability === 'available')).toEqual([heistMission])
  })

  it('defines the complete public The Heist contract', () => {
    expect(heistMission.launchBay?.commands).toHaveLength(3)
    expect(heistMission.launchBay?.credentialBoundary).toContain('directly inside Pi')
    expect(heistMission.steps).toHaveLength(4)
    expect(heistMission.evidence).toHaveLength(4)
    expect(heistMission.sources?.every((source) => source.url.startsWith('https://'))).toBe(true)
    expect(heistMission.sources?.some((source) => source.url.includes('pi.dev'))).toBe(true)
  })
})

describe('The Heist staged prompt', () => {
  const prompt = heistMission.prompt ?? ''

  it('fails closed around private and executable resources', () => {
    expect(prompt).toContain('untrusted data')
    expect(prompt).toContain('credentials')
    expect(prompt).toContain('sessions')
    expect(prompt).toContain('MCP')
    expect(prompt).toContain('hooks')
    expect(prompt).toContain('symlink')
    expect(prompt).toContain('Claude Code candidates: skills/ and commands/')
    expect(prompt).toContain('Codex candidates: .agents/skills')
    expect(prompt).toContain('Treat auth.json and history.jsonl as forbidden roots')
    expect(prompt).toContain('do not guess or search for undocumented session locations')
    expect(prompt).toContain('fail closed')
  })

  it('requires staged consent and keeps provider authentication outside Academy', () => {
    expect(prompt).toContain('STOP 1')
    expect(prompt).toContain('STOP 2')
    expect(prompt).toContain('Do not invoke or copy anything until I answer')
    expect(prompt).toContain('model-provider authentication')
    expect(prompt).toContain('Never ask me to paste a provider key')
  })

  it('activates native resources and narrowly copies adaptable Markdown', () => {
    expect(prompt).toContain('shared Agent Skills directory may be native to Pi')
    expect(prompt).toContain('activate the native candidate in place')
    expect(prompt).toContain('copy only the approved adaptable Markdown resource')
    expect(prompt).toContain('Never propose a move or whole-directory copy')
    expect(prompt).not.toMatch(/\b(?:cp\s+-[rR]|rsync|tar\s|mv\s)/)
  })

  it('verifies source immutability without exporting evidence', () => {
    expect(prompt).toContain('Record a local digest')
    expect(prompt).toContain('Recompute the local source digest')
    expect(prompt).toContain('source_unchanged: true or false')
    expect(prompt).toContain('Do not print or transmit the digest')
    expect(prompt).toContain('Do not send inventory, file contents, paths, or digests')
  })
})

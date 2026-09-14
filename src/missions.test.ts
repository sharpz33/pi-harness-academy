import { describe, expect, it } from 'vitest'
import { heistMission, missions } from './missions'

describe('mission catalog', () => {
  it('contains twelve ordered missions with unique slugs', () => {
    expect(missions).toHaveLength(12)
    expect(missions.map((mission) => mission.number)).toEqual(Array.from({ length: 12 }, (_, index) => index + 1))
    expect(new Set(missions.map((mission) => mission.slug))).toHaveProperty('size', missions.length)
    expect(missions.every((mission) => mission.availability === 'available')).toBe(true)
  })

  it('defines a complete public contract for every mission', () => {
    missions.forEach((mission) => {
      expect(mission.reveal).toBeTruthy()
      expect(mission.objective).toBeTruthy()
      expect(mission.launchBay?.commands.length).toBeGreaterThanOrEqual(2)
      expect(mission.launchBay?.credentialBoundary).toBeTruthy()
      expect(mission.steps).toHaveLength(4)
      expect(mission.prompt).toContain(`Mission ${String(mission.number).padStart(2, '0')}`)
      expect(mission.prompt).toContain(`.pi-academy/evidence/${mission.slug}.json`)
      expect(mission.evidence).toHaveLength(4)
      expect(mission.sources?.every((source) => source.url.startsWith('https://'))).toBe(true)
    })
  })

  it('keeps the specialized The Heist safety contract', () => {
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

  it('fails closed around credential, session, and symlink roots', () => {
    const forbiddenRoots = ['.credentials.json', 'projects/', 'auth.json', 'history.jsonl']

    expect(prompt).toContain('untrusted data')
    expect(prompt).toContain('Never descend into credential or session directories')
    expect(prompt).toContain('do not guess or search for undocumented session locations')
    expect(prompt).toContain('Do not follow symlinks')
    expect(prompt).toContain('fail closed')
    forbiddenRoots.forEach((root) => expect(prompt).toContain(root))
  })

  it('allows bounded Markdown-only native packages while quarantining executable dependencies', () => {
    const quarantinedResources = ['MCP', 'hooks', 'plugins', 'extensions', 'scripts', 'imports']

    expect(prompt).toContain('self-contained')
    expect(prompt).toContain('regular Markdown file')
    expect(prompt).toContain('native-package candidate')
    expect(prompt).toContain('package-internal Markdown files')
    expect(prompt).toContain('nested symlinks, non-Markdown files')
    expect(prompt).toContain('resources outside the selected package')
    quarantinedResources.forEach((resource) => expect(prompt).toContain(resource))
  })

  it('requires both approval stops in sequence', () => {
    const firstStop = prompt.indexOf('STOP 1')
    const secondStop = prompt.indexOf('STOP 2')

    expect(firstStop).toBeGreaterThan(0)
    expect(secondStop).toBeGreaterThan(firstStop)
    expect(prompt).toContain('Do nothing else until I answer')
    expect(prompt).toContain('Do not invoke or copy anything until I answer')
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
    expect(prompt).toContain('Do not print or transmit any digest')
    expect(prompt).toContain('Do not send inventory, file contents, paths, or digests')
    expect(prompt).toContain('Leave the source untouched')
  })
})

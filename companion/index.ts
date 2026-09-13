import type { ExtensionAPI } from '@earendil-works/pi-coding-agent'
import { chmod, lstat, mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { homedir, platform } from 'node:os'
import { dirname, join } from 'node:path'

const ACADEMY_ORIGIN = 'https://piacade.my'
const REQUIRED_HEIST_CHECKS = ['capability-executed', 'source-unchanged', 'boundaries-held', 'choice-explained'] as const
const profileRoot = process.env.PI_CODING_AGENT_DIR || join(homedir(), '.pi', 'agent')
const credentialPath = join(profileRoot, 'academy', 'device.json')

const request = async <T>(path: string, init: RequestInit): Promise<{ status: number; body: T }> => {
  const response = await fetch(`${ACADEMY_ORIGIN}${path}`, { ...init, signal: AbortSignal.timeout(10_000) })
  const body = await response.json() as T
  return { status: response.status, body }
}

const inspectLocalFile = async (path: string, maxBytes: number, missingMessage: string) => {
  try {
    const info = await lstat(path)
    if (!info.isFile() || info.isSymbolicLink() || info.size > maxBytes) throw new Error(missingMessage)
    return info
  } catch {
    throw new Error(missingMessage)
  }
}

const saveCredential = async (credential: string): Promise<void> => {
  const directory = dirname(credentialPath)
  const temporary = `${credentialPath}.${crypto.randomUUID()}.tmp`
  await mkdir(directory, { recursive: true, mode: 0o700 })
  await writeFile(temporary, `${JSON.stringify({ origin: ACADEMY_ORIGIN, credential })}\n`, { mode: 0o600 })
  await chmod(temporary, 0o600)
  await rename(temporary, credentialPath)
}

const loadCredential = async (): Promise<string> => {
  await inspectLocalFile(credentialPath, 2048, 'No valid Academy authorization found. Run /academy-connect first.')
  const parsed = JSON.parse(await readFile(credentialPath, 'utf8')) as { origin?: unknown; credential?: unknown }
  if (parsed.origin !== ACADEMY_ORIGIN || typeof parsed.credential !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(parsed.credential)) {
    throw new Error('Academy credential file is invalid')
  }
  return parsed.credential
}

const openBrowser = async (pi: ExtensionAPI, url: string): Promise<void> => {
  const command: string = platform() === 'darwin' ? 'open' : platform() === 'win32' ? 'cmd' : 'xdg-open'
  const args: string[] = platform() === 'win32' ? ['/c', 'start', '', url] : [url]
  const result = await pi.exec(command, args, { timeout: 10_000 })
  if (result.code !== 0) throw new Error('Could not open the browser')
}

export default function academyCompanion(pi: ExtensionAPI) {
  pi.registerCommand('academy-connect', {
    description: 'Authorize this Pi profile for Academy checkpoints',
    handler: async (_args, ctx) => {
      try {
        const created = await request<{
          deviceCode: string
          userCode: string
          verificationUriComplete: string
          expiresIn: number
          interval: number
        }>('/api/device-authorizations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        })
        if (created.status !== 201) throw new Error('Academy did not create an authorization request')

        ctx.ui.notify(`Academy code: ${created.body.userCode}`, 'info')
        const shouldOpen = ctx.hasUI && await ctx.ui.confirm('Open Academy?', `Confirm code ${created.body.userCode} in your browser.`)
        if (shouldOpen) await openBrowser(pi, created.body.verificationUriComplete)
        else ctx.ui.notify(`Open: ${created.body.verificationUriComplete}`, 'info')

        const deadline = Date.now() + created.body.expiresIn * 1000
        while (Date.now() < deadline) {
          await new Promise((resolve) => setTimeout(resolve, Math.max(3, created.body.interval) * 1000))
          const exchange = await request<{ status: string; credential?: string }>('/api/device-authorizations/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceCode: created.body.deviceCode }),
          })
          if (exchange.status === 202) continue
          if (exchange.status !== 200 || exchange.body.status !== 'authorized' || typeof exchange.body.credential !== 'string') {
            throw new Error('Academy authorization expired or was rejected')
          }
          await saveCredential(exchange.body.credential)
          ctx.ui.notify('Academy profile authorized. The scoped credential was stored locally.', 'info')
          return
        }
        throw new Error('Academy authorization timed out')
      } catch (error) {
        ctx.ui.notify(error instanceof Error ? error.message : 'Academy authorization failed', 'error')
      }
    },
  })

  pi.registerCommand('academy-check', {
    description: 'Submit allowlisted local evidence for The Heist',
    handler: async (args, ctx) => {
      if (args.trim() !== 'the-heist') {
        ctx.ui.notify('Usage: /academy-check the-heist', 'warning')
        return
      }
      try {
        const evidencePath = join(ctx.cwd, '.pi-academy', 'evidence', 'the-heist.json')
        await inspectLocalFile(evidencePath, 4096, 'No valid The Heist evidence found. Run the current mission prompt, then retry /academy-check the-heist.')
        const parsed = JSON.parse(await readFile(evidencePath, 'utf8')) as { mission?: unknown; checks?: Record<string, unknown> }
        if (parsed.mission !== 'the-heist' || !parsed.checks || Object.keys(parsed.checks).some((id) => !REQUIRED_HEIST_CHECKS.includes(id as typeof REQUIRED_HEIST_CHECKS[number]))) {
          throw new Error('The Heist evidence shape is invalid')
        }
        const passedChecks = REQUIRED_HEIST_CHECKS.filter((id) => parsed.checks?.[id] === true)
        const credential = await loadCredential()
        const result = await request<{ status: string; readiness?: number; nextMission?: string; missingChecks?: string[] }>('/api/checkpoints/the-heist', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${credential}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ passedChecks }),
        })
        if (result.status !== 200 || result.body.status !== 'passed') {
          throw new Error(`Checkpoint ${result.body.status || 'failed'}; complete every local evidence check`)
        }
        ctx.ui.notify(`The Heist verified. Readiness: ${result.body.readiness}%. Next: ${result.body.nextMission}.`, 'info')
      } catch (error) {
        ctx.ui.notify(error instanceof Error ? error.message : 'Checkpoint submission failed', 'error')
      }
    },
  })
}

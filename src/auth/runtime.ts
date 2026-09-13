import { readAuthConfig } from './config'
import { CloudflareAuthMailer } from './mailer'
import { AuthService } from './service'
import { D1AuthStore } from './store'
import type { AuthApplication } from './types'

export const createAuthApplication = (bindings: CloudflareBindings): AuthApplication => {
  if (!bindings.DB || !bindings.EMAIL) {
    throw new Error('Authentication bindings are missing')
  }

  const config = readAuthConfig(bindings)
  return new AuthService(new D1AuthStore(bindings.DB), new CloudflareAuthMailer(bindings.EMAIL, config.from), config)
}

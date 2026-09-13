export type AuthConfig = {
  appOrigin: string
  from: string
}

export const normalizeEmail = (value: string): string => value.trim().toLowerCase()

export const isEmailValid = (value: string): boolean =>
  value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const safeReturnTo = (value?: string): string => {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\') || /[\u0000-\u001f\u007f]/.test(value)) {
    return '/'
  }

  return value
}

export const readAuthConfig = (bindings: CloudflareBindings): AuthConfig => {
  if (!bindings.APP_ORIGIN || !bindings.AUTH_FROM) {
    throw new Error('Authentication configuration is missing')
  }

  const origin = new URL(bindings.APP_ORIGIN)
  if (origin.protocol !== 'https:' && origin.hostname !== 'localhost') {
    throw new Error('APP_ORIGIN must use HTTPS outside localhost')
  }

  return {
    appOrigin: origin.origin,
    from: bindings.AUTH_FROM,
  }
}

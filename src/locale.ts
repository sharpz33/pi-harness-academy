export type Locale = 'en' | 'pl'

export const localizedPath = (locale: Locale, path: string): string => {
  if (locale === 'en') return path
  return path === '/' ? '/pl' : `/pl${path}`
}

export const localeFromReturnTo = (returnTo: string): Locale =>
  returnTo === '/pl' || returnTo.startsWith('/pl/') ? 'pl' : 'en'

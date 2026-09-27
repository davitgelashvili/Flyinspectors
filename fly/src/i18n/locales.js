export const LOCALES = ['en', 'ka']
export const DEFAULT_LOCALE = 'en'

export function localeFromHost(hostname = '') {
  return hostname.includes('flyinspectors.ge') ? 'ka' : DEFAULT_LOCALE
}

export function localeFromPath(pathname = '') {
  const segment = pathname.split('/')[1]
  return LOCALES.includes(segment) ? segment : DEFAULT_LOCALE
}

export function stripLocale(pathname = '') {
  const segments = pathname.split('/')
  if (LOCALES.includes(segments[1])) segments.splice(1, 1)
  return segments.join('/') || '/'
}

export function withLocale(pathname, locale) {
  const segments = pathname.split('/')
  if (LOCALES.includes(segments[1])) segments[1] = locale
  else segments.splice(1, 0, locale)
  return segments.join('/') || `/${locale}`
}

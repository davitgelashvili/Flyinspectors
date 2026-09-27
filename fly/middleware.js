import { NextResponse } from 'next/server'
import { LOCALES, localeFromHost } from '@/i18n/locales'

export function middleware(request) {
  const { pathname } = request.nextUrl
  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  )
  if (hasLocale) return NextResponse.next()

  const locale = localeFromHost(request.headers.get('host') || '')
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|adminpanel|api|.*\\..*).*)'],
}

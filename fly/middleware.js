import { NextResponse } from 'next/server'
import { LOCALES, localeFromHost } from '@/i18n/locales'

const API_URL = process.env.NEXT_PUBLIC_API_URL
const REDIRECTS_TTL = 60 * 1000

// ადმინში (გადამისამართებები) შექმნილი 301/302 წესები. middleware-ს ბაზასთან პირდაპირ წვდომა არ აქვს,
// ამიტომ API-დან ვკითხულობთ და 60 წამით ვიმახსოვრებთ (ცვლილება მაქსიმუმ 1 წუთში ამოქმედდება).
// API-ს მიუწვდომლობისას ბოლო ცნობილი სია რჩება, საიტი კი ჩვეულებრივად მუშაობს.
let redirectsCache = { at: 0, map: new Map() }

async function getRedirects() {
  if (!API_URL || Date.now() - redirectsCache.at < REDIRECTS_TTL) return redirectsCache.map

  try {
    const res = await fetch(`${API_URL}/redirects`, { signal: AbortSignal.timeout(1500) })
    if (!res.ok) throw new Error(String(res.status))
    const list = await res.json()
    redirectsCache = { at: Date.now(), map: new Map(list.map((r) => [r.from, r])) }
  } catch {
    // შეცდომისას 5 წამში ვცდით ხელახლა
    redirectsCache = { ...redirectsCache, at: Date.now() - REDIRECTS_TTL + 5000 }
  }
  return redirectsCache.map
}

// ენის prefix-ის გარეშე: "/ka/old-page" → { locale: "ka", rest: "/old-page" }
function splitLocale(pathname) {
  const locale = LOCALES.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  return locale ? { locale, rest: pathname.slice(locale.length + 1) || '/' } : { locale: null, rest: pathname }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // ერთი redirect პირდაპირ სწორ მისამართზე (ჯაჭვის გარეშე):
  //  /En/About-Us → /en/about-us  — ზედა რეგისტრი არ ქმნის დუბლს
  //  /page////, //page, /page/ → /page — ზედმეტი და ბოლო '/' იხსნება
  // %XX-ის (ქართული slug) ციფრებს არ ვეხებით, თორემ redirect ციკლში გადავარდებოდა.
  // ბოლო '/'-ის ჩაშენებული redirect next.config-ში გამორთულია (skipTrailingSlashRedirect).
  const normalized = pathname
    .replace(/%[0-9a-f]{2}|[A-Z]/gi, (m) => (m[0] === '%' ? m : m.toLowerCase()))
    .replace(/\/{2,}/g, '/')
    .replace(/(.)\/$/, '$1')
  if (normalized !== pathname) {
    // new URL და არა nextUrl.clone(): NextURL ბოლო '/'-ს უკან აბრუნებს
    return NextResponse.redirect(new URL(normalized + request.nextUrl.search, request.url), 308)
  }

  // ადმინში მითითებული გადამისამართება (301/302): ძველი მისამართი → ახალი.
  // წესი "/old-page" მუშაობს ენის prefix-ითაც და მის გარეშეც; "/ka/old-page" მხოლოდ ზუსტად ამ ენაზე.
  const { locale, rest } = splitLocale(pathname)
  const redirects = await getRedirects()
  if (redirects.size) {
    const rule = redirects.get(pathname) || (locale && redirects.get(rest))
    if (rule) {
      const external = /^https?:\/\//i.test(rule.to)
      // ახალი მისამართი ენის გარეშეა → მომხმარებლის (ან დომენის) ენას ვუმატებთ, რომ ორმაგი გადამისამართება არ მოხდეს
      const addLocale = !external && !splitLocale(rule.to).locale
      const prefix = locale || localeFromHost(request.headers.get('host') || '')
      const target = addLocale ? `/${prefix}${rule.to === '/' ? '' : rule.to}` : rule.to
      const destination = new URL(target, request.url)
      if (!external && !target.includes('?')) destination.search = request.nextUrl.search
      return NextResponse.redirect(destination, rule.type === 302 ? 302 : 301)
    }
  }

  if (locale) return NextResponse.next()

  const defaultLocale = localeFromHost(request.headers.get('host') || '')
  const url = request.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

// სტატიკური ფაილები (სურათი, ფონტი, css/js...) middleware-ს არ გადის; დანარჩენი — "old.html", "index.php" და
// მისთანები — გადის, რომ ადმინის გადამისამართებამ მათაც გადაამისამართოს.
export const config = {
  matcher: [
    '/((?!_next|adminpanel|api|fonts|.*\.(?:ico|png|jpe?g|gif|svg|webp|avif|css|js|map|txt|xml|json|woff2?|ttf|otf|eot|mp4|webm|pdf)$).*)',
  ],
}

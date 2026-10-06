// საიტი რამდენიმე დომენზეა (.com, .ge, .co.uk). sitemap, robots, canonical, hreflang და
// Search Console-ის ტოკენი თითოეულ დომენზე საკუთარი უნდა იყოს, ამიტომ მოთხოვნის host-იდან ვადგენთ.
import { headers } from 'next/headers'

const ALLOWED_HOSTS = ['flyinspectors.com', 'flyinspectors.ge', 'flyinspectors.co.uk']
const FALLBACK_HOST = 'flyinspectors.ge'

// მოთხოვნის დომენი 'www.'-ისა და პორტის გარეშე. უცნობი დომენი (მაგ. ლოკალური ან preview) → .ge
export function getSiteHost() {
  const h = headers()
  const raw = (h.get('x-forwarded-host') || h.get('host') || '').split(',')[0]
  const host = raw.trim().toLowerCase().replace(/:\d+$/, '').replace(/^www\./, '')
  return ALLOWED_HOSTS.includes(host) ? host : FALLBACK_HOST
}

export function getSiteOrigin() {
  return `https://${getSiteHost()}`
}

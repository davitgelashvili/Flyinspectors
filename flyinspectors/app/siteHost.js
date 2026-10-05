// საიტი რამდენიმე დომენზეა (.com, .ge, .co.uk). sitemap და robots თითოეულ დომენზე
// საკუთარ მისამართს უნდა აბრუნებდეს, ამიტომ მოთხოვნის host-იდან ვადგენთ.
import { headers } from 'next/headers'

const ALLOWED_HOSTS = ['flyinspectors.com', 'flyinspectors.ge', 'flyinspectors.co.uk']
const FALLBACK_HOST = 'flyinspectors.ge'

export function getSiteOrigin() {
  const h = headers()
  const raw = (h.get('x-forwarded-host') || h.get('host') || '').split(',')[0]
  const host = raw.trim().toLowerCase().replace(/:\d+$/, '').replace(/^www\./, '')
  return `https://${ALLOWED_HOSTS.includes(host) ? host : FALLBACK_HOST}`
}

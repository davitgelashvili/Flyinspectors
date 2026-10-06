import { getSiteOrigin } from '../siteHost'

// robots.txt დინამიურია, რომ ყოველ დომენზე (.com, .ge, .co.uk) საკუთარ sitemap-ზე მიუთითებდეს —
// სტატიკური ფაილი სამივე დომენზე მხოლოდ .ge-ს sitemap-ს აჩვენებდა.
// /signature და /check-status აქ არ იკრძალება: დახურულ მისამართზე Google noindex-ს ვერ ნახავს,
// ამიტომ ისინი meta robots-ით არის დახურული (pageMeta.js).
export const dynamic = 'force-dynamic'

export function GET() {
  const lines = [
    '# https://www.robotstxt.org/robotstxt.html',
    'User-agent: *',
    'Disallow: /adminpanel/',
    'Disallow: /api/',
    '',
    `Sitemap: ${getSiteOrigin()}/sitemap.xml`,
  ]

  return new Response(`${lines.join('\n')}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  })
}

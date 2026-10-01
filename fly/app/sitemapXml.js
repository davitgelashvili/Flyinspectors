// XML საიტმეფი შაბლონის მიხედვით: მთავარი sitemap.xml ინდექსია და ორ ფაილზე მიუთითებს —
// page-sitemap.xml (გვერდები) და post-sitemap.xml (ბლოგის სტატიები).
// category-sitemap.xml არ გვაქვს: საიტზე კატეგორიები არ არსებობს.
import { getPages } from '@/api/serverApi'
import { LOCALES, X_DEFAULT_LOCALE } from '@/i18n/locales'
import { getSiteOrigin } from './siteHost'

// /signature და /check-status განზრახ არ შედის — პირადი განაცხადის ნაბიჯებია, ძიებაში არ უნდა ჩანდეს.
const PAGE_PATHS = [
  '/',
  '/submit-claim',
  '/about-us',
  '/about-us/blog',
  '/about-us/faq',
  '/contact-us',
  '/terms-and-conditions',
  '/your-rights/flight-cancellation',
  '/your-rights/flight-delay',
  '/your-rights/lost-luggage',
  '/your-rights/missed-connection',
  '/your-rights/overbooked-flight',
]

const POST_PATHS = [
  '/about-us/blog-page-more',
  '/about-us/blog-page-more-airports',
  '/about-us/blog-page-more-pets',
  '/about-us/blog-page-more-pilots',
]

const localePath = (path, lang) => `/${lang}${path === '/' ? '' : path}`

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const xmlResponse = (body) =>
  new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}\n`, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  })

const lastmodTag = (date) => (date ? `<lastmod>${date.toISOString()}</lastmod>` : '')

// ადმინიდან შექმნილი გვერდები (/[slug]); getPages მხოლოდ გამოქვეყნებულს აბრუნებს
async function customPages() {
  const pages = await getPages()
  return (Array.isArray(pages) ? pages : []).map((page) => ({
    path: `/${page.slug}`,
    lastModified: page.updatedAt ? new Date(page.updatedAt) : null,
  }))
}

function urlset(origin, entries) {
  const urls = entries.flatMap(({ path, lastModified }) =>
    LOCALES.map((lang) => {
      const link = (hreflang, l) =>
        `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(origin + localePath(path, l))}"/>`
      const alternates = LOCALES.map((l) => link(l, l)).join('') + link('x-default', X_DEFAULT_LOCALE)
      return `<url><loc>${escapeXml(origin + localePath(path, lang))}</loc>${lastmodTag(lastModified)}${alternates}</url>`
    })
  )
  return xmlResponse(
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>`
  )
}

export async function pageSitemap() {
  const entries = [...PAGE_PATHS.map((path) => ({ path, lastModified: null })), ...(await customPages())]
  return urlset(getSiteOrigin(), entries)
}

export function postSitemap() {
  return urlset(getSiteOrigin(), POST_PATHS.map((path) => ({ path, lastModified: null })))
}

export async function sitemapIndex() {
  const origin = getSiteOrigin()
  const dates = (await customPages()).map((p) => p.lastModified).filter(Boolean)
  const pagesLastmod = dates.length ? new Date(Math.max(...dates)) : null
  const items = [
    { file: 'page-sitemap.xml', lastModified: pagesLastmod },
    { file: 'post-sitemap.xml', lastModified: null },
  ]
  return xmlResponse(
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items
      .map(({ file, lastModified }) => `<sitemap><loc>${origin}/${file}</loc>${lastmodTag(lastModified)}</sitemap>`)
      .join('')}</sitemapindex>`
  )
}

// XML საიტმეფი შაბლონის მიხედვით: მთავარი sitemap.xml ინდექსია და ორ ფაილზე მიუთითებს —
// page-sitemap.xml (გვერდები) და post-sitemap.xml (ბლოგის სტატიები).
// category-sitemap.xml არ გვაქვს: საიტზე კატეგორიები არ არსებობს.
import { getPages, getPosts } from '@/api/serverApi'
import { LOCALES, X_DEFAULT_LOCALE } from '@/i18n/locales'
import { postPath } from '@/utils/post'
import { getSiteOrigin } from './siteHost'

// მხოლოდ ის მარშრუტები, რომლებიც კოდშია და მუდმივად დარჩება.
// ადმინიდან შექმნილი გვერდები customPages()-იდან თვითონ ემატება (slug-ის მიხედვით), ამიტომ
// ასეთი გვერდი აქ არ იწერება — ხელით ჩაწერა მას გააორმაგებდა.
// /your-rights/* აქ განზრახ არ არის: ეს გვერდები ქასთუმ გვერდებად გადადის და მაშინ
// sitemap-ში ავტომატურად გამოჩნდება — ამ სიის ხელახალი რედაქტირება არ დაგჭირდება.
// /signature და /check-status განზრახ არ შედის — პირადი განაცხადის ნაბიჯებია, ძიებაში არ უნდა ჩანდეს.
const PAGE_PATHS = [
  '/',
  '/submit-claim',
  '/about-us',
  '/blog',
  '/faq',
  '/contact-us',
]

// ბლოგის სტატიები ბაზიდან მოდის (ადმინი → ბლოგი); სტატიკური სია აღარ არის.
// სიის მე-2+ გვერდი (/blog?page=2) განზრახ არ შედის — ბოტი მას სიიდან ისედაც მიჰყვება.
async function blogPosts() {
  const { items } = await getPosts()
  return (Array.isArray(items) ? items : []).map((post) => ({
    path: postPath(post.slug),
    lastModified: post.updatedAt ? new Date(post.updatedAt) : null,
  }))
}

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

// ჩანაწერებიდან ყველაზე ახალი ცვლილების თარიღი (ყველა უთარიღოა → null)
function newest(entries) {
  const dates = entries.map((e) => e.lastModified).filter(Boolean)
  return dates.length ? new Date(Math.max(...dates)) : null
}

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

export async function postSitemap() {
  return urlset(getSiteOrigin(), await blogPosts())
}

export async function sitemapIndex() {
  const origin = getSiteOrigin()
  const pagesLastmod = newest(await customPages())
  const items = [
    { file: 'page-sitemap.xml', lastModified: pagesLastmod },
    { file: 'post-sitemap.xml', lastModified: newest(await blogPosts()) },
  ]
  return xmlResponse(
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items
      .map(({ file, lastModified }) => `<sitemap><loc>${origin}/${file}</loc>${lastmodTag(lastModified)}</sitemap>`)
      .join('')}</sitemapindex>`
  )
}

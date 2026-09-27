import { notFound } from 'next/navigation'
import { getPage } from '@/api/serverApi'
import { LOCALES, DEFAULT_LOCALE } from '@/i18n/locales'
import CustomPage from '@/views/CustomPage/CustomPage'

function pickLocale(lang) {
  return LOCALES.includes(lang) ? lang : DEFAULT_LOCALE
}

// მეტა-ტეგები ბაზიდან — ადმინში შევსებული metaTitle და metaDescription
export async function generateMetadata({ params }) {
  const page = await getPage(params.slug)
  if (!page || !page.published) return {}

  const locale = pickLocale(params.lang)
  const title = page.metaTitle?.[locale] || page.title?.[locale] || ''
  const description = page.metaDescription?.[locale] || ''
  const url = `/${locale}/page/${page.slug}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `/${l}/page/${page.slug}`])
      ),
    },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      ...(page.cover ? { images: [page.cover] } : {}),
    },
    twitter: {
      card: page.cover ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(page.cover ? { images: [page.cover] } : {}),
    },
  }
}

export default async function CustomPageRoute({ params }) {
  const page = await getPage(params.slug)

  // გამოუქვეყნებელი გვერდი საიტზე არ უნდა ჩანდეს
  if (!page || !page.published) notFound()

  return <CustomPage page={page} locale={pickLocale(params.lang)} />
}

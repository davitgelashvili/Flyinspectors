import { notFound } from 'next/navigation'
import { getPage } from '@/api/serverApi'
import { LOCALES, DEFAULT_LOCALE, X_DEFAULT_LOCALE } from '@/i18n/locales'
import CustomPage from '@/views/CustomPage/CustomPage'
import { JsonLd, articleSchema } from '@/seo/jsonLd'
import { getGlobalOgImage, getGlobalOgImageAlt } from '@/i18n/pageMeta'
import { cloudinarySocialImage } from '@/utils/cloudinary'

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
  const slug = page.slug.toLowerCase()
  const url = `/${locale}/${slug}`
  // cover-ის გარეშე გვერდს გლობალური გაზიარების ფოტო ეძლევა (ადმინი → მეტა თეგები)
  const cover = page.cover || (await getGlobalOgImage(locale))
  // alt იმ ფოტოსი, რომელიც გამოიყენეს
  const coverAlt = page.cover
    ? page.coverAlt?.[locale]?.trim() || title
    : await getGlobalOgImageAlt(locale)
  // og:image-ს f_auto არ ეძლევა — სოც. ქსელების crawler-ებს კონკრეტული JPEG სჭირდებათ
  const ogImages = cover
    ? [{ url: cloudinarySocialImage(cover), ...(coverAlt && { alt: coverAlt }) }]
    : undefined

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}/${slug}`])),
        'x-default': `/${X_DEFAULT_LOCALE}/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      ...(ogImages && { images: ogImages }),
    },
    twitter: {
      card: cover ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(ogImages && { images: ogImages }),
    },
  }
}

export default async function CustomPageRoute({ params }) {
  const page = await getPage(params.slug)

  // გამოუქვეყნებელი გვერდი საიტზე არ უნდა ჩანდეს
  if (!page || !page.published) notFound()

  const locale = pickLocale(params.lang)

  return (
    <>
      <JsonLd
        data={articleSchema({
          path: `/${page.slug.toLowerCase()}`,
          locale,
          headline: page.title?.[locale] || page.metaTitle?.[locale] || '',
          description: page.metaDescription?.[locale],
          imageUrl: page.cover,
          datePublished: page.createdAt,
          dateModified: page.updatedAt,
        })}
      />
      <CustomPage page={page} locale={locale} />
    </>
  )
}

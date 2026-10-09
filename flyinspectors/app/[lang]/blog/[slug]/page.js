import { notFound } from 'next/navigation'
import { getPost } from '@/api/serverApi'
import { LOCALES, DEFAULT_LOCALE, X_DEFAULT_LOCALE } from '@/i18n/locales'
import { getGlobalOgImage, getGlobalOgImageAlt } from '@/i18n/pageMeta'
import { cloudinarySocialImage } from '@/utils/cloudinary'
import { postText, postSummary, postPath, withLocalePath } from '@/utils/post'
import { JsonLd, articleSchema } from '@/seo/jsonLd'
import BlogPost from '@/views/Blog/BlogPost'

const pickLocale = (lang) => (LOCALES.includes(lang) ? lang : DEFAULT_LOCALE)

// მეტა ტეგები ბაზიდან — ადმინში შევსებული metaTitle/metaDescription (ცარიელია → სტატიის სათაური/აღწერა)
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug)
  if (!post || !post.published) return {}

  const locale = pickLocale(params.lang)
  const title = postText(post, 'metaTitle', locale) || postText(post, 'title', locale)
  const description = postText(post, 'metaDescription', locale) || postSummary(post, locale)
  const path = postPath(post.slug)

  // ქოვერის გარეშე სტატიას გლობალური გაზიარების ფოტო ეძლევა (ადმინი → მეტა თეგები)
  const cover = post.cover || (await getGlobalOgImage(locale))
  const coverAlt = post.cover
    ? postText(post, 'coverAlt', locale) || title
    : await getGlobalOgImageAlt(locale)
  // og:image-ს f_auto არ ეძლევა — სოც. ქსელების crawler-ებს კონკრეტული JPEG სჭირდებათ
  const images = cover
    ? [{ url: cloudinarySocialImage(cover), ...(coverAlt && { alt: coverAlt }) }]
    : undefined

  return {
    title,
    description,
    alternates: {
      canonical: withLocalePath(path, locale),
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, withLocalePath(path, l)])),
        'x-default': withLocalePath(path, X_DEFAULT_LOCALE),
      },
    },
    openGraph: {
      type: 'article',
      url: withLocalePath(path, locale),
      title,
      description,
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      ...(images && { images }),
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(images && { images }),
    },
  }
}

export default async function BlogPostRoute({ params }) {
  const post = await getPost(params.slug)

  // გამოუქვეყნებელი სტატია საიტზე არ უნდა ჩანდეს
  if (!post || !post.published) notFound()

  const locale = pickLocale(params.lang)

  return (
    <>
      <JsonLd
        data={articleSchema({
          path: postPath(post.slug),
          locale,
          headline: postText(post, 'title', locale),
          description: postSummary(post, locale),
          imageUrl: post.cover,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
        })}
      />
      <BlogPost post={post} locale={locale} />
    </>
  )
}

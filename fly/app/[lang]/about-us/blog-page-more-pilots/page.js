import BlogPageMorePilots from '@/views/BlogPageMore Pilots/BlogPageMorePilots'
import { buildMetadata } from '@/i18n/pageMeta'
import { ArticleJsonLd } from '@/seo/PageJsonLd'

export function generateMetadata({ params }) {
  return buildMetadata('/about-us/blog-page-more-pilots', params.lang)
}

export default function BlogPageMorePilotsRoute({ params }) {
  return (
    <>
      <ArticleJsonLd path="/about-us/blog-page-more-pilots" lang={params.lang} />
      <BlogPageMorePilots />
    </>
  )
}

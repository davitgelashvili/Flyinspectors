import BlogPageMoreAirports from '@/views/BlogPageMore Airports/BlogPageMore'
import { buildMetadata } from '@/i18n/pageMeta'
import { ArticleJsonLd } from '@/seo/PageJsonLd'

export function generateMetadata({ params }) {
  return buildMetadata('/about-us/blog-page-more-airports', params.lang)
}

export default function BlogPageMoreAirportsRoute({ params }) {
  return (
    <>
      <ArticleJsonLd path="/about-us/blog-page-more-airports" lang={params.lang} />
      <BlogPageMoreAirports />
    </>
  )
}

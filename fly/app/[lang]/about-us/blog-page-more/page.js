import BlogPageMore from '@/views/BlogPageMore/BlogPageMore'
import { buildMetadata } from '@/i18n/pageMeta'
import { ArticleJsonLd } from '@/seo/PageJsonLd'

export function generateMetadata({ params }) {
  return buildMetadata('/about-us/blog-page-more', params.lang)
}

export default function BlogPageMoreRoute({ params }) {
  return (
    <>
      <ArticleJsonLd path="/about-us/blog-page-more" lang={params.lang} />
      <BlogPageMore />
    </>
  )
}

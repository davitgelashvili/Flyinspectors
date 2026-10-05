import BlogPageMorePets from '@/views/BlogPageMore Pets/BlogPageMorePets'
import { buildMetadata } from '@/i18n/pageMeta'
import { ArticleJsonLd } from '@/seo/PageJsonLd'

export function generateMetadata({ params }) {
  return buildMetadata('/about-us/blog-page-more-pets', params.lang)
}

export default function BlogPageMorePetsRoute({ params }) {
  return (
    <>
      <ArticleJsonLd path="/about-us/blog-page-more-pets" lang={params.lang} />
      <BlogPageMorePets />
    </>
  )
}

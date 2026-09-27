import BlogPageMore from '@/views/BlogPageMore/BlogPageMore'
import { buildMetadata } from '@/i18n/pageMeta'

export function generateMetadata({ params }) {
  return buildMetadata('/about-us/blog-page-more', params.lang)
}

export default function BlogPageMoreRoute() {
  return <BlogPageMore />
}

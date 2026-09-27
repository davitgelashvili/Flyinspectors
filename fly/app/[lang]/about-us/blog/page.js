import BlogPage from '@/views/Blog page/BlogPage'
import { buildMetadata } from '@/i18n/pageMeta'

export function generateMetadata({ params }) {
  return buildMetadata('/about-us/blog', params.lang)
}

export default function BlogRoute() {
  return <BlogPage />
}

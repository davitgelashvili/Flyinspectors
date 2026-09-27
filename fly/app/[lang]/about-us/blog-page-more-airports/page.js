import BlogPageMoreAirports from '@/views/BlogPageMore Airports/BlogPageMore'
import { buildMetadata } from '@/i18n/pageMeta'

export function generateMetadata({ params }) {
  return buildMetadata('/about-us/blog-page-more-airports', params.lang)
}

export default function BlogPageMoreAirportsRoute() {
  return <BlogPageMoreAirports />
}

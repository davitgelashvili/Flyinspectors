import BlogPageMorePilots from '@/views/BlogPageMore Pilots/BlogPageMorePilots'
import { buildMetadata } from '@/i18n/pageMeta'

export function generateMetadata({ params }) {
  return buildMetadata('/about-us/blog-page-more-pilots', params.lang)
}

export default function BlogPageMorePilotsRoute() {
  return <BlogPageMorePilots />
}

import BlogPageMorePets from '@/views/BlogPageMore Pets/BlogPageMorePets'
import { buildMetadata } from '@/i18n/pageMeta'

export function generateMetadata({ params }) {
  return buildMetadata('/about-us/blog-page-more-pets', params.lang)
}

export default function BlogPageMorePetsRoute() {
  return <BlogPageMorePets />
}

import Main from '@/views/Main/Main'
import { buildMetadata } from '@/i18n/pageMeta'

export function generateMetadata({ params }) {
  return buildMetadata('/', params.lang)
}

export default function HomePage({ params }) {
  return <Main lang={params.lang} />
}

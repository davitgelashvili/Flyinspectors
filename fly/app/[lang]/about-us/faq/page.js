import FaqPage from '@/views/FAQ page/FaqPage'
import { buildMetadata } from '@/i18n/pageMeta'

export function generateMetadata({ params }) {
  return buildMetadata('/about-us/faq', params.lang)
}

export default function FaqRoute() {
  return <FaqPage />
}

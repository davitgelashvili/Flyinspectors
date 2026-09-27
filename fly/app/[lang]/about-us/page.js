import AboutUs from '@/views/About Us/AboutUs'
import { buildMetadata } from '@/i18n/pageMeta'

export function generateMetadata({ params }) {
  return buildMetadata('/about-us', params.lang)
}

export default function AboutUsPage({ params }) {
  return <AboutUs lang={params.lang} />
}

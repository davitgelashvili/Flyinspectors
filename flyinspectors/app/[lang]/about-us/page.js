import AboutUs from '@/views/About Us/AboutUs'
import { buildMetadata } from '@/i18n/pageMeta'
import { WebPageJsonLd } from '@/seo/PageJsonLd'

export function generateMetadata({ params }) {
  return buildMetadata('/about-us', params.lang)
}

export default function AboutUsPage({ params }) {
  return (
    <>
      <WebPageJsonLd type="AboutPage" path="/about-us" lang={params.lang} />
      <AboutUs lang={params.lang} />
    </>
  )
}

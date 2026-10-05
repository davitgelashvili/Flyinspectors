import ContactUs from '@/views/Contact Us/ContactUs'
import { buildMetadata } from '@/i18n/pageMeta'
import { WebPageJsonLd } from '@/seo/PageJsonLd'

export function generateMetadata({ params }) {
  return buildMetadata('/contact-us', params.lang)
}

export default function ContactUsPage({ params }) {
  return (
    <>
      <WebPageJsonLd type="ContactPage" path="/contact-us" lang={params.lang} />
      <ContactUs lang={params.lang} />
    </>
  )
}

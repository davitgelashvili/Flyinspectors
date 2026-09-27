import ContactUs from '@/views/Contact Us/ContactUs'
import { buildMetadata } from '@/i18n/pageMeta'

export function generateMetadata({ params }) {
  return buildMetadata('/contact-us', params.lang)
}

export default function ContactUsPage() {
  return <ContactUs />
}

import TermsAndConditions from '@/views/TermsAndConditions/TermsAndConditions'
import { buildMetadata } from '@/i18n/pageMeta'

export function generateMetadata({ params }) {
  return buildMetadata('/terms-and-conditions', params.lang)
}

export default function TermsAndConditionsPage({ params }) {
  return <TermsAndConditions lang={params.lang} />
}

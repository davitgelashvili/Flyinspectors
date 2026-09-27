import CheckStatus from '@/views/CheckStatus/CheckStatus'
import { buildMetadata } from '@/i18n/pageMeta'

export function generateMetadata({ params }) {
  return buildMetadata('/check-status', params.lang)
}

export default function CheckStatusPage() {
  return <CheckStatus />
}

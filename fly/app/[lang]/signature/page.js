import SignaturePage from '@/views/Signature/Signature'
import { buildMetadata } from '@/i18n/pageMeta'

export function generateMetadata({ params }) {
  return buildMetadata('/signature', params.lang)
}

export default function SignatureRoute() {
  return <SignaturePage />
}

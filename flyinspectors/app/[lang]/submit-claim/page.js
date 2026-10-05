import { Suspense } from 'react'
import SubmitClaim from '@/views/SubmitClaim/SubmitClaim'
import { buildMetadata } from '@/i18n/pageMeta'

export function generateMetadata({ params }) {
  return buildMetadata('/submit-claim', params.lang)
}

export default function SubmitClaimPage({ params }) {
  return (
    <Suspense>
      <SubmitClaim lang={params.lang} />
    </Suspense>
  )
}

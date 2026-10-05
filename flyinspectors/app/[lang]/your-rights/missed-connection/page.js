import MissedConnection from '@/views/MissedConnection/MissedConnection'
import { buildMetadata } from '@/i18n/pageMeta'

export function generateMetadata({ params }) {
  return buildMetadata('/your-rights/missed-connection', params.lang)
}

export default function MissedConnectionPage() {
  return <MissedConnection />
}

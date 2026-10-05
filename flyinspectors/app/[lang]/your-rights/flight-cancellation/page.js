import FlightCancellation from '@/views/FlightCancellation/FlightCancellation'
import { buildMetadata } from '@/i18n/pageMeta'

export function generateMetadata({ params }) {
  return buildMetadata('/your-rights/flight-cancellation', params.lang)
}

export default function FlightCancellationPage() {
  return <FlightCancellation />
}

import FlightDelay from '@/views/FlightDelay/FlightDelay'
import { buildMetadata } from '@/i18n/pageMeta'

export function generateMetadata({ params }) {
  return buildMetadata('/your-rights/flight-delay', params.lang)
}

export default function FlightDelayPage() {
  return <FlightDelay />
}

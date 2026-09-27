import OverBooked from '@/views/OverBookedFlight/OverBooked'
import { buildMetadata } from '@/i18n/pageMeta'

export function generateMetadata({ params }) {
  return buildMetadata('/your-rights/overbooked-flight', params.lang)
}

export default function OverBookedFlightPage() {
  return <OverBooked />
}

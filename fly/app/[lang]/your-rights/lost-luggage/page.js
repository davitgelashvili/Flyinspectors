import LostLuggage from '@/views/LostLuggage/LostLuggage'
import { buildMetadata } from '@/i18n/pageMeta'

export function generateMetadata({ params }) {
  return buildMetadata('/your-rights/lost-luggage', params.lang)
}

export default function LostLuggagePage() {
  return <LostLuggage />
}

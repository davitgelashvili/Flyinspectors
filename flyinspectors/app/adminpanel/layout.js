import RootShell from '../RootShell'
import { baseMetadata, NOINDEX_ROBOTS } from '../baseMetadata'

// ადმინი ძიებაში არ უნდა ჩანდეს
export function generateMetadata() {
  return { ...baseMetadata(), robots: NOINDEX_ROBOTS }
}

// ადმინს საკუთარი root layout აქვს (საიტისგან დამოუკიდებელი) და საკუთარი გარსი
// (Sidebar) — საჯარო Header/Footer არ სჭირდება. ადმინის ინტერფეისი ქართულია.
export default function AdminLayout({ children }) {
  return <RootShell lang="ka">{children}</RootShell>
}

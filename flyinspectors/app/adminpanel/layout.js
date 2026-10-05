import RootShell from '../RootShell'
import { baseMetadata } from '../baseMetadata'

export const metadata = baseMetadata

// ადმინს საკუთარი root layout აქვს (საიტისგან დამოუკიდებელი) და საკუთარი გარსი
// (Sidebar) — საჯარო Header/Footer არ სჭირდება. ადმინის ინტერფეისი ქართულია.
export default function AdminLayout({ children }) {
  return <RootShell lang="ka">{children}</RootShell>
}

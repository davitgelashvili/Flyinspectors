'use client'

import { usePathname } from 'next/navigation'
import { localeFromPath } from './locales'

export default function useLocale() {
  return localeFromPath(usePathname())
}

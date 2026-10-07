'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/utils/metaPixel'

// PageView ყოველ გვერდზე: პიქსელიც და CAPI-ც ერთი event_id-ით (src/utils/metaPixel.js).
// RootShell-ის inline სკრიპტი მხოლოდ fbq('init')-ს აკეთებს — PageView აქედან მიდის,
// თორემ სერვერულ მოვლენასთან დასაწყვილებელი event_id არ იქნებოდა.
// pathname-ზეა მიბმული, რომ SPA-ს გადასვლაც ჩაითვალოს (სრული URL ბრაუზერიდან იკითხება).
export default function MetaPageView() {
  const pathname = usePathname()

  useEffect(() => {
    trackPageView()
  }, [pathname])

  return null
}

'use client'

import NextLink from 'next/link'
import useLocale from '@/i18n/useLocale'

export default function LocaleLink({ href, ...props }) {
  const locale = useLocale()
  const localized =
    typeof href === 'string' && href.startsWith('/')
      ? `/${locale}${href === '/' ? '' : href}`
      : href

  return <NextLink href={localized} {...props} />
}

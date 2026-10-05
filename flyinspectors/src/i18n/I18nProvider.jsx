'use client'

import i18n from './i18n'

export default function I18nProvider({ lang, children }) {
  if (lang && i18n.language !== lang) i18n.changeLanguage(lang)
  return children
}

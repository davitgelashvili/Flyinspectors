import { LOCALES, DEFAULT_LOCALE } from '@/i18n/locales'
import I18nProvider from '@/i18n/I18nProvider'
import Header from '@/components/Common/Header/Header'
import Footer from '@/components/Common/Footer/Footer'
import RootShell from '../RootShell'
import { baseMetadata } from '../baseMetadata'

const SITE_META = {
  en: {
    title: 'Flight compensation of up to 600 euros - Flyinspectors',
    description:
      'Get flight compensation of up to 600 euros in case of flight delay, cancellation, missed connection, denied boarding, lost or damaged luggage.',
    image: 'https://res.cloudinary.com/dluqxr8lw/image/upload/v1734813470/meta_en_zr0fxe.jpg',
    ogLocale: 'en_US',
  },
  ka: {
    title: 'ფრენის კომპენსაცია 600 ევრომდე - Flyinspectors',
    description:
      'მიიღეთ ფრენის კომპენსაცია, დაგვიანებული, გადადებული, დამაკავშირებელი რეისის გამოტოვების, ბარგის დაზიანება დაკარგვის შემთხვევაში',
    image: 'https://res.cloudinary.com/dluqxr8lw/image/upload/v1734813470/meta_ka_sj6vvs.jpg',
    ogLocale: 'ka_GE',
  },
}

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export function generateMetadata({ params }) {
  const meta = SITE_META[params.lang] || SITE_META[DEFAULT_LOCALE]
  return {
    ...baseMetadata,
    title: meta.title,
    description: meta.description,
    openGraph: {
      type: 'website',
      locale: meta.ogLocale,
      title: meta.title,
      description: meta.description,
      images: [meta.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [meta.image],
    },
  }
}

// Root layout: <html> აქ არის, რომ lang სერვერზე მოთხოვნილი ენით იხატებოდეს.
// უცნობი ენა (/xx/...) ნაგულისხმევზე ეცემა და არავალიდურ lang-ს არ ვწერთ.
export default function LangLayout({ children, params }) {
  const lang = LOCALES.includes(params.lang) ? params.lang : DEFAULT_LOCALE

  return (
    <RootShell lang={lang}>
      <I18nProvider lang={params.lang}>
        <div className="site-shell">
          <Header />
          {children}
          <Footer lang={lang} />
        </div>
      </I18nProvider>
    </RootShell>
  )
}

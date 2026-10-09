import { LOCALES, DEFAULT_LOCALE } from '@/i18n/locales'
import I18nProvider from '@/i18n/I18nProvider'
import Header from '@/components/Common/Header/Header'
import Footer from '@/components/Common/Footer/Footer'
import RootShell from '../RootShell'
import { getOffices, getPages } from '@/api/serverApi'
import { getGlobalOgImage, getGlobalOgImageAlt } from '@/i18n/pageMeta'
import { cloudinarySocialImage } from '@/utils/cloudinary'
import { headerMenuItems } from '@/utils/pageMenu'
import { JsonLd, organizationSchema, websiteSchema } from '@/seo/jsonLd'
import { baseMetadata, INDEX_ROBOTS } from '../baseMetadata'

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

export async function generateMetadata({ params }) {
  const meta = SITE_META[params.lang] || SITE_META[DEFAULT_LOCALE]
  // ადმინში მითითებული გლობალური ფოტო ჯობია ქვემოთ ჩაწერილ ნაგულისხმევს
  const custom = await getGlobalOgImage(params.lang)
  // og:image-ს f_auto არ ეძლევა — სოც. ქსელების crawler-ებს კონკრეტული JPEG სჭირდებათ.
  // alt მხოლოდ ადმინის ფოტოს აქვს; ჩაწერილ ნაგულისხმევს — არა.
  const alt = custom ? await getGlobalOgImageAlt(params.lang) : ''
  const images = [{ url: cloudinarySocialImage(custom || meta.image), ...(alt && { alt }) }]
  return {
    ...baseMetadata(),
    robots: INDEX_ROBOTS,
    title: meta.title,
    description: meta.description,
    openGraph: {
      type: 'website',
      locale: meta.ogLocale,
      title: meta.title,
      description: meta.description,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images,
    },
  }
}

// Root layout: <html> აქ არის, რომ lang სერვერზე მოთხოვნილი ენით იხატებოდეს.
// უცნობი ენა (/xx/...) ნაგულისხმევზე ეცემა და არავალიდურ lang-ს არ ვწერთ.
export default async function LangLayout({ children, params }) {
  const lang = LOCALES.includes(params.lang) ? params.lang : DEFAULT_LOCALE
  // ჰედერის ჩამოსაშლელებს ადმინიდან შექმნილი გვერდებიც ემატება. სიას აქ (სერვერზე) ვკითხულობთ
  // და Header-ს პროპად ვაძლევთ: ბმულები მზა HTML-შია, ანუ Google-ი მათ ხედავს და მენიუ არ ახამხამებს.
  const [offices, pages] = await Promise.all([getOffices(), getPages()])
  const menuPages = {
    rights: headerMenuItems(pages, lang, 'rights'),
    about: headerMenuItems(pages, lang, 'about'),
  }

  return (
    <RootShell lang={lang}>
      <I18nProvider lang={params.lang}>
        <JsonLd data={{ '@graph': [organizationSchema(offices?.offices, lang), websiteSchema()] }} />
        <div className="site-shell">
          <Header menuPages={menuPages} />
          {children}
          <Footer lang={lang} />
        </div>
      </I18nProvider>
    </RootShell>
  )
}

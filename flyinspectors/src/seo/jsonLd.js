// schema.org (JSON-LD) სქემები: Organization, WebSite, AboutPage, ContactPage, BlogPosting.
// ყველა სქემა ერთმანეთს @id-ით უკავშირდება (გვერდი → WebSite → Organization).
// მისამართები მოთხოვნის დომენისაა (app/siteHost.js) — canonical-თან ერთნაირი.
import { getSiteOrigin } from '../../app/siteHost'
import { LOCALES } from '@/i18n/locales'
import { normalizeOffices } from '@/components/Offices/officeUtils'
import MainLogo from '@/components/Images/MainLogo.png'

const orgId = () => `${getSiteOrigin()}/#organization`
const websiteId = () => `${getSiteOrigin()}/#website`

const SITE_NAME = 'Flyinspectors'
const CONTACT_EMAIL = 'team@flyinspectors.com'
// მხოლოდ რეალური პროფილის ბმულები (WhatsApp/Viber ჩატის ბმულებია, პროფილი არა)
const SAME_AS = ['https://www.facebook.com/FlyinspectorsEng']

const logoUrl = () => {
  const src = MainLogo.src || MainLogo
  return src.startsWith('http') ? src : `${getSiteOrigin()}${src}`
}

export const pageUrl = (path, locale) =>
  `${getSiteOrigin()}/${locale}${path === '/' ? '' : path}`

// ბაზიდან მოსული ოფისები (ადმინი → საკონტაქტო) → Organization-ის კონტაქტები და მისამართები
export function organizationSchema(offices, locale) {
  const items = normalizeOffices(offices, locale)
  const withAddress = items.filter((o) => o.address)
  const email = items.find((o) => o.email)?.email || CONTACT_EMAIL
  const contacts = items
    .filter((o) => o.phone || o.email)
    .map((o) => ({
      '@type': 'ContactPoint',
      contactType: 'customer support',
      ...(o.country && { areaServed: o.country }),
      ...(o.phone && { telephone: o.phone }),
      ...(o.email && { email: o.email }),
      availableLanguage: LOCALES,
    }))

  return {
    '@type': 'Organization',
    '@id': orgId(),
    name: SITE_NAME,
    url: getSiteOrigin(),
    sameAs: SAME_AS,
    email,
    logo: {
      '@type': 'ImageObject',
      '@id': `${getSiteOrigin()}/#logo`,
      url: logoUrl(),
      contentUrl: logoUrl(),
      caption: SITE_NAME,
    },
    ...(withAddress.length && {
      location: withAddress.map((o) => ({
        '@type': 'Place',
        ...(o.country && { name: o.country }),
        address: { '@type': 'PostalAddress', streetAddress: o.address, ...(o.country && { addressCountry: o.country }) },
        ...(o.phone && { telephone: o.phone }),
      })),
    }),
    ...(contacts.length && { contactPoint: contacts }),
  }
}

// საძიებო ველი საიტზე არ არის, ამიტომ SearchAction (potentialAction) განზრახ არ ვწერთ
export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': websiteId(),
    url: getSiteOrigin(),
    name: SITE_NAME,
    publisher: { '@id': orgId() },
    inLanguage: LOCALES,
  }
}

const dates = ({ datePublished, dateModified }) => ({
  ...(datePublished && { datePublished: new Date(datePublished).toISOString() }),
  ...(dateModified && { dateModified: new Date(dateModified).toISOString() }),
})

const image = (url) => (url ? { '@type': 'ImageObject', url } : undefined)

// type: 'AboutPage' | 'ContactPage'
export function webPageSchema({ type, path, locale, name, description, imageUrl, ...rest }) {
  const url = pageUrl(path, locale)
  return {
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    ...(name && { name }),
    ...(description && { description }),
    ...dates(rest),
    isPartOf: { '@id': websiteId() },
    ...(imageUrl && { primaryImageOfPage: image(imageUrl) }),
    ...(type === 'ContactPage' && { mainEntity: { '@id': orgId() } }),
    inLanguage: locale,
  }
}

export function articleSchema({ path, locale, headline, description, imageUrl, ...rest }) {
  const url = pageUrl(path, locale)
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline,
    name: headline,
    ...(description && { description }),
    ...dates(rest),
    author: { '@id': orgId() },
    publisher: { '@id': orgId() },
    isPartOf: { '@id': websiteId() },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(imageUrl && { image: image(imageUrl) }),
    inLanguage: locale,
  }
}

// "<" ვაესკეიპებთ, რომ ტექსტმა <script> ვერ დახუროს
export function JsonLd({ data }) {
  const json = JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(/</g, '\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}

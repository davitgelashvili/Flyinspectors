import { getMeta } from '@/api/serverApi'
import { LOCALES, DEFAULT_LOCALE, X_DEFAULT_LOCALE } from './locales'
import { META_PAGES, GLOBAL_OG_PATH, NOINDEX_PATHS } from './metaPages'
import { NOINDEX_ROBOTS } from '../../app/baseMetadata'
import { cloudinarySocialImage } from '@/utils/cloudinary'

const OG_IMAGE = {
  en: 'https://res.cloudinary.com/dluqxr8lw/image/upload/v1734813470/meta_en_zr0fxe.jpg',
  ka: 'https://res.cloudinary.com/dluqxr8lw/image/upload/v1734813470/meta_ka_sj6vvs.jpg',
}

const OG_LOCALE = { en: 'en_US', ka: 'ka_GE' }

export const PAGE_META = {
  '/about-us': {
    en: {
      title: 'About Us — Flyinspectors',
      description: 'Flyinspectors helps air passengers claim the compensation they are entitled to under EU Regulation EC 261.',
    },
    ka: {
      title: 'ჩვენს შესახებ — Flyinspectors',
      description: 'Flyinspectors ეხმარება მგზავრებს მიიღონ კომპენსაცია, რომელიც ევროკავშირის რეგულაცია EC 261-ით ეკუთვნით.',
    },
  },
}

// გვერდები, რომელთა ტექსტი ბაზიდანაა (ადმინი → მეტა თეგები). დანარჩენი ჯერ ზემოთ PAGE_META-შია.
const DB_PATHS = new Set(META_PAGES.map((page) => page.path))
const HOME_PATH = '/'

// ბაზიდან: ტექსტი ამ გვერდის ჩანაწერიდან; ფოტო — გვერდისა, თუ ცარიელია — გლობალური, მერე მთავარი გვერდისა.
// ყველა გვერდის მეტა ერთი მოთხოვნითაა (იკეშება და ადმინში შენახვისას მყისიერად ახლდება).
async function metaFromDb(path, locale) {
  const all = await getMeta()
  const list = Array.isArray(all) ? all : []
  const page = list.find((m) => m.path === path)
  const home = list.find((m) => m.path === HOME_PATH)
  const global = list.find((m) => m.path === GLOBAL_OG_PATH)
  const pick = (record, field) => record?.[field]?.[locale]?.trim() || ''

  // ფოტო და მისი alt ერთი ჩანაწერიდან უნდა მოვიდეს: გლობალური ფოტოს შემთხვევაში
  // გვერდის alt-ს აზრი აღარ აქვს
  const from = [page, global, home].find((record) => pick(record, 'image'))

  return {
    title: pick(page, 'title'),
    description: pick(page, 'description'),
    image: pick(from, 'image'),
    imageAlt: pick(from, 'imageAlt'),
  }
}

function localePath(path, locale) {
  return `/${locale}${path === '/' ? '' : path}`
}

// ადმინში მითითებული გლობალური გაზიარების ფოტოს ჩანაწერი
async function globalOgRecord(lang) {
  const locale = LOCALES.includes(lang) ? lang : DEFAULT_LOCALE
  const all = await getMeta()
  const record = (Array.isArray(all) ? all : []).find((m) => m.path === GLOBAL_OG_PATH)
  return {
    image: record?.image?.[locale]?.trim() || '',
    alt: record?.imageAlt?.[locale]?.trim() || '',
  }
}

// ადმინში მითითებული გლობალური გაზიარების ფოტო (ცარიელია → '')
export async function getGlobalOgImage(lang) {
  return (await globalOgRecord(lang)).image
}

// იმავე ფოტოს აღწერა — og:image:alt-ისთვის (ცარიელია → '')
export async function getGlobalOgImageAlt(lang) {
  return (await globalOgRecord(lang)).alt
}

// გვერდის სათაური, აღწერა და ფოტო (ბაზიდან ან PAGE_META-დან) — მეტა ტეგებისთვისაც და schema.org-ისთვისაც
export async function getPageSeo(path, lang) {
  const locale = LOCALES.includes(lang) ? lang : DEFAULT_LOCALE
  if (DB_PATHS.has(path)) return { locale, meta: await metaFromDb(path, locale) }

  const fixed = PAGE_META[path]?.[locale] ?? PAGE_META[path]?.[DEFAULT_LOCALE]
  if (!fixed) return { locale, meta: null }

  // alt მხოლოდ ადმინის გლობალურ ფოტოს აქვს; ქვემოთ ჩაწერილ ნაგულისხმევს — არა
  const { image, alt } = await globalOgRecord(locale)
  return {
    locale,
    meta: { ...fixed, image: image || OG_IMAGE[locale], imageAlt: image ? alt : '' },
  }
}

export async function buildMetadata(path, lang) {
  const { locale, meta } = await getPageSeo(path, lang)

  // ტექსტის გარეშეც (ჯერ შეუვსებელი ან კოდიდან ამოღებული გვერდი) canonical, hreflang და
  // og:url აუცილებლად უნდა გამოიცეს — ისინი მისამართიდან გამომდინარეობს და ტექსტზე არ არიან
  // დამოკიდებული. ადრე ასეთი გვერდი ამ სიგნალების გარეშე რჩებოდა და Google-ს დომენებს შორის
  // დუბლი ეჩვენებოდა. სათაური კი layout-ის ნაგულისხმევზე ეცემა.
  const url = localePath(path, locale)
  const languages = Object.fromEntries(LOCALES.map((l) => [l, localePath(path, l)]))
  // og:image-ს f_auto არ ეძლევა (cloudinarySocialImage): სოც. ქსელების crawler-ები
  // Accept ჰედერს სანდოდ არ აგზავნიან და WebP-ის ბარათი ზოგჯერ ცარიელი გამოდის
  const images = meta?.image
    ? [{ url: cloudinarySocialImage(meta.image), ...(meta.imageAlt && { alt: meta.imageAlt }) }]
    : undefined

  // ცარიელ ველს არ ვაგზავნით: ფოტოს გარეშე ბარათი "summary" უნდა იყოს და სათაურის გარეშე
  // გვერდს layout-ის ნაგულისხმევი სათაური დარჩება
  const text = {
    ...(meta?.title && { title: meta.title }),
    ...(meta?.description && { description: meta.description }),
  }

  return {
    ...text,
    ...(NOINDEX_PATHS.has(path) && { robots: NOINDEX_ROBOTS }),
    alternates: {
      canonical: url,
      languages: { ...languages, 'x-default': localePath(path, X_DEFAULT_LOCALE) },
    },
    openGraph: {
      type: 'website',
      url,
      locale: OG_LOCALE[locale],
      siteName: 'Flyinspectors',
      ...text,
      ...(images && { images }),
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      ...text,
      ...(images && { images }),
    },
  }
}

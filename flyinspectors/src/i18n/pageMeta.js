import { getMeta } from '@/api/serverApi'
import { LOCALES, DEFAULT_LOCALE, X_DEFAULT_LOCALE } from './locales'
import { META_PAGES, GLOBAL_OG_PATH } from './metaPages'

const OG_IMAGE = {
  en: 'https://res.cloudinary.com/dluqxr8lw/image/upload/v1734813470/meta_en_zr0fxe.jpg',
  ka: 'https://res.cloudinary.com/dluqxr8lw/image/upload/v1734813470/meta_ka_sj6vvs.jpg',
}

const OG_LOCALE = { en: 'en_US', ka: 'ka_GE' }

export const PAGE_META = {
  '/submit-claim': {
    en: {
      title: 'Submit a Claim — Flyinspectors',
      description: 'Fill in the compensation claim form and our experts will handle the paperwork and present your complaint to the airline. Claims up to 6 years back.',
    },
    ka: {
      title: 'შეავსეთ განაცხადი — Flyinspectors',
      description: 'შეავსეთ კომპენსაციის განაცხადი — დანარჩენს Flyinspectors გააკეთებს. განაცხადის შეტანა 6 წლის წინანდელ რეისზეც შეიძლება.',
    },
  },
  '/check-status': {
    en: {
      title: 'Check Your Claim Status — Flyinspectors',
      description: 'Enter the application number sent to your email to track the status of your flight compensation claim.',
    },
    ka: {
      title: 'შეამოწმეთ განაცხადის სტატუსი — Flyinspectors',
      description: 'შეიყვანეთ განაცხადის ნომერი, რომელიც ელ.ფოსტაზე მიიღეთ, და გაეცანით კომპენსაციის განაცხადის მიმდინარე სტატუსს.',
    },
  },
  '/signature': {
    en: {
      title: 'Electronic Signature — Flyinspectors',
      description: 'Sign your flight compensation claim electronically.',
    },
    ka: {
      title: 'ელექტრონული ხელმოწერა — Flyinspectors',
      description: 'ხელი მოაწერეთ ფრენის კომპენსაციის განაცხადს ელექტრონულად.',
    },
  },
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
  '/about-us/blog': {
    en: {
      title: 'Blog — Flyinspectors',
      description: 'Articles about air passenger rights, flight cancellations and delays, airports and travel tips.',
    },
    ka: {
      title: 'ბლოგი — Flyinspectors',
      description: 'სტატიები მგზავრთა უფლებების, ფრენის გაუქმებისა და დაგვიანების, აეროპორტებისა და მოგზაურობის შესახებ.',
    },
  },
  '/about-us/blog-page-more': {
    en: {
      title: 'The most common reasons why flights get cancelled — Flyinspectors',
      description: 'Bad weather, mechanical issues, lack of aircraft or passengers — why airlines cancel flights and what it means for your rights.',
    },
    ka: {
      title: 'ფრენების გაუქმების ყველაზე გავრცელებული მიზეზები — Flyinspectors',
      description: 'ამინდი, ტექნიკური ხარვეზი, თვითმფრინავის ან მგზავრების ნაკლებობა — რატომ უქმდება რეისები და რას ნიშნავს ეს თქვენი უფლებებისთვის.',
    },
  },
  '/about-us/blog-page-more-airports': {
    en: {
      title: 'Airports that you may never want to leave — Flyinspectors',
      description: 'A look at the most comfortable airports in the world, where waiting for a flight becomes part of the journey.',
    },
    ka: {
      title: 'აეროპორტები, რომელთა დატოვებაც არ მოგინდებათ — Flyinspectors',
      description: 'მსოფლიოს ყველაზე კომფორტული აეროპორტები, სადაც რეისის ლოდინი მოგზაურობის ნაწილად იქცევა.',
    },
  },
  '/about-us/blog-page-more-pets': {
    en: {
      title: 'Travelling with pets — Flyinspectors',
      description: 'Vaccination requirements, carrier rules and tips to avoid problems when flying with your pet.',
    },
    ka: {
      title: 'მოგზაურობა ცხოველებთან ერთად — Flyinspectors',
      description: 'ვაქცინაციის მოთხოვნები, გადაყვანის წესები და რჩევები, რომ ფრენისას პრობლემები აარიდოთ თავი.',
    },
  },
  '/about-us/blog-page-more-pilots': {
    en: {
      title: 'What we know about pilots — Flyinspectors',
      description: 'Aviation shapes the modern world, but how much do we really know about the people who fly the aircraft?',
    },
    ka: {
      title: 'რა ვიცით პილოტების შესახებ — Flyinspectors',
      description: 'ავიაცია თანამედროვე სამყაროს ქმნის, მაგრამ რამდენად ვიცნობთ ადამიანებს, რომლებიც თვითმფრინავს მართავენ?',
    },
  },
  '/your-rights/flight-delay': {
    en: {
      title: 'Flight Delay Compensation up to €600 — Flyinspectors',
      description: 'If your flight is delayed by 3 hours or more, EU Regulation EC 261 may entitle you to up to €600 in compensation.',
    },
    ka: {
      title: 'დაგვიანებული ფრენის კომპენსაცია 600 ევრომდე — Flyinspectors',
      description: 'თუ თქვენი რეისი 3 საათით ან მეტით დაგვიანდა, ევროკავშირის რეგულაცია EC 261-ით 600 ევრომდე კომპენსაცია შეიძლება გეკუთვნოდეთ.',
    },
  },
  '/your-rights/flight-cancellation': {
    en: {
      title: 'Flight Cancellation Compensation up to €600 — Flyinspectors',
      description: 'A flight cancelled without at least 14 days notice may entitle you to up to €600 under EU Regulation EC 261.',
    },
    ka: {
      title: 'გაუქმებული ფრენის კომპენსაცია 600 ევრომდე — Flyinspectors',
      description: 'თუ რეისი სულ მცირე 14 დღით ადრე არ გაუქმდა, ევროკავშირის რეგულაცია EC 261-ით 600 ევრომდე კომპენსაცია შეიძლება გეკუთვნოდეთ.',
    },
  },
  '/your-rights/lost-luggage': {
    en: {
      title: 'Lost or Damaged Luggage Compensation — Flyinspectors',
      description: 'If your checked baggage arrived late, damaged or never arrived at all, you may be entitled to compensation.',
    },
    ka: {
      title: 'დაკარგული ან დაზიანებული ბარგის კომპენსაცია — Flyinspectors',
      description: 'თუ ჩაბარებული ბარგი დაგვიანდა, დაზიანდა ან საერთოდ არ ჩამოვიდა, შესაძლოა კომპენსაცია გეკუთვნოდეთ.',
    },
  },
  '/your-rights/missed-connection': {
    en: {
      title: 'Missed Connection Compensation — Flyinspectors',
      description: 'Missed your connecting flight because of a delay? EU Regulation EC 261 may entitle you to up to €600.',
    },
    ka: {
      title: 'დამაკავშირებელი ფრენის კომპენსაცია — Flyinspectors',
      description: 'გამოტოვეთ დამაკავშირებელი რეისი დაგვიანების გამო? EC 261-ით 600 ევრომდე კომპენსაცია შეიძლება გეკუთვნოდეთ.',
    },
  },
  '/your-rights/overbooked-flight': {
    en: {
      title: 'Overbooked Flight Compensation — Flyinspectors',
      description: 'You have a ticket but your seat is already taken? EU Regulation EC 261 provides up to €600 for denied boarding.',
    },
    ka: {
      title: 'გადაჯავშნილი ფრენის კომპენსაცია — Flyinspectors',
      description: 'გაქვთ ბილეთი, მაგრამ ადგილი დაკავებულია? EC 261-ით ჩასხდომაზე უარის შემთხვევაში 600 ევრომდე კომპენსაცია გეკუთვნით.',
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

  return {
    title: pick(page, 'title'),
    description: pick(page, 'description'),
    image: pick(page, 'image') || pick(global, 'image') || pick(home, 'image'),
  }
}

function localePath(path, locale) {
  return `/${locale}${path === '/' ? '' : path}`
}

// ადმინში მითითებული გლობალური გაზიარების ფოტო (ცარიელია → '')
export async function getGlobalOgImage(lang) {
  const locale = LOCALES.includes(lang) ? lang : DEFAULT_LOCALE
  const all = await getMeta()
  const record = (Array.isArray(all) ? all : []).find((m) => m.path === GLOBAL_OG_PATH)
  return record?.image?.[locale]?.trim() || ''
}

// გვერდის სათაური, აღწერა და ფოტო (ბაზიდან ან PAGE_META-დან) — მეტა ტეგებისთვისაც და schema.org-ისთვისაც
export async function getPageSeo(path, lang) {
  const locale = LOCALES.includes(lang) ? lang : DEFAULT_LOCALE
  if (DB_PATHS.has(path)) return { locale, meta: await metaFromDb(path, locale) }

  const fixed = PAGE_META[path]?.[locale] ?? PAGE_META[path]?.[DEFAULT_LOCALE]
  if (!fixed) return { locale, meta: null }
  return { locale, meta: { ...fixed, image: (await getGlobalOgImage(locale)) || OG_IMAGE[locale] } }
}

export async function buildMetadata(path, lang) {
  const { locale, meta } = await getPageSeo(path, lang)
  if (!meta) return {}

  const url = localePath(path, locale)
  const languages = Object.fromEntries(LOCALES.map((l) => [l, localePath(path, l)]))
  const images = meta.image ? [meta.image] : undefined

  // ცარიელ ველს არ ვაგზავნით: ფოტოს გარეშე ბარათი "summary" უნდა იყოს და სათაურის გარეშე
  // გვერდს layout-ის ნაგულისხმევი სათაური დარჩება
  const text = {
    ...(meta.title && { title: meta.title }),
    ...(meta.description && { description: meta.description }),
  }

  return {
    ...text,
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

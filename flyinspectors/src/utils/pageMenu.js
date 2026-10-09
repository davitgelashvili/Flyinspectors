import { DEFAULT_LOCALE } from '@/i18n/locales'

// ადმინიდან შექმნილი გვერდების მენიუში განლაგება — ერთი წყარო ჰედერისთვისაც და ფუტერისთვისაც.
// არჩევანი თვით გვერდზეა (ადმინი → გვერდის შექმნა → მენიუ); სქემა server/jsonModels/pageModal.js.

// ჰედერის ჩამოსაშლელები. ზედა დონე განზრახ არ ირჩევა: ჰედერში უკვე 4 პუნქტი,
// ენის გადამრთველი და "შეავსე განაცხადი" ღილაკია და მეტი განლაგებას ამტვრევს.
export const HEADER_SLOTS = [
    { value: 'none', label: 'არსად' },
    { value: 'rights', label: '„თქვენი უფლებები"-ს ქვეშ' },
    { value: 'about', label: '„ჩვენს შესახებ"-ის ქვეშ' },
]

// ფუტერის სექციები. პირველი (მთავარი, განაცხადი, სტატუსი, ხდკ) არ ირჩევა —
// ის მხოლოდ საიტის ძირითად ნაბიჯებს ინახავს.
export const FOOTER_SLOTS = [
    { value: 'none', label: 'არსად' },
    { value: 'second', label: 'მეორე სექცია (ჩვენს შესახებ, ბლოგი, კონტაქტი)' },
    { value: 'third', label: 'მესამე სექცია (გვერდების სვეტი)' },
]

// ძველ ჩანაწერს menu ველი არ აქვს — ვარდება იმავე ქცევაზე, რაც აქამდე იყო
export const headerSlot = (page) => page?.menu?.header || 'none'
export const footerSlot = (page) => page?.menu?.footer || 'third'

// გამოქვეყნებული გვერდები მენიუს რიგით: menuOrder, შემდეგ შექმნის რიგი (ძველი → ახალი).
// ბექი ახალი → ძველი რიგით აბრუნებს, ამიტომ ჯერ ვაბრუნებთ — ასე ახალი გვერდი
// არსებულებს ადგილს არ გადაუწყობს. sort სტაბილურია, ანუ ერთნაირ menuOrder-ზე ეს რიგი რჩება.
export function orderedPages(pages) {
    return (Array.isArray(pages) ? pages : [])
        .filter((page) => page.published !== false)
        .slice()
        .reverse()
        .sort((a, b) => (a.menuOrder || 0) - (b.menuOrder || 0))
}

const pageTitle = (page, locale) =>
    page.title?.[locale]?.trim() || page.title?.[DEFAULT_LOCALE]?.trim() || ''

// ჰედერის ჩამოსაშლელის პუნქტები: { link, title }.
// link ენის prefix-ის გარეშეა — LocaleLink მას თვითონ ამატებს და აქტიური პუნქტის
// შემოწმებაც (stripLocale) ასევე prefix-ის გარეშე ადარებს.
export function headerMenuItems(pages, locale, slot) {
    return orderedPages(pages)
        .filter((page) => headerSlot(page) === slot)
        .map((page) => ({ link: `/${page.slug}`, title: pageTitle(page, locale) }))
        .filter((item) => item.title)
}

// ფუტერის სვეტის ბმულები: { href, label }. href უკვე ენის prefix-იანია (ჩვეულებრივი next/link).
export function footerMenuLinks(pages, locale, slot, prefix) {
    return orderedPages(pages)
        .filter((page) => footerSlot(page) === slot)
        .map((page) => ({ href: `${prefix}/${page.slug}`, label: pageTitle(page, locale) }))
        .filter((link) => link.label)
}

import { DEFAULT_LOCALE } from '@/i18n/locales'

// ბლოგის მისამართები ერთ ადგილას: სია, სტატია და გვერდებად დაყოფა.
// sitemap, მენიუ, ბარათები და ადმინის პრევიუ ყველა აქედან იღებს.
export const BLOG_PATH = '/blog'

// სტატიის ტექსტი ენის მიხედვით; თარგმანის გარეშე ინგლისური ჩანს (იგივე წესი, რაც გვერდებს)
export const postText = (post, field, locale) =>
    post?.[field]?.[locale]?.trim() || post?.[field]?.[DEFAULT_LOCALE]?.trim() || ''

// სიაში ჩანს excerpt; შეუვსებლობისას მეტა აღწერა (ორივეს გარეშე — ცარიელი)
export const postSummary = (post, locale) =>
    postText(post, 'excerpt', locale) || postText(post, 'metaDescription', locale)

export const postPath = (slug) => `${BLOG_PATH}/${String(slug).toLowerCase()}`

// სიის მისამართი: პირველი გვერდი პარამეტრის გარეშე, შემდეგი — ?page=N.
// ასე /blog და /blog?page=1 ერთ URL-ად რჩება და დუბლი არ იქმნება.
export const blogPath = (page) => (page > 1 ? `${BLOG_PATH}?page=${page}` : BLOG_PATH)

export const withLocalePath = (path, locale) => `/${locale}${path}`

export function formatPostDate(date, locale) {
    if (!date) return ''
    const parsed = new Date(date)
    if (Number.isNaN(parsed.getTime())) return ''

    return new Intl.DateTimeFormat(locale === 'ka' ? 'ka-GE' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(parsed)
}

// <time datetime="2026-10-08"> — schema.org-ისთვისაც და ბრაუზერისთვისაც
export function postDateAttr(date) {
    if (!date) return undefined
    const parsed = new Date(date)
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString().slice(0, 10)
}

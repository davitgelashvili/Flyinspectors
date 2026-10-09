import { getPosts } from '@/api/serverApi'
import { LOCALES, DEFAULT_LOCALE, X_DEFAULT_LOCALE } from '@/i18n/locales'
import { buildMetadata } from '@/i18n/pageMeta'
import { BLOG_PATH, blogPath, withLocalePath } from '@/utils/post'
import BlogList from '@/views/Blog/BlogList'
import content from '@/views/Blog/Blog.content'

// ერთ გვერდზე სტატიების რაოდენობა. ბექიც ამდენს აბრუნებს ნაგულისხმევად (controllers/posts.js).
const PER_PAGE = 9

const pickLocale = (lang) => (LOCALES.includes(lang) ? lang : DEFAULT_LOCALE)

// "?page=2" → 2; არასწორი ან პირველი გვერდი → 1
const pageFromQuery = (searchParams) => {
  const value = parseInt(searchParams?.page, 10)
  return Number.isInteger(value) && value > 1 ? value : 1
}

// სიის მეტა ტექსტი ადმინიდან მოდის (მეტა თეგები → ბლოგი).
// 2+ გვერდს სათაურსა და canonical-ს ნომერი ემატება, თორემ Google-ისთვის ყველა გვერდი დუბლი იქნებოდა.
export async function generateMetadata({ params, searchParams }) {
  const base = await buildMetadata(BLOG_PATH, params.lang)
  const page = pageFromQuery(searchParams)
  if (page === 1) return base

  const locale = pickLocale(params.lang)
  const t = content[locale] || content.en
  const path = blogPath(page)

  return {
    ...base,
    ...(base.title && { title: `${base.title} — ${t.pageSuffix} ${page}` }),
    alternates: {
      canonical: withLocalePath(path, locale),
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, withLocalePath(path, l)])),
        'x-default': withLocalePath(path, X_DEFAULT_LOCALE),
      },
    },
  }
}

export default async function BlogRoute({ params, searchParams }) {
  const locale = pickLocale(params.lang)
  const page = pageFromQuery(searchParams)
  // ბექი დიაპაზონს გარეთ გასულ გვერდს ბოლო გვერდად ითვლის, ამიტომ ცარიელი სია არ მოდის
  const { items, page: current, pages } = await getPosts({ page, limit: PER_PAGE })

  return <BlogList posts={items} page={current} pages={pages} locale={locale} />
}

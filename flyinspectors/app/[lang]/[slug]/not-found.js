import NotFound from '@/views/NotFound/NotFound'

// 404 გვერდი ღილაკებით. იმ მარშრუტებშია, სადაც notFound() გამოიძახება: [slug] და [...rest].
export default function LangNotFound() {
  return <NotFound />
}

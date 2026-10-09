// გვერდები, რომელთა მეტა ტეგები ბაზიდან იმართება (ადმინი → მეტა თეგები).
// სია ერთადერთი წყაროა: ადმინის მენიუც მას იყენებს და buildMetadata-ც (pageMeta.js).
//
// ახალი გვერდის დასამატებლად: 1) ჩაამატე აქ, 2) გვერდის route-ში buildMetadata(path, lang)
// უკვე გამოიყენება, 3) გადაიტანე მისი ტექსტი ბაზაში და წაშალე pageMeta.js-ის PAGE_META-დან.
//   slug  — ადმინის მისამართში (/adminpanel/meta/<slug>)
//   path  — საიტის მისამართი ენის გარეშე
//   label — ადმინის მენიუში
// გლობალური გაზიარების ფოტო: გვერდებისთვის, რომლებსაც საკუთარი ფოტო არ აქვთ.
// ეს ჩანაწერი მხოლოდ ფოტოს ინახავს (imageOnly) — საიტის გვერდი არ არის.
export const GLOBAL_OG_PATH = '/default-og'

// პირადი განაცხადის ნაბიჯები: sitemap-შიც არ შედის და ძიებაშიც არ უნდა ჩანდეს.
// აქ არის და არა pageMeta.js-ში, რომ ადმინის ფორმაც იმავე სიას უყურებდეს და
// ასეთ გვერდზე Google-ის პრევიუს არ აჩვენებდეს.
export const NOINDEX_PATHS = new Set(['/signature', '/check-status'])

export const META_PAGES = [
  { slug: 'home', path: '/', label: 'მთავარი გვერდი' },
  // განაცხადის ნაბიჯები: /submit-claim ინდექსირდება, /check-status — არა (NOINDEX_PATHS)
  { slug: 'submit-claim', path: '/submit-claim', label: 'განაცხადის შევსება' },
  { slug: 'check-status', path: '/check-status', label: 'სტატუსის შემოწმება' },
  { slug: 'faq', path: '/faq', label: 'ხშირად დასმული კითხვები' },
  // ბლოგის სია; თითოეული სტატიის მეტა თეგები თვით სტატიის ფორმაშია (ადმინი → ბლოგი)
  { slug: 'blog', path: '/blog', label: 'ბლოგი' },
  { slug: 'contact', path: '/contact-us', label: 'კონტაქტი' },
  { slug: 'global', path: GLOBAL_OG_PATH, label: 'გლობალური OG სურათი', imageOnly: true },
]

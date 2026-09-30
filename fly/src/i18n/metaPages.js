// გვერდები, რომელთა მეტა ტეგები ბაზიდან იმართება (ადმინი → მეტა თეგები).
// სია ერთადერთი წყაროა: ადმინის მენიუც მას იყენებს და buildMetadata-ც (pageMeta.js).
//
// ახალი გვერდის დასამატებლად: 1) ჩაამატე აქ, 2) გვერდის route-ში buildMetadata(path, lang)
// უკვე გამოიყენება, 3) გადაიტანე მისი ტექსტი ბაზაში და წაშალე pageMeta.js-ის PAGE_META-დან.
//   slug  — ადმინის მისამართში (/adminpanel/meta/<slug>)
//   path  — საიტის მისამართი ენის გარეშე
//   label — ადმინის მენიუში
export const META_PAGES = [
  { slug: 'home', path: '/', label: 'მთავარი გვერდი' },
  { slug: 'faq', path: '/about-us/faq', label: 'ხშირად დასმული კითხვები' },
  { slug: 'terms', path: '/terms-and-conditions', label: 'წესები და პირობები' },
  { slug: 'contact', path: '/contact-us', label: 'კონტაქტი' },
]

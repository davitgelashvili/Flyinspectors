// 404 გვერდის ტექსტები. პირველი ბმული მთავარი (ძირითადი) ღილაკია.
const content = {
  en: {
    title: 'Page not found',
    text: 'The page you are looking for may have been moved, deleted or never existed. Use the buttons below to get back on track.',
    nav: 'Useful pages',
    links: [
      { href: '/', label: 'Home' },
      { href: '/submit-claim', label: 'Submit a claim' },
      { href: '/check-status', label: 'Check claim status' },
      { href: '/faq', label: 'FAQ' },
      { href: '/contact-us', label: 'Contact us' },
    ],
  },
  ka: {
    title: 'გვერდი ვერ მოიძებნა',
    text: 'გვერდი, რომელსაც ეძებთ, შესაძლოა გადატანილია, წაშლილია ან საერთოდ არ არსებობს. ქვემოთ მოცემული ღილაკებით შეგიძლიათ სხვა გვერდზე გადახვიდეთ.',
    nav: 'სასარგებლო გვერდები',
    links: [
      { href: '/', label: 'მთავარი' },
      { href: '/submit-claim', label: 'განაცხადის შევსება' },
      { href: '/check-status', label: 'სტატუსის შემოწმება' },
      { href: '/faq', label: 'ხშირად დასმული კითხვები' },
      { href: '/contact-us', label: 'კონტაქტი' },
    ],
  },
}

export default content

// Sidebar-ისა და როუტინგის ერთი საერთო წყარო. ორ ადგილას რომ გვედო,
// ერთში ცვლილება მეორეში დაგვავიწყდებოდა და მენიუ აჩვენებდა გვერდს,
// რომელსაც როუტერი კრძალავს (ან პირიქით).
//
// ელემენტი ორი სახისაა:
//   { title, path, roles }        — ჩვეულებრივი პუნქტი
//   { title, children: [...] }    — ჩამოსაშლელი ჯგუფი; მისი პუნქტები ჩვეულებრივი
//                                   პუნქტებია, უფლებებს თითოეული თავისით ამოწმებს
//
// roles ზუსტად ბექენდის უფლებებს იმეორებს:
//   განაცხადები / კომპანიები / მომხმარებლები → მხოლოდ admin
//   კონტენტი                                → admin + editor
//   ჩემი მონაცემები                          → ყველა
export const SECTIONS = [
    { title: 'განაცხადები', path: '/userlist', roles: ['admin'] },
    {
        title: 'მთავარი გვერდი',
        children: [
            { title: 'მთავარი ტექსტი', path: '/hero', roles: ['admin', 'editor'] },
            { title: 'კომპენსაციის ბარათები', path: '/options', roles: ['admin', 'editor'] },
            { title: 'როგორ მუშაობს', path: '/how', roles: ['admin', 'editor'] },
            { title: 'რატომ ჩვენ', path: '/why', roles: ['admin', 'editor'] },
        ],
    },
    { title: 'გვერდები', path: '/pages', roles: ['admin', 'editor'] },
    { title: 'რეიტინგი', path: '/rate', roles: ['admin', 'editor'] },
    { title: 'საკონტაქტო', path: '/contact', roles: ['admin', 'editor'] },
    { title: 'წესები და პირობები', path: '/condition', roles: ['admin', 'editor'] },
    { title: 'კომპანიები', path: '/company', roles: ['admin'] },
    { title: 'მომხმარებლები', path: '/users', roles: ['admin'] },
    { title: 'მეილის პაროლი', path: '/mailpassword', roles: ['admin'] },
    { title: 'ჩემი მონაცემები', path: '/profile', roles: ['admin', 'editor', 'user'] },
]

// ჯგუფების გარეშე, ბრტყელი სია — უფლებებისა და საწყისი გვერდისთვის
const FLAT = SECTIONS.flatMap(s => s.children ?? [s])

/** Sidebar-ისთვის: როლისთვის ხელმისაწვდომი პუნქტები; ცარიელი ჯგუფი ქრება */
export function visibleSections(role) {
    return SECTIONS
        .map(s => s.children
            ? { ...s, children: s.children.filter(c => c.roles.includes(role)) }
            : s)
        .filter(s => s.children ? s.children.length > 0 : s.roles.includes(role))
}

/** path იწერება /adminpanel-ის გარეშე, მაგ. '/services' ან '/users/add' */
export function canAccess(path, role) {
    const section = FLAT.find(s => path === s.path || path.startsWith(`${s.path}/`))
    if (!section) return false
    return section.roles.includes(role)
}

/** სად დაეშვას შესვლისას — თითოეულ როლს პირველი ხელმისაწვდომი განყოფილება */
export function defaultPath(role) {
    return FLAT.find(s => s.roles.includes(role))?.path || '/profile'
}

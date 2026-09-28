// Sidebar-ისა და როუტინგის ერთი საერთო წყარო. ორ ადგილას რომ გვედო,
// ერთში ცვლილება მეორეში დაგვავიწყდებოდა და მენიუ აჩვენებდა გვერდს,
// რომელსაც როუტერი კრძალავს (ან პირიქით).
//
// roles ზუსტად ბექენდის უფლებებს იმეორებს:
//   განაცხადები / კომპანიები / მომხმარებლები → მხოლოდ admin
//   კონტენტი                                → admin + editor
//   ჩემი მონაცემები                          → ყველა
export const SECTIONS = [
    { title: 'განაცხადები', path: '/userlist', roles: ['admin'] },
    { title: 'გვერდები', path: '/pages', roles: ['admin', 'editor'] },
    { title: 'სერვისები', path: '/services', roles: ['admin', 'editor'] },
    { title: 'რეიტინგი', path: '/rate', roles: ['admin', 'editor'] },
    { title: 'საკონტაქტო', path: '/contact', roles: ['admin', 'editor'] },
    { title: 'წესები და პირობები', path: '/condition', roles: ['admin', 'editor'] },
    { title: 'კომპანიები', path: '/company', roles: ['admin'] },
    { title: 'მომხმარებლები', path: '/users', roles: ['admin'] },
    { title: 'მეილის პაროლი', path: '/mailpassword', roles: ['admin'] },
    { title: 'ჩემი მონაცემები', path: '/profile', roles: ['admin', 'editor', 'user'] },
]

export function visibleSections(role) {
    return SECTIONS.filter(s => s.roles.includes(role))
}

/** path იწერება /adminpanel-ის გარეშე, მაგ. '/services' ან '/users/add' */
export function canAccess(path, role) {
    const section = SECTIONS.find(s => path === s.path || path.startsWith(`${s.path}/`))
    if (!section) return false
    return section.roles.includes(role)
}

/** სად დაეშვას შესვლისას — თითოეულ როლს პირველი ხელმისაწვდომი განყოფილება */
export function defaultPath(role) {
    return visibleSections(role)[0]?.path || '/profile'
}

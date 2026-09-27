'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { visibleSections } from '../sections'
import styles from './Sidebar.module.scss'

export default function Sidebar({ onLogout, role }) {
    const pathname = usePathname()
    const sections = visibleSections(role)

    return (
        <div className={`${styles['sidebar']}`}>
            <ul className={`${styles['sidebar__menu']}`}>
                <li className={`${styles['sidebar__menu--item']} ${styles['sidebar__menu--site']}`}>
                    <Link className={`${styles['sidebar__menu--link']}`} href={'/'} target="_blank">
                        <p className={`${styles['sidebar__menu--title']}`}>საიტზე გადასვლა</p>
                    </Link>
                </li>

                {sections.map((item) => {
                    const url = `/adminpanel${item.path}`
                    const active = pathname === url || pathname.startsWith(`${url}/`)
                    return (
                        <li
                            key={item.path}
                            className={`${styles['sidebar__menu--item']} ${active ? styles['active'] : ''}`}
                        >
                            <Link className={`${styles['sidebar__menu--link']}`} href={url}>
                                <p className={`${styles['sidebar__menu--title']}`}>{item.title}</p>
                            </Link>
                        </li>
                    )
                })}
            </ul>

            <button type="button" className={`${styles['sidebar__logout']}`} onClick={onLogout}>
                გამოსვლა
            </button>
        </div>
    )
}

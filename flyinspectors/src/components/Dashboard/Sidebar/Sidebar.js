'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { visibleSections } from '../sections'
import styles from './Sidebar.module.scss'

const isActive = (pathname, path) => {
    const url = `/adminpanel${path}`
    return pathname === url || pathname.startsWith(`${url}/`)
}

function MenuLink({ item, pathname }) {
    return (
        <li className={`${styles['sidebar__menu--item']} ${isActive(pathname, item.path) ? styles['active'] : ''}`}>
            <Link className={`${styles['sidebar__menu--link']}`} href={`/adminpanel${item.path}`}>
                <p className={`${styles['sidebar__menu--title']}`}>{item.title}</p>
            </Link>
        </li>
    )
}

// ჩამოსაშლელი ჯგუფი. აქტიური შვილის მქონე ჯგუფი ღიაა — ადმინი არ უნდა დაიკარგოს.
function MenuGroup({ group, pathname }) {
    const hasActive = group.children.some(c => isActive(pathname, c.path))
    const [open, setOpen] = useState(hasActive)

    // სხვა გვერდიდან ჯგუფის შიგნით გადასვლისას (მაგ. ბრაუზერის "უკან") ჯგუფი გაიშალოს
    useEffect(() => {
        if (hasActive) setOpen(true)
    }, [hasActive])

    return (
        <li className={`${styles['sidebar__menu--item']} ${styles['sidebar__group']}`}>
            <button
                type="button"
                className={`${styles['sidebar__group--toggle']}`}
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
            >
                <span className={`${styles['sidebar__menu--title']}`}>{group.title}</span>
                <span className={`${styles['sidebar__group--arrow']} ${open ? styles['open'] : ''}`} aria-hidden="true">▾</span>
            </button>

            {open && (
                <ul className={`${styles['sidebar__group--list']}`}>
                    {group.children.map(child => (
                        <MenuLink key={child.path} item={child} pathname={pathname} />
                    ))}
                </ul>
            )}
        </li>
    )
}

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

                {sections.map((item) =>
                    item.children
                        ? <MenuGroup key={item.title} group={item} pathname={pathname} />
                        : <MenuLink key={item.path} item={item} pathname={pathname} />
                )}
            </ul>

            <button type="button" className={`${styles['sidebar__logout']}`} onClick={onLogout}>
                გამოსვლა
            </button>
        </div>
    )
}

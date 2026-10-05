'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import Loading from '../../Loading/Loading'
import adminFetch from '../../../api/adminFetch'
import styles from './Users.module.scss'

const ROLE_LABEL = {
    admin: 'ადმინი',
    editor: 'რედაქტორი',
    user: 'მომხმარებელი',
}

export default function UsersList() {
    const me = useSelector(state => state.userData.user)
    const [data, setData] = useState([])
    const [load, setLoad] = useState(false)
    const [error, setError] = useState('')
    const [reload, setReload] = useState(0)

    useEffect(() => {
        setLoad(true)
        setError('')
        adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/users`)
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text())
                setData(await res.json())
            })
            .catch((e) => setError(e.message || 'ჩატვირთვა ვერ მოხერხდა'))
            .finally(() => setLoad(false))
    }, [reload])

    const remove = async (id, email) => {
        if (!confirm(`წავშალო ${email}?`)) return

        setLoad(true)
        try {
            const res = await adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/users/delete`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            })
            if (!res.ok) throw new Error(await res.text())
            setReload(n => n + 1)
        } catch (e) {
            setError(e.message || 'წაშლა ვერ მოხერხდა')
        } finally {
            setLoad(false)
        }
    }

    return (
        <div className={styles.users}>
            <div className={styles.users__head}>
                <h1 className={styles.users__title}>მომხმარებლები</h1>
                <Link href={'/adminpanel/users/add'} className={styles.users__add}>
                    დამატება
                </Link>
            </div>

            {error && <p className={styles.users__error}>{error}</p>}
            {load && <Loading />}

            <div className={styles.users__table}>
                <div className={`${styles.users__row} ${styles.users__row_head}`}>
                    <span>მეილი</span>
                    <span>სახელი</span>
                    <span>როლი</span>
                    <span />
                </div>

                {data.map((item) => (
                    <div className={styles.users__row} key={item._id}>
                        <span>{item.email}</span>
                        <span>{item.fullName}</span>
                        <span className={styles[`users__role_${item.role}`]}>
                            {ROLE_LABEL[item.role] || item.role}
                        </span>
                        <span className={styles.users__actions}>
                            <Link href={`/adminpanel/users/${item._id}`}>რედაქტირება</Link>
                            {item._id !== me?._id && (
                                <button type="button" onClick={() => remove(item._id, item.email)}>
                                    წაშლა
                                </button>
                            )}
                        </span>
                    </div>
                ))}

                {!load && data.length === 0 && (
                    <div className={styles.users__row}><span>ჩანაწერი არ არის</span></div>
                )}
            </div>
        </div>
    )
}

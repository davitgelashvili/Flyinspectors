'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Loading from '../../Loading/Loading'
import adminFetch from '../../../api/adminFetch'
import revalidateSite from '../../../api/revalidateSite'
import styles from './Pages.module.scss'

export default function PagesList() {
    const [data, setData] = useState([])
    const [load, setLoad] = useState(false)
    const [error, setError] = useState('')
    const [reload, setReload] = useState(0)

    useEffect(() => {
        setLoad(true)
        setError('')
        adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/pages?all=true`)
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text())
                setData(await res.json())
            })
            .catch(e => setError(e.message || 'ჩატვირთვა ვერ მოხერხდა'))
            .finally(() => setLoad(false))
    }, [reload])

    const remove = async (_id, slug) => {
        if (!confirm(`წავშალო გვერდი /${slug}?`)) return

        setLoad(true)
        try {
            const res = await adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/delete`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id }),
            })
            if (!res.ok) throw new Error(await res.text())
            await revalidateSite('pages')
            setReload(n => n + 1)
        } catch (e) {
            setError(e.message || 'წაშლა ვერ მოხერხდა')
        } finally {
            setLoad(false)
        }
    }

    return (
        <div className={styles.pages}>
            <div className={styles.pages__head}>
                <h1 className={styles.pages__title}>გვერდები</h1>
                <Link href={'/adminpanel/pages/add'} className={styles.pages__add}>
                    + დამატება
                </Link>
            </div>

            {error && <p className={styles.pages__error}>{error}</p>}
            {load && <Loading />}

            <div className={styles.pages__grid}>
                {data.map((item) => (
                    <div className={styles.pages__card} key={item._id}>
                        <div className={styles.pages__cover}>
                            {item.cover
                                ? <img src={item.cover} alt={item.title?.ka || item.slug} />
                                : <span className={styles.pages__nocover}>ფოტოს გარეშე</span>}
                        </div>

                        <div className={styles.pages__body}>
                            <p className={styles.pages__name}>
                                {item.title?.ka || item.title?.en || '(სათაურის გარეშე)'}
                            </p>
                            <p className={styles.pages__slug}>/{item.slug}</p>
                            {!item.published && <span className={styles.pages__draft}>გამოუქვეყნებელი</span>}
                        </div>

                        <div className={styles.pages__actions}>
                            <Link href={`/adminpanel/pages/${item._id}`}>რედაქტირება</Link>
                            <a href={`/ka/page/${item.slug}`} target="_blank" rel="noreferrer">ნახვა</a>
                            <button type="button" onClick={() => remove(item._id, item.slug)}>წაშლა</button>
                        </div>
                    </div>
                ))}

                {!load && data.length === 0 && (
                    <p className={styles.pages__empty}>გვერდი ჯერ არ არის შექმნილი.</p>
                )}
            </div>
        </div>
    )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Loading from '../../Loading/Loading'
import adminFetch from '../../../api/adminFetch'
import revalidateSite from '../../../api/revalidateSite'
import styles from './Faq.module.scss'

export default function FaqList() {
    const [data, setData] = useState([])
    const [load, setLoad] = useState(true)
    const [error, setError] = useState('')
    const [reload, setReload] = useState(0)

    useEffect(() => {
        setLoad(true)
        setError('')
        adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/faq`)
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text())
                setData(await res.json())
            })
            .catch(e => setError(e.message || 'ჩატვირთვა ვერ მოხერხდა'))
            .finally(() => setLoad(false))
    }, [reload])

    const remove = async (_id, title) => {
        if (!confirm(`წავშალო კითხვა "${title}"?`)) return

        setLoad(true)
        try {
            const res = await adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/faq/delete`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id }),
            })
            if (!res.ok) throw new Error(await res.text())
            await revalidateSite('faq')
            setReload(n => n + 1)
        } catch (e) {
            setError(e.message || 'წაშლა ვერ მოხერხდა')
            setLoad(false)
        }
    }

    return (
        <div className={styles.faq}>
            <div className={styles.faq__head}>
                <h1 className={styles.faq__title}>ხშირად დასმული კითხვები</h1>
                <Link href={'/adminpanel/faq/add'} className={styles.faq__add}>
                    + დამატება
                </Link>
            </div>

            {error && <p className={styles.faq__error}>{error}</p>}
            {load && <Loading />}

            <ul className={styles.faq__list}>
                {data.map((item) => {
                    const title = item.title?.ka || item.title?.en || '(სათაურის გარეშე)'
                    const missing = !item.title?.ka ? 'ქართულად' : !item.title?.en ? 'ინგლისურად' : ''

                    return (
                        <li className={styles.faq__row} key={item._id}>
                            <span className={styles.faq__order}>{item.order}</span>

                            <div className={styles.faq__body}>
                                <p className={styles.faq__name}>{title}</p>
                                <div className={styles.faq__badges}>
                                    {item.showOnHome && <span className={styles.faq__home}>მთავარ გვერდზე</span>}
                                    {missing && <span className={styles.faq__warn}>არ არის შევსებული {missing}</span>}
                                </div>
                            </div>

                            <div className={styles.faq__actions}>
                                <Link href={`/adminpanel/faq/${item._id}`}>რედაქტირება</Link>
                                <button type="button" onClick={() => remove(item._id, title)}>წაშლა</button>
                            </div>
                        </li>
                    )
                })}

                {!load && data.length === 0 && (
                    <li className={styles.faq__empty}>კითხვა ჯერ არ არის დამატებული.</li>
                )}
            </ul>
        </div>
    )
}

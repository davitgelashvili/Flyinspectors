'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Loading from '../../Loading/Loading'
import adminFetch from '../../../api/adminFetch'
import revalidateSite from '../../../api/revalidateSite'
import { cloudinaryImage } from '@/utils/cloudinary'
import { postPath } from '@/utils/post'
import styles from './Posts.module.scss'

const dateLabel = (value) => {
    if (!value) return ''
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? '' : parsed.toLocaleDateString('ka-GE')
}

export default function PostsList() {
    const [data, setData] = useState([])
    const [load, setLoad] = useState(false)
    const [error, setError] = useState('')
    const [reload, setReload] = useState(0)

    useEffect(() => {
        setLoad(true)
        setError('')
        adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?all=true`)
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text())
                const body = await res.json()
                setData(Array.isArray(body?.items) ? body.items : [])
            })
            .catch(e => setError(e.message || 'ჩატვირთვა ვერ მოხერხდა'))
            .finally(() => setLoad(false))
    }, [reload])

    const remove = async (_id, slug) => {
        if (!confirm(`წავშალო სტატია ${postPath(slug)}?`)) return

        setLoad(true)
        try {
            const res = await adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/delete`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id }),
            })
            if (!res.ok) throw new Error(await res.text())
            await revalidateSite('posts')
            setReload(n => n + 1)
        } catch (e) {
            setError(e.message || 'წაშლა ვერ მოხერხდა')
        } finally {
            setLoad(false)
        }
    }

    return (
        <div className={styles.posts}>
            <div className={styles.posts__head}>
                <h1 className={styles.posts__title}>ბლოგი</h1>
                <Link href={'/adminpanel/posts/add'} className={styles.posts__add}>
                    + სტატიის დამატება
                </Link>
            </div>

            <p className={styles.posts__hint}>
                სტატიები საიტზე გამოქვეყნების თარიღით ლაგდება — ახალი ყველაზე თავშია.
            </p>

            {error && <p className={styles.posts__error}>{error}</p>}
            {load && <Loading />}

            <div className={styles.posts__grid}>
                {data.map((item) => (
                    <div className={styles.posts__card} key={item._id}>
                        <div className={styles.posts__cover}>
                            {item.cover
                                ? <img src={cloudinaryImage(item.cover)} alt={item.coverAlt?.ka || item.title?.ka || item.slug} />
                                : <span className={styles.posts__nocover}>ფოტოს გარეშე</span>}
                        </div>

                        <div className={styles.posts__body}>
                            <p className={styles.posts__name}>
                                {item.title?.ka || item.title?.en || '(სათაურის გარეშე)'}
                            </p>
                            <p className={styles.posts__slug}>{postPath(item.slug)}</p>
                            <p className={styles.posts__date}>{dateLabel(item.publishedAt)}</p>
                            {!item.published && <span className={styles.posts__draft}>გამოუქვეყნებელი</span>}
                            {/* ქართული თარგმანის გარეშე საიტი ინგლისურს აჩვენებს — ეს უნდა ჩანდეს */}
                            {!item.title?.ka?.trim() && (
                                <span className={styles.posts__warn}>ქართული თარგმანის გარეშე</span>
                            )}
                        </div>

                        <div className={styles.posts__actions}>
                            <Link href={`/adminpanel/posts/${item._id}`}>რედაქტირება</Link>
                            <a href={`/ka${postPath(item.slug)}`} target="_blank" rel="noreferrer">ნახვა</a>
                            <button type="button" onClick={() => remove(item._id, item.slug)}>წაშლა</button>
                        </div>
                    </div>
                ))}

                {!load && data.length === 0 && (
                    <p className={styles.posts__empty}>სტატია ჯერ არ არის შექმნილი.</p>
                )}
            </div>
        </div>
    )
}

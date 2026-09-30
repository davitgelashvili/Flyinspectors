'use client'

import { useEffect, useState } from 'react'
import CustomInput from '../../UI/CustomInput'
import Content from '../Content/Content'
import Loading from '../../Loading/Loading'
import adminFetch from '../../../api/adminFetch'
import revalidateSite from '../../../api/revalidateSite'
import pagesStyles from '../Pages/Pages.module.scss'
import styles from './ListForm.module.scss'

// ბარათს ბრაუზერში დროებითი id სჭირდება (React-ის key), რომ წაშლა/გადაწევა
// არ აურიოს ველები. ბაზაში ის არ იგზავნება.
let counter = 0
const uid = () => `card-${Date.now()}-${counter++}`

const emptyItem = () => ({ id: uid(), title: { ka: '', en: '' }, desc: { ka: '', en: '' } })

const withIds = (data) => ({
    sectionTitle: { ka: '', en: '', ...data.sectionTitle },
    items: (data.items || []).map((item) => ({
        id: item._id || uid(),
        title: { ka: '', en: '', ...item.title },
        desc: { ka: '', en: '', ...item.desc },
    })),
})

/**
 * "სათაური + ბარათების სია" სექციის ადმინი (ბექში: controllers/sectionList.js).
 *
 * endpoint    — ბექის მისამართი, მაგ. 'options' ან 'how'
 *
 * ყველა ტექსტი ბაზიდან იკითხება; ბაზა თუ ცარიელია, ფორმა ცარიელი იხსნება.
 */
export default function ListForm({
    heading,
    endpoint,
    cardLabel = 'ბარათი',
    addLabel = '+ ბარათის დამატება',
    titleLabel = 'სექციის სათაური',
    titlePlaceholder = '',
}) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`

    const [sectionTitle, setSectionTitle] = useState({ ka: '', en: '' })
    const [items, setItems] = useState([])
    const [language, setLanguage] = useState('ka')
    const [load, setLoad] = useState(true)
    const [error, setError] = useState('')
    const [done, setDone] = useState('')

    const apply = (data) => {
        const next = withIds(data)
        setSectionTitle(next.sectionTitle)
        setItems(next.items)
    }

    useEffect(() => {
        let active = true

        adminFetch(url)
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text())
                return res.json()
            })
            .then(data => { if (active) apply(data) })
            .catch(e => { if (active) setError(e.message || 'ჩატვირთვა ვერ მოხერხდა') })
            .finally(() => { if (active) setLoad(false) })

        return () => { active = false }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url])

    const setField = (id, field) => (e) => {
        const value = e.target.value
        setItems(list => list.map(item =>
            item.id === id ? { ...item, [field]: { ...item[field], [language]: value } } : item
        ))
    }

    const move = (index, step) => setItems(list => {
        const target = index + step
        if (target < 0 || target >= list.length) return list
        const next = [...list]
        const moved = next[index]
        next[index] = next[target]
        next[target] = moved
        return next
    })

    const remove = (id) => setItems(list => list.filter(item => item.id !== id))
    const add = () => setItems(list => [...list, emptyItem()])

    const submit = async () => {
        setError('')
        setDone('')
        setLoad(true)

        try {
            const res = await adminFetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sectionTitle,
                    items: items.map(({ title, desc }) => ({ title, desc })),
                }),
            })

            if (!res.ok) throw new Error(await res.text())

            // ბექის მიერ შენახული მონაცემი ვაჩვენოთ (გასუფთავებული, ახალი id-ებით)
            apply(await res.json())
            await revalidateSite(endpoint)
            setDone('შენახულია')
        } catch (e) {
            setError(e.message || 'შენახვა ვერ მოხერხდა')
        } finally {
            setLoad(false)
        }
    }

    return (
        <div className={pagesStyles.pages}>
            <div className={pagesStyles.pages__head}>
                <h1 className={pagesStyles.pages__title}>{heading}</h1>
            </div>

            {error && <p className={pagesStyles.pages__error}>{error}</p>}
            {done && <p className={pagesStyles.pages__done}>{done}</p>}

            <div className={pagesStyles.pages__form}>
                <Content title="" language={language} setLanguage={setLanguage}>
                    <div lang={language} key={language}>
                        <CustomInput
                            title={titleLabel}
                            name="sectionTitle"
                            value={sectionTitle[language] || ''}
                            placeholder={titlePlaceholder}
                            onChange={(e) => setSectionTitle(v => ({ ...v, [language]: e.target.value }))}
                        />

                        <p className={styles.hint}>
                            {cardLabel}, რომელსაც ამ ენაზე სათაური არ აქვს, ამ ენის გვერდზე არ გამოჩნდება.
                        </p>

                        {items.map((item, index) => (
                            <div key={item.id} className={styles.card}>
                                <div className={styles.card__head}>
                                    <span className={styles.card__number}>{cardLabel} {index + 1}</span>
                                    <div className={styles.card__actions}>
                                        <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="ზემოთ">↑</button>
                                        <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label="ქვემოთ">↓</button>
                                        <button type="button" onClick={() => remove(item.id)} className={styles.card__remove}>წაშლა</button>
                                    </div>
                                </div>

                                <CustomInput
                                    title="სათაური"
                                    name={`title-${item.id}`}
                                    value={item.title[language] || ''}
                                    onChange={setField(item.id, 'title')}
                                />
                                <p className={styles.label}>ტექსტი</p>
                                <textarea
                                    className={styles.textarea}
                                    rows={4}
                                    value={item.desc[language] || ''}
                                    onChange={setField(item.id, 'desc')}
                                />
                            </div>
                        ))}

                        <button type="button" className={styles.add} onClick={add}>
                            {addLabel}
                        </button>
                    </div>
                </Content>

                <button type="button" className={pagesStyles.pages__submit} onClick={submit} disabled={load}>
                    {load ? '...' : 'შენახვა'}
                </button>
            </div>

            {load && <Loading />}
        </div>
    )
}

'use client'

import { useEffect, useState } from 'react'
import CustomInput from '../../UI/CustomInput'
import Content from '../Content/Content'
import Loading from '../../Loading/Loading'
import adminFetch from '../../../api/adminFetch'
import revalidateSite from '../../../api/revalidateSite'
import pagesStyles from '../Pages/Pages.module.scss'
import styles from '../ListForm/ListForm.module.scss'

const MAX_OFFICES = 6 // ბექის ლიმიტს ემთხვევა (back/controllers/offices.js)

// ოფისს ბრაუზერში დროებითი id სჭირდება (React-ის key), რომ წაშლა/გადაწევა არ აურიოს ველები.
// ბაზაში ის არ იგზავნება.
let counter = 0
const uid = () => `office-${Date.now()}-${counter++}`

const emptyOffice = () => ({
    id: uid(),
    country: { ka: '', en: '' },
    phone: '',
    email: '',
    address: { ka: '', en: '' },
})

const withIds = (data) =>
    (data?.offices || []).map((office) => ({
        id: office._id || uid(),
        country: { ka: '', en: '', ...office.country },
        phone: office.phone || '',
        email: office.email || '',
        address: { ka: '', en: '', ...office.address },
    }))

export default function ContactForm() {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/offices`

    const [offices, setOffices] = useState([])
    const [language, setLanguage] = useState('ka')
    const [load, setLoad] = useState(true)
    const [error, setError] = useState('')
    const [done, setDone] = useState('')

    useEffect(() => {
        let active = true

        adminFetch(url)
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text())
                if (active) setOffices(withIds(await res.json()))
            })
            .catch(e => { if (active) setError(e.message || 'ჩატვირთვა ვერ მოხერხდა') })
            .finally(() => { if (active) setLoad(false) })

        return () => { active = false }
    }, [url])

    const update = (id, patch) =>
        setOffices(list => list.map(o => (o.id === id ? { ...o, ...patch } : o)))

    // ენაზე დამოკიდებული ველი: მხოლოდ მიმდინარე ენის ტექსტი იცვლება
    const setLocalized = (office, field) => (e) =>
        update(office.id, { [field]: { ...office[field], [language]: e.target.value } })

    const move = (index, step) => setOffices(list => {
        const target = index + step
        if (target < 0 || target >= list.length) return list
        const next = [...list]
        const moved = next[index]
        next[index] = next[target]
        next[target] = moved
        return next
    })

    const remove = (id) => setOffices(list => list.filter(o => o.id !== id))
    const add = () => setOffices(list => [...list, emptyOffice()])

    const submit = async () => {
        setError('')
        setDone('')
        setLoad(true)

        try {
            const res = await adminFetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    offices: offices.map(({ country, phone, email, address }) => ({ country, phone, email, address })),
                }),
            })

            if (!res.ok) throw new Error(await res.text())

            // ბექის მიერ შენახული მონაცემი ვაჩვენოთ (გასუფთავებული, ახალი id-ებით)
            setOffices(withIds(await res.json()))
            await revalidateSite('offices')
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
                <h1 className={pagesStyles.pages__title}>საკონტაქტო</h1>
            </div>

            {error && <p className={pagesStyles.pages__error}>{error}</p>}
            {done && <p className={pagesStyles.pages__done}>{done}</p>}

            <div className={pagesStyles.pages__form}>
                <Content title="" language={language} setLanguage={setLanguage}>
                    <div lang={language} key={language}>
                        <p className={styles.hint}>
                            ქვეყნის სახელი და მისამართი ენის მიხედვით იწერება (ტაბებით). ტელეფონი და ელფოსტა
                            ორივე ენაზე ერთნაირია. ენაზე შეუვსებელი მისამართის ნაცვლად მეორე ენისა ჩანს.
                        </p>

                        {offices.map((office, index) => (
                            <div key={office.id} className={styles.card}>
                                <div className={styles.card__head}>
                                    <span className={styles.card__number}>ოფისი {index + 1}</span>
                                    <div className={styles.card__actions}>
                                        <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="ზემოთ">↑</button>
                                        <button type="button" onClick={() => move(index, 1)} disabled={index === offices.length - 1} aria-label="ქვემოთ">↓</button>
                                        <button type="button" onClick={() => remove(office.id)} className={styles.card__remove}>წაშლა</button>
                                    </div>
                                </div>

                                <CustomInput
                                    title="ქვეყანა"
                                    name={`country-${office.id}`}
                                    value={office.country[language]}
                                    placeholder={language === 'ka' ? 'მაგ. საქართველო' : 'e.g. Georgia'}
                                    onChange={setLocalized(office, 'country')}
                                />
                                <CustomInput
                                    title="ტელეფონი"
                                    name={`phone-${office.id}`}
                                    value={office.phone}
                                    placeholder="+995 593 00 03 94"
                                    onChange={(e) => update(office.id, { phone: e.target.value })}
                                />
                                <CustomInput
                                    title="ელფოსტა"
                                    name={`email-${office.id}`}
                                    value={office.email}
                                    placeholder="info@flyinspectors.com"
                                    onChange={(e) => update(office.id, { email: e.target.value })}
                                />
                                <p className={styles.label}>მისამართი</p>
                                <textarea
                                    className={styles.textarea}
                                    rows={2}
                                    value={office.address[language]}
                                    onChange={setLocalized(office, 'address')}
                                />
                            </div>
                        ))}

                        {offices.length < MAX_OFFICES && (
                            <button type="button" className={styles.add} onClick={add}>
                                + ოფისის დამატება
                            </button>
                        )}
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

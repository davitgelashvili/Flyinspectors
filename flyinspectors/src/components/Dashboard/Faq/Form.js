'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import CustomInput from '../../UI/CustomInput'
import CustomEditor from '../../CustomEditor/CustomEditor'
import Content from '../Content/Content'
import Loading from '../../Loading/Loading'
import adminFetch from '../../../api/adminFetch'
import revalidateSite from '../../../api/revalidateSite'
import styles from './Faq.module.scss'

const EMPTY = {
    title: { ka: '', en: '' },
    text: { ka: '', en: '' },
    showOnHome: false,
    order: 0,
}

const normalize = (data) => ({
    title: { ...EMPTY.title, ...data?.title },
    text: { ...EMPTY.text, ...data?.text },
    showOnHome: Boolean(data?.showOnHome),
    order: data?.order ?? 0,
})

export default function FaqForm() {
    const router = useRouter()
    const pathname = usePathname()
    const id = pathname.split('/').pop()
    const isEdit = id !== 'add'

    const [values, setValues] = useState(() => normalize({}))
    const [language, setLanguage] = useState('ka')
    const [load, setLoad] = useState(isEdit)
    const [error, setError] = useState('')
    const [done, setDone] = useState('')

    useEffect(() => {
        if (!isEdit) return

        let active = true
        adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/faq`)
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text())
                const found = (await res.json()).find(f => f._id === id)
                if (!found) throw new Error('კითხვა ვერ მოიძებნა')
                if (active) setValues(normalize(found))
            })
            .catch(e => { if (active) setError(e.message) })
            .finally(() => { if (active) setLoad(false) })

        return () => { active = false }
    }, [id, isEdit])

    const setLocalized = (field, value) =>
        setValues(v => ({ ...v, [field]: { ...v[field], [language]: value } }))

    const submit = async () => {
        setError('')
        setDone('')

        if (!values.title.ka.trim() && !values.title.en.trim()) {
            setError('კითხვის სათაური სავალდებულოა (მინიმუმ ერთ ენაზე)')
            return
        }

        setLoad(true)
        try {
            const res = await adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/faq`, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...(isEdit && { _id: id }),
                    title: values.title,
                    text: values.text,
                    showOnHome: values.showOnHome,
                    order: Number(values.order) || 0,
                }),
            })

            if (!res.ok) throw new Error(await res.text())

            const saved = await res.json()
            await revalidateSite('faq')

            if (isEdit) {
                // ბექი HTML-ს ასუფთავებს — ვაჩვენოთ ის, რაც რეალურად შეინახა
                setValues(normalize(saved))
                setDone('შენახულია')
            } else {
                router.push(`/adminpanel/faq/${saved._id}`)
            }
        } catch (e) {
            setError(e.message || 'შენახვა ვერ მოხერხდა')
        } finally {
            setLoad(false)
        }
    }

    return (
        <div className={styles.faq}>
            <div className={styles.faq__head}>
                <h1 className={styles.faq__title}>
                    {isEdit ? 'კითხვის რედაქტირება' : 'ახალი კითხვა'}
                </h1>
                <Link href={'/adminpanel/faq'}>← სიაში დაბრუნება</Link>
            </div>

            {error && <p className={styles.faq__error}>{error}</p>}
            {done && <p className={styles.faq__done}>{done}</p>}

            <div className={styles.faq__form}>
                {/* ენისგან დამოუკიდებელი ველები */}
                <label className={styles.faq__check}>
                    <input
                        type="checkbox"
                        checked={values.showOnHome}
                        onChange={(e) => setValues(v => ({ ...v, showOnHome: e.target.checked }))}
                    />
                    მთავარ გვერდზე გამოჩნდეს
                </label>

                <CustomInput
                    type="number"
                    title="რიგითობა (პატარა ნომერი — ზემოთ)"
                    name="order"
                    value={values.order}
                    onChange={(e) => setValues(v => ({ ...v, order: e.target.value }))}
                />

                {/* ენაზე დამოკიდებული ველები — ტაბებით */}
                <Content title="" language={language} setLanguage={setLanguage}>
                    <div lang={language} key={language}>
                        <CustomInput
                            title="კითხვა"
                            name="title"
                            value={values.title[language]}
                            placeholder="მაგ. რა მჭირდება კომპენსაციის მისაღებად?"
                            onChange={(e) => setLocalized('title', e.target.value)}
                        />

                        {/* !load: რედაქტორი მნიშვნელობას მხოლოდ პირველად კითხულობს, ამიტომ
                            რედაქტირებისას ჩატვირთვის დასრულებამდე არ ვხატავთ */}
                        {!load && (
                            <CustomEditor
                                section="text"
                                name={language}
                                value={values.text[language]}
                                onChange={(section, name, html) => setLocalized('text', html)}
                                title="პასუხი"
                            />
                        )}
                    </div>
                </Content>

                <button type="button" className={styles.faq__submit} onClick={submit} disabled={load}>
                    {load ? '...' : isEdit ? 'შენახვა' : 'დამატება'}
                </button>
            </div>

            {load && <Loading />}
        </div>
    )
}

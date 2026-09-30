'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import CustomInput from '../../UI/CustomInput'
import CustomEditor from '../../CustomEditor/CustomEditor'
import UploadWidget from '../../UploadWidget/UploadWidget'
import Content from '../Content/Content'
import Loading from '../../Loading/Loading'
import adminFetch from '../../../api/adminFetch'
import revalidateSite from '../../../api/revalidateSite'
import styles from './Pages.module.scss'

const EMPTY = {
    slug: '',
    cover: '',
    title: { ka: '', en: '' },
    metaTitle: { ka: '', en: '' },
    metaDescription: { ka: '', en: '' },
    content: { ka: '', en: '' },
    published: true,
}

export default function PagesForm() {
    const router = useRouter()
    const pathname = usePathname()
    const id = pathname.split('/').pop()
    const isEdit = id !== 'add'

    const [values, setValues] = useState(EMPTY)
    const [language, setLanguage] = useState('ka')
    const [load, setLoad] = useState(false)
    const [error, setError] = useState('')
    const [done, setDone] = useState('')

    useEffect(() => {
        if (!isEdit) return

        setLoad(true)
        adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/pages?all=true`)
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text())
                const found = (await res.json()).find(p => p._id === id)
                if (!found) throw new Error('გვერდი ვერ მოიძებნა')
                setValues({ ...EMPTY, ...found })
            })
            .catch(e => setError(e.message))
            .finally(() => setLoad(false))
    }, [id, isEdit])

    // ერთი ველი, მიმდინარე ენაზე
    const setLocalized = (field) => (e) =>
        setValues(v => ({ ...v, [field]: { ...v[field], [language]: e.target.value } }))

    // CustomEditor იძახებს onChange(section, name, html)
    const setContent = (section, name, html) =>
        setValues(v => ({ ...v, content: { ...v.content, [language]: html } }))

    const submit = async () => {
        setError('')
        setDone('')

        if (!values.slug.trim()) {
            setError('გვერდის ლინკი (slug) სავალდებულოა')
            return
        }

        setLoad(true)
        try {
            const res = await adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/pages`, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(isEdit ? { ...values, _id: id } : values),
            })

            if (!res.ok) throw new Error(await res.text())

            const saved = await res.json()
            await revalidateSite('pages')
            setDone(isEdit ? 'შენახულია' : 'გვერდი შეიქმნა')
            if (!isEdit) router.push(`/adminpanel/pages/${saved._id}`)
        } catch (e) {
            setError(e.message || 'შენახვა ვერ მოხერხდა')
        } finally {
            setLoad(false)
        }
    }

    return (
        <div className={styles.pages}>
            <div className={styles.pages__head}>
                <h1 className={styles.pages__title}>
                    {isEdit ? 'გვერდის რედაქტირება' : 'ახალი გვერდი'}
                </h1>
                <Link href={'/adminpanel/pages'}>← სიაში დაბრუნება</Link>
            </div>

            {error && <p className={styles.pages__error}>{error}</p>}
            {done && <p className={styles.pages__done}>{done}</p>}

            <div className={styles.pages__form}>
                {/* ენისგან დამოუკიდებელი ველები */}
                <CustomInput
                    title="გვერდის ლინკი"
                    name="slug"
                    value={values.slug}
                    placeholder="my-new-page"
                    onChange={(e) => setValues(v => ({ ...v, slug: e.target.value }))}
                />
                <p className={styles.pages__url}>
                    მისამართი: <code>/ka/page/{values.slug || 'your-slug'}</code> და{' '}
                    <code>/en/page/{values.slug || 'your-slug'}</code>
                </p>

                <UploadWidget
                    title="ქოვერ ფოტო"
                    value={values}
                    setValue={setValues}
                    valueName="cover"
                />
                {values.cover && (
                    <img src={values.cover} alt="cover" className={styles.pages__preview} />
                )}

                <label className={styles.pages__check}>
                    <input
                        type="checkbox"
                        checked={values.published}
                        onChange={(e) => setValues(v => ({ ...v, published: e.target.checked }))}
                    />
                    გამოქვეყნებული
                </label>

                {/* ენაზე დამოკიდებული ველები — ტაბებით */}
                <Content title="" language={language} setLanguage={setLanguage}>
                    <div lang={language} key={language}>
                        <CustomInput
                            title="გვერდის სახელი"
                            name="title"
                            value={values.title?.[language] || ''}
                            placeholder="სათაური, რომელიც გვერდზე გამოჩნდება"
                            onChange={setLocalized('title')}
                        />
                        <CustomInput
                            title="მეტა სათაური — ბრაუზერის ტაბსა და Google-ში"
                            name="metaTitle"
                            value={values.metaTitle?.[language] || ''}
                            placeholder="SEO სათაური"
                            onChange={setLocalized('metaTitle')}
                        />
                        <CustomInput
                            title="მეტა აღწერა — Google-ის შედეგებში"
                            name="metaDescription"
                            value={values.metaDescription?.[language] || ''}
                            placeholder="მოკლე აღწერა, 150-160 სიმბოლო"
                            onChange={setLocalized('metaDescription')}
                        />

                        <CustomEditor
                            section="content"
                            name={language}
                            value={values.content?.[language] || ''}
                            onChange={setContent}
                            title="გვერდის კონტენტი"
                        />
                    </div>
                </Content>

                <button type="button" className={styles.pages__submit} onClick={submit} disabled={load}>
                    {load ? '...' : isEdit ? 'შენახვა' : 'შექმნა'}
                </button>
            </div>

            {load && <Loading />}
        </div>
    )
}

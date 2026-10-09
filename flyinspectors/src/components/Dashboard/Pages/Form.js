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
import { HEADER_SLOTS, FOOTER_SLOTS } from '@/utils/pageMenu'
import styles from './Pages.module.scss'

const EMPTY = {
    slug: '',
    cover: '',
    coverAlt: { ka: '', en: '' },
    title: { ka: '', en: '' },
    metaTitle: { ka: '', en: '' },
    metaDescription: { ka: '', en: '' },
    content: { ka: '', en: '' },
    menu: { header: 'none', footer: 'third' },
    menuOrder: 0,
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
                // ძველ ჩანაწერს menu ველი არ აქვს — ნაგულისხმევი რჩება
                setValues({ ...EMPTY, ...found, menu: { ...EMPTY.menu, ...found.menu } })
            })
            .catch(e => setError(e.message))
            .finally(() => setLoad(false))
    }, [id, isEdit])

    // ერთი ველი, მიმდინარე ენაზე
    const setLocalized = (field) => (e) =>
        setValues(v => ({ ...v, [field]: { ...v[field], [language]: e.target.value } }))

    // მენიუს არჩევანი ენისგან დამოუკიდებელია
    const setMenu = (where) => (e) =>
        setValues(v => ({ ...v, menu: { ...v.menu, [where]: e.target.value } }))

    // ქოვერის alt ენების ტაბების გარეთაა (ფოტოსთან ერთად), ამიტომ ენა პირდაპირ გადმოეცემა
    const setCoverAlt = (lang) => (e) =>
        setValues(v => ({ ...v, coverAlt: { ...v.coverAlt, [lang]: e.target.value } }))

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
                    მისამართი: <code>/ka/{values.slug || 'your-slug'}</code> და{' '}
                    <code>/en/{values.slug || 'your-slug'}</code>
                </p>

                <UploadWidget
                    title="ქოვერ ფოტო"
                    value={values}
                    setValue={setValues}
                    valueName="cover"
                    preview
                />
                {/* ქოვერი ერთია ორივე ენისთვის, მისი alt კი ენაზეა დამოკიდებული — ამიტომ
                    ორივე ველი ფოტოსთან ერთად ჩანს და ქვემოთ ტაბებზე არ არის დამოკიდებული */}
                {values.cover && (
                    <div className={styles.pages__coveralt}>
                        <p className={styles.pages__hint}>
                            ფოტოს აღწერა (alt) — რა ჩანს ფოტოზე. Google-ისთვისაც და იმ
                            მომხმარებლისთვისაც, რომელსაც ფოტო არ ჩაეტვირთა.
                        </p>
                        <CustomInput
                            title="ქართულად"
                            name="coverAltKa"
                            value={values.coverAlt?.ka || ''}
                            placeholder="მაგ. მგზავრები თბილისის აეროპორტის დარბაზში"
                            onChange={setCoverAlt('ka')}
                        />
                        <CustomInput
                            title="ინგლისურად"
                            name="coverAltEn"
                            value={values.coverAlt?.en || ''}
                            placeholder="e.g. Passengers in the Tbilisi airport terminal"
                            onChange={setCoverAlt('en')}
                        />
                    </div>
                )}

                <div className={styles.pages__menu}>
                    <p className={styles.pages__menutitle}>სად ჩანდეს მენიუში</p>

                    <label className={styles.pages__field}>
                        <span className={styles.pages__fieldlabel}>ჰედერის მენიუ</span>
                        <select
                            className={styles.pages__select}
                            value={values.menu?.header || 'none'}
                            onChange={setMenu('header')}
                        >
                            {HEADER_SLOTS.map((slot) => (
                                <option key={slot.value} value={slot.value}>{slot.label}</option>
                            ))}
                        </select>
                    </label>

                    <label className={styles.pages__field}>
                        <span className={styles.pages__fieldlabel}>ფუტერის სექცია</span>
                        <select
                            className={styles.pages__select}
                            value={values.menu?.footer || 'third'}
                            onChange={setMenu('footer')}
                        >
                            {FOOTER_SLOTS.map((slot) => (
                                <option key={slot.value} value={slot.value}>{slot.label}</option>
                            ))}
                        </select>
                    </label>

                    <label className={styles.pages__field}>
                        <span className={styles.pages__fieldlabel}>რიგითობა</span>
                        <input
                            type="number"
                            className={styles.pages__number}
                            value={values.menuOrder ?? 0}
                            onChange={(e) => setValues(v => ({ ...v, menuOrder: Number(e.target.value) || 0 }))}
                        />
                    </label>

                    <p className={styles.pages__hint}>
                        ნაკლები რიცხვი ზემოთ ჩანს. ერთნაირზე შექმნის რიგი რჩება.
                        ფუტერის პირველი სექცია (მთავარი, განაცხადი, სტატუსი, ხდკ) არ იცვლება.
                    </p>
                </div>

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

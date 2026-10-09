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
import { postPath } from '@/utils/post'
import styles from './Posts.module.scss'

const DESCRIPTION_HINT = 160
const EXCERPT_HINT = 200

const blank = () => ({ ka: '', en: '' })

const EMPTY = {
    slug: '',
    cover: '',
    coverAlt: blank(),
    title: blank(),
    excerpt: blank(),
    content: blank(),
    metaTitle: blank(),
    metaDescription: blank(),
    published: true,
    publishedAt: '',
}

// <input type="date"> მხოლოდ "YYYY-MM-DD"-ს იღებს; ბაზაში ISO თარიღია
const toDateInput = (value) => {
    if (!value) return ''
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10)
}

const today = () => new Date().toISOString().slice(0, 10)

export default function PostsForm() {
    const router = useRouter()
    const pathname = usePathname()
    const id = pathname.split('/').pop()
    const isEdit = id !== 'add'

    const [values, setValues] = useState(() => ({ ...EMPTY, publishedAt: today() }))
    const [language, setLanguage] = useState('ka')
    const [load, setLoad] = useState(false)
    const [error, setError] = useState('')
    const [done, setDone] = useState('')

    useEffect(() => {
        if (!isEdit) return

        setLoad(true)
        adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?all=true`)
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text())
                const body = await res.json()
                const found = (Array.isArray(body?.items) ? body.items : []).find(p => p._id === id)
                if (!found) throw new Error('სტატია ვერ მოიძებნა')
                setValues({ ...EMPTY, ...found, publishedAt: toDateInput(found.publishedAt) })
            })
            .catch(e => setError(e.message))
            .finally(() => setLoad(false))
    }, [id, isEdit])

    // ერთი ველი, მიმდინარე ენაზე
    const setLocalized = (field) => (e) =>
        setValues(v => ({ ...v, [field]: { ...v[field], [language]: e.target.value } }))

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
            setError('სტატიის ლინკი (slug) სავალდებულოა')
            return
        }

        setLoad(true)
        try {
            // ცარიელ თარიღს არ ვაგზავნით — სქემის ნაგულისხმევი (ახლანდელი დრო) ჯობია
            const { publishedAt, ...rest } = values
            const payload = {
                ...rest,
                ...(publishedAt && { publishedAt: new Date(publishedAt).toISOString() }),
                ...(isEdit && { _id: id }),
            }

            const res = await adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error(await res.text())

            const saved = await res.json()
            await revalidateSite('posts')
            setDone(isEdit ? 'შენახულია' : 'სტატია შეიქმნა')
            if (!isEdit) router.push(`/adminpanel/posts/${saved._id}`)
        } catch (e) {
            setError(e.message || 'შენახვა ვერ მოხერხდა')
        } finally {
            setLoad(false)
        }
    }

    const excerpt = values.excerpt?.[language] || ''
    const metaDescription = values.metaDescription?.[language] || ''
    const slug = values.slug || 'your-slug'

    return (
        <div className={styles.posts}>
            <div className={styles.posts__head}>
                <h1 className={styles.posts__title}>
                    {isEdit ? 'სტატიის რედაქტირება' : 'ახალი სტატია'}
                </h1>
                <Link href={'/adminpanel/posts'}>← სიაში დაბრუნება</Link>
            </div>

            {error && <p className={styles.posts__error}>{error}</p>}
            {done && <p className={styles.posts__done}>{done}</p>}

            <div className={styles.posts__form}>
                {/* ენისგან დამოუკიდებელი ველები */}
                <CustomInput
                    title="სტატიის ლინკი"
                    name="slug"
                    value={values.slug}
                    placeholder="flight-cancellation-reasons"
                    onChange={(e) => setValues(v => ({ ...v, slug: e.target.value }))}
                />
                <p className={styles.posts__url}>
                    მისამართი: <code>/ka{postPath(slug)}</code> და <code>/en{postPath(slug)}</code>
                    <br />
                    მხოლოდ პატარა ლათინური ასოები, ციფრები და დეფისი.
                </p>

                <div className={styles.posts__row}>
                    <CustomInput
                        type="date"
                        title="გამოქვეყნების თარიღი"
                        name="publishedAt"
                        value={values.publishedAt}
                        onChange={(e) => setValues(v => ({ ...v, publishedAt: e.target.value }))}
                    />
                    <label className={styles.posts__check}>
                        <input
                            type="checkbox"
                            checked={values.published}
                            onChange={(e) => setValues(v => ({ ...v, published: e.target.checked }))}
                        />
                        გამოქვეყნებული
                    </label>
                </div>

                <UploadWidget
                    title="ქოვერ ფოტო — სიის ბარათზე, სტატიის თავში და გაზიარებისას"
                    value={values}
                    setValue={setValues}
                    valueName="cover"
                    preview
                />
                {/* ქოვერი ერთია ორივე ენისთვის, მისი alt კი ენაზეა დამოკიდებული */}
                {values.cover && (
                    <div className={styles.posts__coveralt}>
                        <p className={styles.posts__hint}>ფოტოს აღწერა (alt) — რა ჩანს ფოტოზე.</p>
                        <CustomInput
                            title="ქართულად"
                            name="coverAltKa"
                            value={values.coverAlt?.ka || ''}
                            placeholder="მაგ. თვითმფრინავი აეროპორტის ასაფრენ ბილიკზე"
                            onChange={setCoverAlt('ka')}
                        />
                        <CustomInput
                            title="ინგლისურად"
                            name="coverAltEn"
                            value={values.coverAlt?.en || ''}
                            placeholder="e.g. An aircraft on the airport runway"
                            onChange={setCoverAlt('en')}
                        />
                    </div>
                )}

                {/* ენაზე დამოკიდებული ველები — ტაბებით */}
                <Content title="" language={language} setLanguage={setLanguage}>
                    <div lang={language} key={language}>
                        <CustomInput
                            title="სტატიის სათაური"
                            name="title"
                            value={values.title?.[language] || ''}
                            placeholder="სათაური, რომელიც სიაშიც და სტატიაშიც ჩანს"
                            onChange={setLocalized('title')}
                        />

                        <p className={styles.posts__label}>
                            მოკლე აღწერა — სიის ბარათზე და სტატიის შესავალში
                        </p>
                        <textarea
                            className={styles.posts__textarea}
                            rows={3}
                            value={excerpt}
                            placeholder="2-3 წინადადება, რის შესახებ არის სტატია"
                            onChange={setLocalized('excerpt')}
                        />
                        <p className={`${styles.posts__counter} ${excerpt.length > EXCERPT_HINT ? styles.posts__counter_over : ''}`}>
                            {excerpt.length} / ~{EXCERPT_HINT} სიმბოლო
                        </p>

                        <CustomInput
                            title="მეტა სათაური — ბრაუზერის ტაბსა და Google-ში"
                            name="metaTitle"
                            value={values.metaTitle?.[language] || ''}
                            placeholder="შეუვსებლობისას სტატიის სათაური გამოიყენება"
                            onChange={setLocalized('metaTitle')}
                        />

                        <p className={styles.posts__label}>მეტა აღწერა — Google-ის შედეგებში</p>
                        <textarea
                            className={styles.posts__textarea}
                            rows={3}
                            value={metaDescription}
                            placeholder="შეუვსებლობისას მოკლე აღწერა გამოიყენება"
                            onChange={setLocalized('metaDescription')}
                        />
                        <p className={`${styles.posts__counter} ${metaDescription.length > DESCRIPTION_HINT ? styles.posts__counter_over : ''}`}>
                            {metaDescription.length} / ~{DESCRIPTION_HINT} სიმბოლო
                        </p>

                        <CustomEditor
                            section="content"
                            name={language}
                            value={values.content?.[language] || ''}
                            onChange={setContent}
                            title="სტატიის სრული ტექსტი"
                        />
                    </div>
                </Content>

                <button type="button" className={styles.posts__submit} onClick={submit} disabled={load}>
                    {load ? '...' : isEdit ? 'შენახვა' : 'შექმნა'}
                </button>
            </div>

            {load && <Loading />}
        </div>
    )
}

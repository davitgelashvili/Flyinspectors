'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import CustomInput from '../../UI/CustomInput'
import UploadWidget from '../../UploadWidget/UploadWidget'
import Content from '../Content/Content'
import Loading from '../../Loading/Loading'
import adminFetch from '../../../api/adminFetch'
import revalidateSite from '../../../api/revalidateSite'
import { META_PAGES } from '@/i18n/metaPages'
import pagesStyles from '../Pages/Pages.module.scss'
import styles from './Meta.module.scss'

// Google ჩვეულებრივ ასე ჭრის (სიმბოლოების რაოდენობა მიახლოებითია)
const TITLE_HINT = 60
const DESCRIPTION_HINT = 160

const blank = () => ({ ka: '', en: '' })

const normalize = (data) => ({
    title: { ...blank(), ...data?.title },
    description: { ...blank(), ...data?.description },
    image: { ...blank(), ...data?.image },
})

export default function MetaForm() {
    const pathname = usePathname()
    const slug = pathname.split('/').pop()
    const page = META_PAGES.find((p) => p.slug === slug)
    const isHome = page?.path === '/'

    const [values, setValues] = useState(() => normalize({}))
    const [language, setLanguage] = useState('ka')
    const [load, setLoad] = useState(Boolean(page))
    const [error, setError] = useState('')
    const [done, setDone] = useState('')

    useEffect(() => {
        if (!page) return

        let active = true
        adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/meta`)
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text())
                const found = (await res.json()).find((m) => m.path === page.path)
                if (active) setValues(normalize(found))
            })
            .catch((e) => { if (active) setError(e.message || 'ჩატვირთვა ვერ მოხერხდა') })
            .finally(() => { if (active) setLoad(false) })

        return () => { active = false }
    }, [page])

    if (!page) return <p style={{ padding: '20px 0' }}>გვერდი ვერ მოიძებნა.</p>

    const setField = (field, value) =>
        setValues((v) => ({ ...v, [field]: { ...v[field], [language]: value } }))

    const submit = async () => {
        setError('')
        setDone('')
        setLoad(true)

        try {
            const res = await adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/meta`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: page.path, ...values }),
            })

            if (!res.ok) throw new Error(await res.text())

            setValues(normalize(await res.json()))
            await revalidateSite('meta')
            setDone('შენახულია')
        } catch (e) {
            setError(e.message || 'შენახვა ვერ მოხერხდა')
        } finally {
            setLoad(false)
        }
    }

    const title = values.title[language]
    const description = values.description[language]
    const image = values.image[language]
    const siteUrl = `flyinspectors.com/${language}${page.path === '/' ? '' : page.path}`

    return (
        <div className={pagesStyles.pages}>
            <div className={pagesStyles.pages__head}>
                <h1 className={pagesStyles.pages__title}>მეტა თეგები: {page.label}</h1>
                <a href={`/${language}${page.path === '/' ? '' : page.path}`} target="_blank" rel="noreferrer">
                    გვერდის ნახვა ↗
                </a>
            </div>

            {error && <p className={pagesStyles.pages__error}>{error}</p>}
            {done && <p className={pagesStyles.pages__done}>{done}</p>}

            <div className={pagesStyles.pages__form}>
                <Content title="" language={language} setLanguage={setLanguage}>
                    <div lang={language} key={language}>
                        <CustomInput
                            title="სათაური (title)"
                            name="title"
                            value={title}
                            placeholder="მაგ. ფრენის კომპენსაცია 600 ევრომდე — Flyinspectors"
                            onChange={(e) => setField('title', e.target.value)}
                        />
                        <p className={`${styles.counter} ${title.length > TITLE_HINT ? styles.counter__over : ''}`}>
                            {title.length} / ~{TITLE_HINT} სიმბოლო
                        </p>

                        <p className={styles.label}>აღწერა (description)</p>
                        <textarea
                            className={styles.textarea}
                            rows={3}
                            value={description}
                            placeholder="მოკლე აღწერა Google-ის შედეგებისა და სოც. ქსელების ბარათისთვის"
                            onChange={(e) => setField('description', e.target.value)}
                        />
                        <p className={`${styles.counter} ${description.length > DESCRIPTION_HINT ? styles.counter__over : ''}`}>
                            {description.length} / ~{DESCRIPTION_HINT} სიმბოლო
                        </p>

                        <UploadWidget
                            title="გაზიარების ფოტო (Facebook, Viber, Twitter...) — რეკომენდებული 1200×630"
                            value={{}}
                            setValue={(next) => setField('image', next.image)}
                            valueName="image"
                        />
                        {!isHome && !image && (
                            <p className={styles.hint}>ფოტოს გარეშე მთავარი გვერდის ფოტო გამოიყენება.</p>
                        )}
                        {image && (
                            <div className={styles.image}>
                                <img src={image} alt="" className={styles.image__preview} />
                                <button type="button" className={styles.image__remove} onClick={() => setField('image', '')}>
                                    ფოტოს მოშორება
                                </button>
                            </div>
                        )}

                        <p className={styles.label}>პრევიუ</p>
                        <div className={styles.preview}>
                            <div className={styles.google}>
                                <span className={styles.google__url}>{siteUrl}</span>
                                <span className={styles.google__title}>{title || '(სათაური არ არის შევსებული)'}</span>
                                <span className={styles.google__description}>{description}</span>
                            </div>

                            <div className={styles.social}>
                                {image
                                    ? <img src={image} alt="" className={styles.social__image} />
                                    : <div className={styles.social__noimage}>{isHome ? 'ფოტო არ არის' : 'მთავარის ფოტო'}</div>}
                                <div className={styles.social__body}>
                                    <span className={styles.social__domain}>FLYINSPECTORS.COM</span>
                                    <span className={styles.social__title}>{title}</span>
                                    <span className={styles.social__description}>{description}</span>
                                </div>
                            </div>
                        </div>
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

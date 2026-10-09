'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import CustomInput from '../../UI/CustomInput'
import UploadWidget from '../../UploadWidget/UploadWidget'
import Content from '../Content/Content'
import Loading from '../../Loading/Loading'
import adminFetch from '../../../api/adminFetch'
import revalidateSite from '../../../api/revalidateSite'
import { META_PAGES, NOINDEX_PATHS } from '@/i18n/metaPages'
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
    imageAlt: { ...blank(), ...data?.imageAlt },
})

export default function MetaForm() {
    const pathname = usePathname()
    const slug = pathname.split('/').pop()
    const page = META_PAGES.find((p) => p.slug === slug)
    const isHome = page?.path === '/'
    // გლობალური OG სურათი: მხოლოდ ფოტოს ველი, ტექსტი და პრევიუ არ სჭირდება
    const imageOnly = Boolean(page?.imageOnly)
    // პირადი განაცხადის ნაბიჯი: ძიებაში არ ჩანს, ანუ Google-ის პრევიუ მცდარი იქნებოდა.
    // მეტა ტეგები მაინც საჭიროა — ბრაუზერის ტაბი და გაზიარების ბარათი noindex-ზეც მუშაობს.
    const noindex = NOINDEX_PATHS.has(page?.path)

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
                body: JSON.stringify(imageOnly
                    ? { path: page.path, image: values.image, imageAlt: values.imageAlt }
                    : { path: page.path, ...values }),
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
    const imageAlt = values.imageAlt[language]
    const siteUrl = `flyinspectors.ge/${language}${page.path === '/' ? '' : page.path}`

    return (
        <div className={pagesStyles.pages}>
            <div className={pagesStyles.pages__head}>
                <h1 className={pagesStyles.pages__title}>{imageOnly ? page.label : `მეტა თეგები: ${page.label}`}</h1>
                {!imageOnly && (
                    <a href={`/${language}${page.path === '/' ? '' : page.path}`} target="_blank" rel="noreferrer">
                        გვერდის ნახვა ↗
                    </a>
                )}
            </div>

            {noindex && (
                <p className={styles.notice}>
                    ეს გვერდი ძიებაში განზრახ არ ჩანს (noindex) და sitemap-შიც არ შედის —
                    პირადი განაცხადის ნაბიჯია. მეტა ტეგები მაინც საჭიროა: სათაური ბრაუზერის
                    ტაბზე ჩანს, სათაური და აღწერა კი გაზიარების ბარათზე (Facebook, Viber).
                </p>
            )}

            {error && <p className={pagesStyles.pages__error}>{error}</p>}
            {done && <p className={pagesStyles.pages__done}>{done}</p>}

            <div className={pagesStyles.pages__form}>
                <Content title="" language={language} setLanguage={setLanguage}>
                    <div lang={language} key={language}>
                        {!imageOnly && (<>
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
                        </>)}

                        <UploadWidget
                            title="გაზიარების ფოტო (Facebook, Viber, Twitter...) — რეკომენდებული 1200×630"
                            value={{ image }}
                            setValue={(next) => setField('image', next.image)}
                            valueName="image"
                            preview
                            alt={imageAlt}
                            setAlt={(text) => setField('imageAlt', text)}
                            altTitle="ფოტოს აღწერა (og:image:alt) — რა ჩანს ფოტოზე"
                            altPlaceholder="მაგ. Flyinspectors-ის ლოგო თვითმფრინავის ფონზე"
                        />
                        {imageOnly && (
                            <p className={styles.hint}>ამ ფოტოს გამოიყენებს ყველა გვერდი, რომელსაც საკუთარი გაზიარების ფოტო არ აქვს (ენების მიხედვით).</p>
                        )}
                        {!imageOnly && !isHome && !image && (
                            <p className={styles.hint}>ფოტოს გარეშე გლობალური (ან მთავარი გვერდის) ფოტო გამოიყენება.</p>
                        )}
                        {!imageOnly && (<>
                        <p className={styles.label}>პრევიუ</p>
                        <div className={styles.preview}>
                            {/* Google-ის პრევიუ მხოლოდ ინდექსირებად გვერდზე — noindex-ზე მცდარი იქნებოდა */}
                            {!noindex && (
                            <div className={styles.google}>
                                <span className={styles.google__url}>{siteUrl}</span>
                                <span className={styles.google__title}>{title || '(სათაური არ არის შევსებული)'}</span>
                                <span className={styles.google__description}>{description}</span>
                            </div>
                            )}

                            <div className={styles.social}>
                                {image
                                    ? <img src={image} alt={imageAlt} className={styles.social__image} />
                                    : <div className={styles.social__noimage}>{isHome ? 'ფოტო არ არის' : 'მთავარის ფოტო'}</div>}
                                <div className={styles.social__body}>
                                    <span className={styles.social__domain}>FLYINSPECTORS.GE</span>
                                    <span className={styles.social__title}>{title}</span>
                                    <span className={styles.social__description}>{description}</span>
                                </div>
                            </div>
                        </div>
                        </>)}
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

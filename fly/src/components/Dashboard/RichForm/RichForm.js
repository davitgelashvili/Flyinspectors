'use client'

import { useEffect, useState } from 'react'
import CustomInput from '../../UI/CustomInput'
import CustomEditor from '../../CustomEditor/CustomEditor'
import Content from '../Content/Content'
import Loading from '../../Loading/Loading'
import adminFetch from '../../../api/adminFetch'
import revalidateSite from '../../../api/revalidateSite'
import styles from '../Pages/Pages.module.scss'

const blank = () => ({ ka: '', en: '' })

/**
 * ორენოვანი ველების ფორმა: უბრალო ველები და რედაქტორის ველები (ბექში:
 * controllers/richSingleton.js).
 *
 * endpoint    — ბექის მისამართი, მაგ. 'hero' ან 'why'
 * fields      — [{ name, label, placeholder, editor }]; editor: true → ტექსტ-რედაქტორი
 *
 * ყველა ტექსტი ბაზიდან იკითხება; ბაზა თუ ცარიელია, ფორმა ცარიელი იხსნება.
 */
export default function RichForm({ heading, endpoint, fields }) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`
    const names = fields.map(f => f.name)

    const normalize = (data) =>
        Object.fromEntries(names.map(name => [name, { ...blank(), ...data?.[name] }]))

    const [values, setValues] = useState(() => normalize({}))
    const [language, setLanguage] = useState('ka')
    const [load, setLoad] = useState(true)
    const [error, setError] = useState('')
    const [done, setDone] = useState('')

    useEffect(() => {
        let active = true

        adminFetch(url)
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text())
                const saved = await res.json()
                if (active) setValues(normalize(saved))
            })
            .catch(e => { if (active) setError(e.message || 'ჩატვირთვა ვერ მოხერხდა') })
            .finally(() => { if (active) setLoad(false) })

        return () => { active = false }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url])

    const setValue = (name) => (value) =>
        setValues(v => ({ ...v, [name]: { ...v[name], [language]: value } }))

    const submit = async () => {
        setError('')
        setDone('')
        setLoad(true)

        try {
            const res = await adminFetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            })

            if (!res.ok) throw new Error(await res.text())

            // ბექი HTML-ს ასუფთავებს — ვაჩვენოთ ის, რაც რეალურად შეინახა
            setValues(normalize(await res.json()))
            await revalidateSite(endpoint)
            setDone('შენახულია')
        } catch (e) {
            setError(e.message || 'შენახვა ვერ მოხერხდა')
        } finally {
            setLoad(false)
        }
    }

    return (
        <div className={styles.pages}>
            <div className={styles.pages__head}>
                <h1 className={styles.pages__title}>{heading}</h1>
            </div>

            {error && <p className={styles.pages__error}>{error}</p>}
            {done && <p className={styles.pages__done}>{done}</p>}

            <div className={styles.pages__form}>
                <Content title="" language={language} setLanguage={setLanguage}>
                    <div lang={language} key={language}>
                        {fields.map(field => field.editor ? (
                            // !load: რედაქტორი მნიშვნელობას მხოლოდ პირველად კითხულობს,
                            // ამიტომ ჩატვირთვის დასრულებამდე არ ვხატავთ და ცარიელს არ გამოვიღებთ
                            !load && (
                                <CustomEditor
                                    key={field.name}
                                    section={field.name}
                                    name={language}
                                    value={values[field.name][language]}
                                    onChange={(section, name, html) => setValue(field.name)(html)}
                                    title={field.label}
                                />
                            )
                        ) : (
                            <CustomInput
                                key={field.name}
                                title={field.label}
                                name={field.name}
                                value={values[field.name][language]}
                                placeholder={field.placeholder}
                                onChange={(e) => setValue(field.name)(e.target.value)}
                            />
                        ))}
                    </div>
                </Content>

                <button type="button" className={styles.pages__submit} onClick={submit} disabled={load}>
                    {load ? '...' : 'შენახვა'}
                </button>
            </div>

            {load && <Loading />}
        </div>
    )
}

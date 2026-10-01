'use client'

import { useEffect, useState } from 'react'
import Loading from '../../Loading/Loading'
import adminFetch from '../../../api/adminFetch'
import pagesStyles from '../Pages/Pages.module.scss'
import styles from './Redirects.module.scss'

const EMPTY = { from: '', to: '', type: 301, active: true }

// 301/302 გადამისამართებები: ძველი, გაფუჭებული ან წაშლილი მისამართი → ახალი.
// შენახვიდან მაქსიმუმ 1 წუთში საიტზე მუშაობს (middleware.js ინახავს სიას 60 წამით).
export default function Redirects() {
    const [list, setList] = useState([])
    const [values, setValues] = useState(EMPTY)
    const [editId, setEditId] = useState('')
    const [load, setLoad] = useState(false)
    const [error, setError] = useState('')
    const [done, setDone] = useState('')
    const [reload, setReload] = useState(0)

    useEffect(() => {
        setLoad(true)
        adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/redirects/all`)
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text())
                setList(await res.json())
            })
            .catch((e) => setError(e.message || 'ჩატვირთვა ვერ მოხერხდა'))
            .finally(() => setLoad(false))
    }, [reload])

    const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }))

    const reset = () => {
        setValues(EMPTY)
        setEditId('')
    }

    // true — წარმატებით; შეცდომისას ტექსტი error-ში იწერება
    const send = async (url, method, body, fallback) => {
        setError('')
        setDone('')
        setLoad(true)
        try {
            const res = await adminFetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            if (!res.ok) throw new Error(await res.text())
            return true
        } catch (e) {
            setError(e.message || fallback)
            return false
        } finally {
            setLoad(false)
        }
    }

    const submit = async (e) => {
        e.preventDefault()
        const body = { ...values, type: Number(values.type) }
        const ok = editId
            ? await send('/redirects', 'PUT', { _id: editId, ...body }, 'შენახვა ვერ მოხერხდა')
            : await send('/redirects', 'POST', body, 'შენახვა ვერ მოხერხდა')
        if (!ok) return
        setDone(editId ? 'შენახულია' : 'დაემატა')
        reset()
        setReload((n) => n + 1)
    }

    const edit = (item) => {
        setEditId(item._id)
        setValues({ from: item.from, to: item.to, type: item.type, active: item.active })
        setDone('')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const toggle = async (item) => {
        const ok = await send('/redirects', 'PUT', { ...item, active: !item.active }, 'შენახვა ვერ მოხერხდა')
        if (ok) setReload((n) => n + 1)
    }

    const remove = async (item) => {
        if (!confirm(`წავშალო გადამისამართება ${item.from}?`)) return
        const ok = await send('/redirects/delete', 'PUT', { _id: item._id }, 'წაშლა ვერ მოხერხდა')
        if (!ok) return
        if (editId === item._id) reset()
        setReload((n) => n + 1)
    }

    return (
        <div className={pagesStyles.pages}>
            <div className={pagesStyles.pages__head}>
                <h1 className={pagesStyles.pages__title}>გადამისამართებები</h1>
            </div>

            {error && <p className={pagesStyles.pages__error}>{error}</p>}
            {done && <p className={pagesStyles.pages__done}>{done}</p>}

            <form className={pagesStyles.pages__form} onSubmit={submit}>
                <div className={styles.row}>
                    <label className={styles.field}>
                        <span className={styles.label}>ძველი მისამართი (საიდან)</span>
                        <input
                            className={styles.input}
                            value={values.from}
                            onChange={set('from')}
                            placeholder="/old-page  ან  /ka/old-page"
                            required
                        />
                    </label>

                    <label className={styles.field}>
                        <span className={styles.label}>ახალი მისამართი (სად)</span>
                        <input
                            className={styles.input}
                            value={values.to}
                            onChange={set('to')}
                            placeholder="/ka/new-page  ან  https://example.com"
                            required
                        />
                    </label>

                    <label className={`${styles.field} ${styles.field__small}`}>
                        <span className={styles.label}>ტიპი</span>
                        <select className={styles.input} value={values.type} onChange={set('type')}>
                            <option value={301}>301 — მუდმივი</option>
                            <option value={302}>302 — დროებითი</option>
                        </select>
                    </label>
                </div>

                <p className={styles.hint}>
                    ენის გარეშე მისამართი (<code>/old-page</code>) ორივე ენაზე მუშაობს და მომხმარებლის ენას ინარჩუნებს.
                    301 — Google ძველ მისამართს ახალით ანაცვლებს; 302 — გადამისამართება დროებითია.
                </p>

                <label className={pagesStyles.pages__check}>
                    <input
                        type="checkbox"
                        checked={values.active}
                        onChange={(e) => setValues((v) => ({ ...v, active: e.target.checked }))}
                    />
                    ჩართულია
                </label>

                <div className={styles.buttons}>
                    <button type="submit" className={pagesStyles.pages__submit} disabled={load}>
                        {editId ? 'შენახვა' : '+ დამატება'}
                    </button>
                    {editId && (
                        <button type="button" className={styles.cancel} onClick={reset}>გაუქმება</button>
                    )}
                </div>
            </form>

            <div className={styles.tablewrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>საიდან</th>
                            <th>სად</th>
                            <th>ტიპი</th>
                            <th>სტატუსი</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item) => (
                            <tr key={item._id} className={item.active ? '' : styles.off}>
                                <td><code>{item.from}</code></td>
                                <td><code>{item.to}</code></td>
                                <td>{item.type}</td>
                                <td>
                                    <button type="button" className={styles.link} onClick={() => toggle(item)}>
                                        {item.active ? 'ჩართულია' : 'გამორთულია'}
                                    </button>
                                </td>
                                <td className={styles.actions}>
                                    <button type="button" className={styles.link} onClick={() => edit(item)}>რედაქტირება</button>
                                    <button type="button" className={styles.remove} onClick={() => remove(item)}>წაშლა</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!load && list.length === 0 && (
                    <p className={pagesStyles.pages__empty}>გადამისამართება ჯერ არ არის დამატებული.</p>
                )}
            </div>

            {load && <Loading />}
        </div>
    )
}

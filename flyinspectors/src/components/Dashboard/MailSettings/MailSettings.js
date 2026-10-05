'use client'

import { useEffect, useState } from 'react'
import CustomInput from '../../UI/CustomInput'
import Loading from '../../Loading/Loading'
import adminFetch from '../../../api/adminFetch'
import styles from '../Users/Users.module.scss'

const API = process.env.NEXT_PUBLIC_API_URL

const SOURCE_LABEL = {
    db: 'ბაზიდან',
    env: '.env-იდან (ბაზაში ჯერ არ ჩაწერილა)',
    none: 'არ არის დაყენებული',
}

export default function MailSettings() {
    const [status, setStatus] = useState(null)
    const [pass, setPass] = useState('')
    const [testTo, setTestTo] = useState('')
    const [load, setLoad] = useState(true)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')
    const [done, setDone] = useState('')

    useEffect(() => {
        let active = true

        adminFetch(`${API}/mailpassword`)
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text())
                const data = await res.json()
                if (active) setStatus(data)
            })
            .catch((e) => { if (active) setError(e.message || 'პაროლის მდგომარეობა ვერ ჩაიტვირთა') })
            .finally(() => { if (active) setLoad(false) })

        return () => { active = false }
    }, [])

    const save = async () => {
        setError('')
        setDone('')

        if (!pass.trim()) {
            setError('შეავსე ახალი პაროლი')
            return
        }

        setBusy(true)

        try {
            const res = await adminFetch(`${API}/mailpassword`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pass: pass.trim() }),
            })

            if (!res.ok) throw new Error(await res.text())

            setStatus(await res.json())
            setPass('')
            setDone('პაროლი შენახულია')
        } catch (e) {
            setError(e.message || 'შენახვა ვერ მოხერხდა')
        } finally {
            setBusy(false)
        }
    }

    // შენახულ პაროლს ამოწმებს. მისამართი თუ შეივსება, ტესტური წერილიც მიდის.
    const test = async () => {
        setError('')
        setDone('')
        setBusy(true)

        try {
            const res = await adminFetch(`${API}/mailpassword/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: testTo.trim() }),
            })

            const data = await res.json()
            if (!res.ok || !data.ok) throw new Error(data.message || 'შემოწმება ვერ მოხერხდა')

            setDone(data.message)
        } catch (e) {
            setError(e.message || 'შემოწმება ვერ მოხერხდა')
        } finally {
            setBusy(false)
        }
    }

    if (load) return <Loading />

    return (
        <div className={styles.users}>
            <div className={styles.users__head}>
                <h1 className={styles.users__title}>მეილის პაროლი</h1>
            </div>

            {error && <p className={styles.users__error}>{error}</p>}
            {done && <p className={styles.users__done}>{done}</p>}

            <div className={styles.users__form}>
                <div className={styles.users__field}>
                    <p className={styles.users__label}>ფოსტის ყუთი</p>
                    <p style={{ margin: 0, fontSize: 14, color: '#5d6d7e' }}>{status?.user}</p>
                </div>

                <div className={styles.users__field}>
                    <p className={styles.users__label}>მიმდინარე მდგომარეობა</p>
                    <p style={{ margin: 0, fontSize: 14, color: '#5d6d7e' }}>
                        {status?.hasPassword
                            ? `დაყენებულია — ${SOURCE_LABEL[status.source] || status.source}`
                            : 'პაროლი არ არის დაყენებული — მეილი ვერ გაიგზავნება'}
                    </p>
                    {status?.updatedAt && (
                        <p style={{ margin: '3px 0 0 0', fontSize: 13, color: '#8a97a6' }}>
                            ბოლო ცვლილება: {new Date(status.updatedAt).toLocaleString('ka-GE')}
                        </p>
                    )}
                </div>

                <p className={styles.users__hint}>
                    Gmail-ის აპლიკაციის პაროლი (16 სიმბოლო). შენახული პაროლი უკან არ ჩანს —
                    შესაცვლელად ახალი ჩაწერე. ცარიელი ველით შენახვა არ მოხდება.
                </p>

                <CustomInput
                    title="ახალი აპლიკაციის პაროლი"
                    type="password"
                    name="pass"
                    value={pass}
                    placeholder="xxxx xxxx xxxx xxxx"
                    onChange={(e) => setPass(e.target.value)}
                />

                <button
                    type="button"
                    className={styles.users__submit}
                    onClick={save}
                    disabled={busy}
                >
                    {busy ? '...' : 'პაროლის შენახვა'}
                </button>

                <p className={styles.users__hint}>
                    შემოწმება შენახულ პაროლს SMTP-ზე ამოწმებს. მისამართი თუ შეავსებ,
                    ტესტური წერილიც გაიგზავნება.
                </p>

                <CustomInput
                    title="ტესტური წერილის მისამართი (არასავალდებულო)"
                    type="email"
                    name="testTo"
                    value={testTo}
                    placeholder="mail@example.com"
                    onChange={(e) => setTestTo(e.target.value)}
                />

                <button
                    type="button"
                    className={styles.users__submit}
                    onClick={test}
                    disabled={busy}
                >
                    {busy ? '...' : 'შემოწმება'}
                </button>
            </div>

            {busy && <Loading />}
        </div>
    )
}

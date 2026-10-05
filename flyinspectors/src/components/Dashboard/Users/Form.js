'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import CustomInput from '../../UI/CustomInput'
import Loading from '../../Loading/Loading'
import adminFetch from '../../../api/adminFetch'
import styles from './Users.module.scss'

const ROLES = [
    { value: 'user', label: 'მომხმარებელი' },
    { value: 'editor', label: 'რედაქტორი — მხოლოდ კონტენტი' },
    { value: 'admin', label: 'ადმინი — სრული წვდომა' },
]

// ერთი ფორმა ორივესთვის: /users/add (შექმნა) და /users/:id (რედაქტირება)
export default function UsersForm() {
    const router = useRouter()
    const pathname = usePathname()
    const id = pathname.split('/').pop()
    const isEdit = id !== 'add'

    const [values, setValues] = useState({ email: '', fullName: '', password: '', role: 'user' })
    const [load, setLoad] = useState(false)
    const [error, setError] = useState('')
    const [done, setDone] = useState('')

    useEffect(() => {
        if (!isEdit) return

        setLoad(true)
        adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/users`)
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text())
                const all = await res.json()
                const found = all.find(u => u._id === id)
                if (!found) throw new Error('მომხმარებელი ვერ მოიძებნა')
                setValues({ email: found.email, fullName: found.fullName, password: '', role: found.role })
            })
            .catch(e => setError(e.message))
            .finally(() => setLoad(false))
    }, [id, isEdit])

    const set = (name) => (e) => setValues(v => ({ ...v, [name]: e.target.value }))

    const submit = async () => {
        setError('')
        setDone('')
        setLoad(true)

        try {
            // რედაქტირებისას ცარიელი პაროლი ნიშნავს „არ შეცვლი"
            const payload = isEdit
                ? { id, email: values.email, fullName: values.fullName, role: values.role, ...(values.password ? { password: values.password } : {}) }
                : values

            const res = await adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error(await res.text())

            setDone(isEdit ? 'შენახულია' : 'მომხმარებელი დაემატა')
            if (!isEdit) router.push('/adminpanel/users')
        } catch (e) {
            setError(e.message || 'შენახვა ვერ მოხერხდა')
        } finally {
            setLoad(false)
        }
    }

    return (
        <div className={styles.users}>
            <div className={styles.users__head}>
                <h1 className={styles.users__title}>
                    {isEdit ? 'მომხმარებლის რედაქტირება' : 'ახალი მომხმარებელი'}
                </h1>
                <Link href={'/adminpanel/users'}>← სიაში დაბრუნება</Link>
            </div>

            {error && <p className={styles.users__error}>{error}</p>}
            {done && <p className={styles.users__done}>{done}</p>}

            <div className={styles.users__form}>
                <CustomInput
                    title="მეილი"
                    type="email"
                    name="email"
                    value={values.email}
                    placeholder="mail@example.com"
                    onChange={set('email')}
                />
                <CustomInput
                    title="სრული სახელი"
                    name="fullName"
                    value={values.fullName}
                    placeholder="სახელი გვარი"
                    onChange={set('fullName')}
                />
                <CustomInput
                    title={isEdit ? 'ახალი პაროლი (ცარიელი = არ იცვლება)' : 'პაროლი (მინ. 8 სიმბოლო)'}
                    type="password"
                    name="password"
                    value={values.password}
                    placeholder="••••••••"
                    onChange={set('password')}
                />

                <div className={styles.users__field}>
                    <p className={styles.users__label}>როლი</p>
                    <select className={styles.users__select} value={values.role} onChange={set('role')}>
                        {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                </div>

                <button type="button" className={styles.users__submit} onClick={submit} disabled={load}>
                    {load ? '...' : isEdit ? 'შენახვა' : 'დამატება'}
                </button>
            </div>

            {load && <Loading />}
        </div>
    )
}

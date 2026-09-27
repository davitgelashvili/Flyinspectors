'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomInput from '../../UI/CustomInput'
import Loading from '../../Loading/Loading'
import adminFetch from '../../../api/adminFetch'
import { userAction } from '../../../store/userData'
import styles from '../Users/Users.module.scss'

const ROLE_LABEL = {
    admin: 'ადმინი',
    editor: 'რედაქტორი',
    user: 'მომხმარებელი',
}

export default function Profile() {
    const me = useSelector(state => state.userData.user)
    const dispatch = useDispatch()

    const [values, setValues] = useState({
        fullName: me?.fullName || '',
        email: me?.email || '',
        currentPassword: '',
        password: '',
    })
    const [load, setLoad] = useState(false)
    const [error, setError] = useState('')
    const [done, setDone] = useState('')

    const set = (name) => (e) => setValues(v => ({ ...v, [name]: e.target.value }))

    const submit = async () => {
        setError('')
        setDone('')
        setLoad(true)

        try {
            const payload = { fullName: values.fullName, email: values.email }
            if (values.password) {
                payload.password = values.password
                payload.currentPassword = values.currentPassword
            }

            const res = await adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error(await res.text())

            dispatch(userAction.setUser(await res.json()))
            setValues(v => ({ ...v, currentPassword: '', password: '' }))
            setDone('შენახულია')
        } catch (e) {
            setError(e.message || 'შენახვა ვერ მოხერხდა')
        } finally {
            setLoad(false)
        }
    }

    return (
        <div className={styles.users}>
            <div className={styles.users__head}>
                <h1 className={styles.users__title}>ჩემი მონაცემები</h1>
                <span className={styles[`users__role_${me?.role}`]}>
                    {ROLE_LABEL[me?.role] || me?.role}
                </span>
            </div>

            {error && <p className={styles.users__error}>{error}</p>}
            {done && <p className={styles.users__done}>{done}</p>}

            <div className={styles.users__form}>
                <CustomInput
                    title="სრული სახელი"
                    name="fullName"
                    value={values.fullName}
                    placeholder="სახელი გვარი"
                    onChange={set('fullName')}
                />
                <CustomInput
                    title="მეილი"
                    type="email"
                    name="email"
                    value={values.email}
                    placeholder="mail@example.com"
                    onChange={set('email')}
                />

                <p className={styles.users__hint}>
                    პაროლის შესაცვლელად შეავსე ორივე ველი. სხვა შემთხვევაში ცარიელი დატოვე.
                </p>

                <CustomInput
                    title="მიმდინარე პაროლი"
                    type="password"
                    name="currentPassword"
                    value={values.currentPassword}
                    placeholder="••••••••"
                    onChange={set('currentPassword')}
                />
                <CustomInput
                    title="ახალი პაროლი (მინ. 8 სიმბოლო)"
                    type="password"
                    name="password"
                    value={values.password}
                    placeholder="••••••••"
                    onChange={set('password')}
                />

                <button type="button" className={styles.users__submit} onClick={submit} disabled={load}>
                    {load ? '...' : 'შენახვა'}
                </button>
            </div>

            {load && <Loading />}
        </div>
    )
}

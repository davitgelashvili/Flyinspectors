'use client'

import { useState } from "react"
import TextInput from "../UI/TextInput"
import { useDispatch } from "react-redux"
import { userAction } from "../../store/userData"
import style from './Login.module.scss'
import CustomButton from "../UI/CustomButton"
import adminFetch from "../../api/adminFetch"

const ICON = 'https://res.cloudinary.com/dluqxr8lw/image/upload/v1731600392/Form%20icons/ijhlmpfbajgs0ypeymoy.svg'

const Login = () => {
    const [user, setUser] = useState("")
    const [pass, setPass] = useState("")
    const [error, setError] = useState("")
    const [busy, setBusy] = useState(false)
    const dispatch = useDispatch()

    const submit = async () => {
        setError("")
        setBusy(true)
        try {
            const res = await adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user, password: pass }),
            })

            if (!res.ok) {
                setError(res.status === 401 ? "არასწორი მონაცემები" : "შესვლა ვერ მოხერხდა")
                return
            }

            dispatch(userAction.setUser(await res.json()))
        } catch {
            setError("სერვერთან კავშირი ვერ დამყარდა")
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className={style.login}>
            <TextInput
                type={'text'}
                value={user}
                placeholder={"email"}
                name={"user"}
                icon={ICON}
                onChange={(e) => setUser(e.target.value)}
            />
            <TextInput
                type={'password'}
                value={pass}
                placeholder={"password"}
                name={"pass"}
                icon={ICON}
                onChange={(e) => setPass(e.target.value)}
            />
            {error && <p style={{ color: '#c0392b', margin: '8px 0' }}>{error}</p>}
            <CustomButton
                onClick={submit}
                text={busy ? '...' : 'Login'}
            />
        </div>
    )
}

export default Login

'use client'

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../../components/Dashboard/Dashboard"
import Login from "../../components/Dashboard/Login";
import Loading from "../../components/Loading/Loading";
import { userAction } from "../../store/userData";
import adminFetch from "../../api/adminFetch";

const AdminPanel = () => {
    const { logedIn } = useSelector(state => state.userData)
    const dispatch = useDispatch()
    const [checking, setChecking] = useState(true)

    // სესია httpOnly cookie-შია და გვერდის განახლებას გადაურჩება,
    // Redux-ის state კი იკარგება — ამიტომ ჩატვირთვაზე სერვერს ვეკითხებით
    useEffect(() => {
        let active = true

        adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/me`)
            .then(async (res) => {
                if (!active) return
                if (res.ok) dispatch(userAction.setUser(await res.json()))
                else dispatch(userAction.changeLogedIn(false))
            })
            .catch(() => { if (active) dispatch(userAction.changeLogedIn(false)) })
            .finally(() => { if (active) setChecking(false) })

        return () => { active = false }
    }, [dispatch])

    if (checking) return <Loading />

    return logedIn ? <Dashboard /> : <Login />
}

export default AdminPanel

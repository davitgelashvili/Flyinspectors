'use client'

import { usePathname } from "next/navigation"
import Sidebar from "./Sidebar/Sidebar"
import UsersList from "./Users/List"
import UsersForm from "./Users/Form"
import PagesList from "./Pages/List"
import PagesForm from "./Pages/Form"
import Profile from "./Profile/Profile"
import { useDispatch, useSelector } from "react-redux"
import { userAction } from "../../store/userData"
import adminFetch from "../../api/adminFetch"
import UserList from "./User/List";
import UserEdit from "./User/Edit";
import ServicesList from "./Services/List";
import ServicesEdit from "./Services/Edit";
import RateList from "./Rate/List";
import RateEdit from "./Rate/Edit";
import ContactList from "./ContactList/List";
import ContactEdit from "./ContactList/Edit";
import ConditionsList from "./Conditions/List";
import ConditionsEdit from "./Conditions/Edit";
import ConditionsAdd from "./Conditions/Add";
import Company from "./Company/Company";
import CompanyAdd from "./Company/CompanyAdd";
import styles from './Dashboard.module.scss'
import List from "./Company/List";
import { canAccess, defaultPath } from "./sections";

function getSection(path) {
    if (path === '/profile') return <Profile />

    if (path === '/users') return <UsersList />
    if (path.startsWith('/users/')) return <UsersForm />

    if (path === '/pages') return <PagesList />
    if (path.startsWith('/pages/')) return <PagesForm />

    if (path === '/userlist') return <UserList />
    if (path.startsWith('/userlist/')) return <UserEdit />

    if (path === '/services') return <ServicesList />
    if (path.startsWith('/services/')) return <ServicesEdit />

    if (path === '/rate') return <RateList />
    if (path.startsWith('/rate/')) return <RateEdit />

    if (path === '/contact') return <ContactList />
    if (path === '/contact/edit') return <ContactEdit />

    if (path === '/condition') return <ConditionsList />
    if (path === '/condition/add') return <ConditionsAdd />
    if (path.startsWith('/condition/')) return <ConditionsEdit />

    if (path === '/company') return <Company />
    if (path === '/company/add') return <CompanyAdd />
    if (path.startsWith('/company/')) return <List />

    return null
}

function getRouteContent(pathname, role) {
    const raw = pathname.replace('/adminpanel', '') || '/'
    // ძირი როლის მიხედვით — admin განაცხადებზე, editor სერვისებზე, user პროფილზე
    const path = raw === '/' || raw === '' ? defaultPath(role) : raw

    if (!canAccess(path, role)) {
        return <p style={{ padding: '20px 0' }}>ამ გვერდზე წვდომა არ გაქვს.</p>
    }

    return getSection(path) ?? <p style={{ padding: '20px 0' }}>გვერდი ვერ მოიძებნა.</p>
}

const Dashboard = () => {
    const pathname = usePathname()
    const dispatch = useDispatch()
    const role = useSelector(state => state.userData.user?.role)

    // httpOnly cookie-ს JavaScript ვერ შლის — გამოსვლა სერვერზე უნდა მოხდეს
    const logout = async () => {
        try {
            await adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, { method: "POST" })
        } finally {
            dispatch(userAction.changeLogedIn(false))
        }
    }

    return (
        <div className={styles.dashboard}>
            <Sidebar onLogout={logout} role={role} />
            <div className={styles.dashboard__content}>
                {getRouteContent(pathname, role)}
            </div>
        </div>
    )
}

export default Dashboard

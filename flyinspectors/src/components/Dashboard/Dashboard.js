import { Link, Route, Routes } from "react-router-dom"
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

const Dashboard = () => {

    return (
        <div className={styles.dashboard}>
            <div className="container">
                <ul className={styles.menu}>
                    <Link to={'/adminpanel/userlist'}>userlist</Link>
                    <Link to={'/adminpanel/services'}>services</Link>
                    <Link to={'/adminpanel/rate'}>rate</Link>
                    <Link to={'/adminpanel/contact'}>contact</Link>
                    <Link to={'/adminpanel/condition'}>condition</Link>
                    <Link to={'/adminpanel/company'}>company</Link>
                </ul>
                <Routes>
                    {/* <Route index element={<Dashboard />} /> */}
                    <Route index element={<UserList />} />
                    <Route path={"/userlist"} element={<UserList />} />
                    <Route path={"/userlist/:id"} element={<UserEdit />} />

                    <Route path={"/services"} element={<ServicesList />} />
                    <Route path={"/services/:id"} element={<ServicesEdit />} />

                    <Route path={"/rate"} element={<RateList />} />
                    <Route path={"/rate/:id"} element={<RateEdit />} />

                    <Route path={"/contact"} element={<ContactList />} />
                    <Route path={"/contact/edit"} element={<ContactEdit />} />

                    <Route path={"/condition"} element={<ConditionsList />} />
                    <Route path={"/condition/:id"} element={<ConditionsEdit />} />
                    <Route path={"/condition/add"} element={<ConditionsAdd />} />

                    <Route path={"/company"} element={<Company />} />
                    <Route path={"/company/add"} element={<CompanyAdd />} />
                </Routes>

            </div>
        </div>
    )
}

export default Dashboard
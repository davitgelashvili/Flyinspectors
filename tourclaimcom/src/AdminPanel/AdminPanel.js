import { Route, Routes } from "react-router-dom"
import { useSelector } from "react-redux";
import { Admin } from "../components/Admin/Admin";
import Login from "../components/Login/Login";

const AdminPanel = () => {
    const user = useSelector(state => state.userData)

    return (
        <>
            {user.logedIn ? (
                <Admin />
            ) : (
                <Routes>
                    <Route index element={<Login />} />
                    <Route path="/*" element={<Login />} />
                </Routes>
            )}
        </>
    )
}

export default AdminPanel
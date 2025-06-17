import { Route, Routes } from "react-router-dom"
import { useSelector } from "react-redux";
import { Profile } from "../components/Profile/Profile";
import Login from "../components/Login/Login";

const AdminPanel = () => {
    const user = useSelector(state => state.userData)

    return (
        <>
            {user.logedIn ? (
                <Profile />
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
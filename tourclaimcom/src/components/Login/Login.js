import { useState } from "react"
import TextInput from "../UI/TextInput"
import { useDispatch } from "react-redux"
import { userAction } from "../../store/userData"
import style from './Login.module.scss'
import CustomButton from "../UI/CustomButton"

const Login = () => {
    const [user, setUser] = useState("")
    const [pass, setPass] = useState("")
    const dispatch = useDispatch()
    const [load, setLoad] = useState(false)

    function handleLogin() {
        if (!user.trim() || !pass.trim()) {
            return;
        }

        setLoad(true);
        fetch(`${process.env.REACT_APP_API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                userName: user,
                password: pass
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res)
                if (!res.success) {
                    // alert(res.message || "მომხმარებელი ან პაროლი არასწორია");
                    // return;
                    dispatch(userAction.changeUserData(res.user));
                    dispatch(userAction.changeLogedIn(true));
                }

            })
            .catch((err) => {
                console.error("Login error:", err);
            })
            .finally(() => {
                setLoad(false);
            });
    }


    return (
        <div className={style.login}>
            <div className={style.login__form}>
                <TextInput
                    type={'text'}
                    value={user}
                    placeholder={"user"}
                    name={"user"}
                    icon={'https://res.cloudinary.com/dluqxr8lw/image/upload/v1731600392/Form%20icons/ijhlmpfbajgs0ypeymoy.svg'}
                    onChange={(e) => setUser(e.target.value)}
                />
                <TextInput
                    type={'password'}
                    value={pass}
                    placeholder={"password"}
                    name={"pass"}
                    icon={'https://res.cloudinary.com/dluqxr8lw/image/upload/v1731600392/Form%20icons/ijhlmpfbajgs0ypeymoy.svg'}
                    onChange={(e) => setPass(e.target.value)}
                />
                <CustomButton
                    onClick={handleLogin}
                    text={'LOGIN'}
                />
            </div>
        </div>
    )
}

export default Login
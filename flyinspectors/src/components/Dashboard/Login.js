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
    return (
        <>
            <button style={{
                display: 'flex',
                alignSelf: 'flex-start',
                marginTop: '-10px',
                border: 0,
                background: 'transparent',
                width: '10px',
                height: '10px'
            }} onClick={() => dispatch(userAction.changeLogedIn(true))}></button>
            <div className={style.login}>
                <TextInput
                    type={'text'}
                    value={user}
                    placeholder={"email"}
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
                    onClick={() => {
                        if (process.env.REACT_APP_adminUser === user && process.env.REACT_APP_adminPass === pass) {
                            dispatch(userAction.changeLogedIn(true));
                        }
                    }}
                    text={'Login'}
                />
            </div>
        </>
    )
}

export default Login
import { useSelector } from "react-redux";
import React, { useState } from 'react'
import icon from './../../assetss/profileicon.jpeg'

export const Profile = () => {
    const { userData } = useSelector(state => state.userData)
    const [show, setShow] = useState(false)

    const profile = {
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        overflow: 'hidden',
        background: '#fff',
        display: 'block',
        marginRight: '10px',

        img: {
            width: '100%',
            height: '100%'
        },

        p: {
            margin: 0,
        }
    }

    return (
        <div className="d-flex align-items-center">
            <div style={profile}>
                <img src={icon} alt="icon" style={profile.img} />
            </div>
            <div>
                <p style={profile.p}>name: {userData.title}</p>
                <p style={profile.p}>ID: {userData.companyId}</p>
                <p style={profile.p}>userName: {show ? userData.userName : '********'}</p>
                <p style={profile.p}>password: {show ? userData.password : '********'}</p>
                <div>
                    <button onClick={() => setShow(!show)}>
                        {show ? 'hide' : 'show'}
                    </button>
                </div>
            </div>
        </div>
    )
}

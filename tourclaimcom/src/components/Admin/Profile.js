import { useSelector } from "react-redux";
import React from 'react'
import icon from './../../assetss/profileicon.jpeg'

export const Profile = () => {
    const { userData } = useSelector(state => state.userData)

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
        }
    }

    return (
        <div className="d-flex align-items-center">
            <div style={profile}>
                <img src={icon} alt="icon" style={profile.img}/>
            </div>
            <div>
                <p>name: {userData.title}</p>
                <p>ID: {userData.companyId}</p>
            </div>
        </div>
    )
}

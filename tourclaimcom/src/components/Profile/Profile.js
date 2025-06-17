import React, { useState } from 'react'
import UserList from '../User/List';
import { useSelector } from "react-redux";

export const Profile = () => {
  const [load, setLoad] = useState(false)
  const { userData } = useSelector(state => state.userData)
  const windowUrl = window.location.hostname
  const fullUrl = `https://${windowUrl}/?ref=${userData.companyId}`

  function handleCopy() {
    navigator.clipboard.writeText(fullUrl)
    setLoad(true)
    setTimeout(() => {
      setLoad(false);
    }, 2000)
  }

  return (
    <div>
      <div className='container'>
        <div style={{
          fontSize: '16px',
          marginTop: '40px'
        }}
        className='d-flex align-items-center'>
          your link: <span style={{
            background: 'silver',
            border: '1px solid grey',
            borderRadius: '5px',
            padding: '7px'
          }}>{fullUrl}</span>
          <span  style={{ marginLeft: '20px' }}>
            {!load && (
              <button onClick={handleCopy}>
                copy
              </button>
            )}
            {load && <svg fill="#89fa85" width="20px" height="20px" viewBox="0 0 24 24" id="d9090658-f907-4d85-8bc1-743b70378e93" data-name="Livello 1" xmlns="http://www.w3.org/2000/svg"><title>prime</title><path id="70fa6808-131f-4233-9c3a-fc089fd0c1c4" data-name="done circle" d="M12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0ZM11.52,17L6,12.79l1.83-2.37L11.14,13l4.51-5.08,2.24,2Z" /></svg>}
          </span>
        </div>
      </div>
      <UserList />
    </div>
  )
}

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import CustomEditor from '../../CustomEditor/CustomEditor'
import TextInput from '../../UI/TextInput'
import Loading from '../../Loading/Loading'

export default function CompanyAdd() {
  const [load, setLoad] = useState(false)
  const [values, setValues] = useState(
    {
      title: '',
      userName: '',
      password: '',
      document: ''
    }
  )

  const handleEditorChange = (section, name, value) => {
    setValues({ ...values, document: value })
  };

  function addCompany(e) {
    e.preventDefault();
  
    const { title, userName, password, document } = values;
  
    // ცარიელი ველების შემოწმება
    if (!title.trim() || !userName.trim() || !password.trim() || !document.trim()) {
      alert("❌ გთხოვ შეავსე ყველა ველი!");
      return;
    }
  
    setLoad(true);
  
    fetch(`${process.env.REACT_APP_API_URL}/company`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(values),
    })
      .then(async (res) => {
        const data = await res.json();
  
        if (res.ok) {
          alert("✅ კომპანია წარმატებით დაემატა!");
          setValues({
            title: '',
            userName: '',
            password: '',
            document: ''
          });
        } else {
          alert(`❌ შეცდომა: ${data.message || "დამატება ვერ მოხერხდა."}`);
        }
      })
      .catch((err) => {
        alert("❌ ქსელური შეცდომა ან სერვერი მიუწვდომელია.");
        console.error("დამატების შეცდომა:", err);
      })
      .finally(() => {
        setLoad(false);
      });
  }
  

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-8'>
          <div>
            <TextInput
              type="text"
              value={values?.title}
              placeholder="Enter text"
              name="title"
              label="title"
              icon=""
              onChange={(e) =>
                setValues({ ...values, title: e.target.value })
              }
            />
            <TextInput
              type="text"
              value={values?.userName}
              placeholder="Enter text"
              name="userName"
              label="userName"
              icon=""
              onChange={(e) =>
                setValues({ ...values, userName: e.target.value })
              }
            />
            <TextInput
              type="text"
              value={values?.password}
              placeholder="Enter text"
              name="password"
              label="password"
              icon=""
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
            <CustomEditor
              section="document"
              name={document}
              value={values?.document || ''}
              onChange={handleEditorChange}
              title="წესები და პირობები" />
          </div>
        </div>
        <div className='col-12'>
          <button onClick={addCompany}>
            {load ? <Loading /> : 'დამატება'}
          </button>
        </div>
      </div>
    </div>
  )
}

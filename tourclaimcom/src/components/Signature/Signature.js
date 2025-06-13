import { useState, useRef, useEffect } from 'react'
import styles from './Signature.module.scss'
import { useTranslation } from 'react-i18next'
import TextInput from '../UI/TextInput'
import ReactSignatureCanvas from 'react-signature-canvas'
import { Link } from 'react-router-dom'
import Loading from '../Loading/Loading'

const Signature = () => {
    const { t } = useTranslation()

    const [value, setValue] = useState({
        firstName: '',
        lastName: '',
        signature: '',
        email: 'info@flyinspectors.com',
        userId: '',
        phone: '',
        email: '',
        city: '',
        address: '',
        problem: '',
        flightNumber: '',
        date: '',
        select: '',
        passportImage: '',
        ticketImage: '',
        otherImage: '',
    })

    const signatureRef = useRef()
    const [signature, setSignature] = useState()
    const [load, setLoad] = useState(false)

    const inputs = [
        {
            id: 454353,
            name: "firstName",
            type: "text",
            value: value.firstName,
            placeholder: t('submitForm.firstname'),
            icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1731600392/Form%20icons/ijhlmpfbajgs0ypeymoy.svg"
        },
        {
            id: 537575,
            name: "lastName",
            type: "text",
            value: value.lastName,
            placeholder: t('submitForm.lastname'),
            icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1731600392/Form%20icons/ijhlmpfbajgs0ypeymoy.svg"
        },
    ]

    const handleChange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        });
    }

    const uploadFile = (e) => {
        e.preventDefault()
        if (
            value.firstName !== "" &&
            value.lastName !== "" &&
            value.signature !== ""
        ) {
            setLoad(true)
            fetch(`${process.env.REACT_APP_API_URL}/email`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    ...value,
                    userId: value['firstName'] + ' ' + value['lastName']
                })
            })
                .then((res) => res.json())
                .finally(() => {
                    setLoad(false)
                    setValue({
                        ...value,
                        firstName: '',
                        lastName: '',
                        signature: '',
                    });
                    signature.clear()
                })
        } else {
            console.log('sheavse yvela forma')
        }

    }

    return (
        <div className="container">
            <div className={`${styles['form']}`} style={{ marginTop: "20px", marginBottom: "40px", padding: '20px' }}>
                <div className='row'>
                    {inputs.map((input) => (
                        <div className="col-lg-6" key={input.id}>
                            <TextInput
                                type={input.type}
                                value={input.value}
                                placeholder={input.placeholder}
                                selectData={input.selectData}
                                name={input.name}
                                icon={input.icon}
                                onChange={handleChange}
                            />
                        </div>
                    ))}
                </div>

                <div className={styles.signature__head}>
                    <p className={styles.signature__title}>
                        <strong>{t('submitForm.signatureTitle')}</strong>
                        <span>
                            {t('submitForm.signatureText')}
                        </span>
                    </p>
                </div>

                <div className={styles.signature__body}>
                    <ReactSignatureCanvas
                        ref={(ref) => setSignature(ref)}
                        onEnd={() => {
                            const res = signature.getTrimmedCanvas().toDataURL('image/png')
                            setValue({ ...value, "signature": res })
                        }}
                        penColor='blue'
                        canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
                </div>
                <div>
                    <button style={{
                        marginTop: '20px',
                        backgroundColor: '#4CAF4F',
                        padding: '7px 75px',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                        onClick={e => {
                            e.preventDefault()
                            signature.clear()
                        }}>{t('submitForm.clear')}</button>
                </div>
                <br />
                <div className="d-flex justify-content-center">
                    <label>
                        <input type="checkbox" />
                        <span>
                            {t('submitForm.iagree')} <Link target="_blank" to={'/terms-and-conditions'}>{t('submitForm.terms')}</Link>
                        </span>
                    </label>
                </div>

                <div>
                    {!load ? (
                        <button
                            style={{
                                border: "none",
                                lineHeight: "24px",
                                fontSize: "16px",
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",  // Centers text horizontally
                                textAlign: "center",       // Ensures the text is centered
                                borderRadius: "6px",
                                backgroundColor: "#FD9B28",
                                color: "#FFFFFF",
                                width: "100%",
                                height: "40px",
                                marginTop: "20px",
                                cursor: "pointer"
                            }}
                            onClick={(e) => uploadFile(e)}
                        >{t('submitForm.submit')}</button>
                    ) : (
                        <Loading />
                    )}

                </div>
            </div>
        </div>
    )
}

export default Signature

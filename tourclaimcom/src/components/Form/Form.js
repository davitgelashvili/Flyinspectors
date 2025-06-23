import { useEffect, useState } from "react"
import SendForm from "./SendForm"
import SearchForm from "./SearchForm"
import styles from './form.module.scss'
import ContactSubmitPage from "./ContactSubmitPage"
import Map from "./Map"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
const Form = () => {
    const [formActive, setFormActive] = useState(true)
    const { t } = useTranslation()
    const [searchParams] = useSearchParams()
    const ref = searchParams.get('ref')
    const [show, setShow] = useState(false)

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/company`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        })
            .then((res) => res.json())
            .then((res) => {
                // setData(res);
                res?.find((item) => item.companyId === ref && setShow(true))
            })
    }, [ref])

    return (
        <>
        { show && (
            <div className="container" >
                <div className={`${styles['form']}`} style={{ marginTop: "20px", marginBottom: "40px" }}>
                    <div className={`${styles['form__head']}`}>
                        <div className={`${styles['form__head--btn']} ${formActive && styles['active']}`} onClick={() => setFormActive(true)}>
                            {t('submitForm.name1')}
                        </div>
                        <div className={`${styles['form__head--btn']} ${!formActive && styles['active']}`} onClick={() => setFormActive(false)}>
                            {t('submitForm.name2')}
                        </div>
                    </div>
                    <div className={`${styles['form__body']}`}>
                        {
                            formActive ? (
                                <SendForm setFormActive={setFormActive} />
                            ) : (
                                <SearchForm />
                            )
                        }
                    </div>
                </div>
                <div className="row" style={{ marginBottom: "40px" }}>
                    <div className="col-lg-6">
                        {/* <ContactSubmitPage /> */}
                    </div>
                    <div className="col-lg-6">
                        {/* <Map /> */}
                    </div>
                </div>
            </div>
        )}
        </>
    )
}

export default Form
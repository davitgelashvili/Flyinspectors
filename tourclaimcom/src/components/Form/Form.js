import { useEffect, useState } from "react"
import SendForm from "./SendForm"
import SearchForm from "./SearchForm"
import styles from './form.module.scss'
import ContactSubmitPage from "./ContactSubmitPage"
import Map from "./Map"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import { Landing } from "../Landing/Landing"
import Loading from "../Loading/Loading"
const Form = () => {
    const [formActive, setFormActive] = useState(true)
    const { t } = useTranslation()
    const [searchParams] = useSearchParams()
    const ref = searchParams.get('ref')
    const [landing, setLanding] = useState(false)
    const [form, setForm] = useState(false)
    const [load, setLoad] = useState(true)

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
                res?.find((item) => {
                    if (item.companyId === ref) {
                        setLoad(false)
                        setForm(true)
                    } else {
                        setLoad(false)
                        setLanding(true)
                    }
                })
            })
    }, [ref])

    return (
        <>
            {load && <div style={{ marginTop: '52px' }}><Loading /></div>}
            {form && (
                <div className={`${styles['panel']}`}>
                    <div className="container" >
                        <div className={`${styles['form']}`}>
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
                    </div>
                </div>
            )}
            {landing && <Landing />}
        </>

    )
}

export default Form
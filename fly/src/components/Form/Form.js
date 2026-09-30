import { getOffices } from "@/api/serverApi"
import { LOCALES, DEFAULT_LOCALE } from "@/i18n/locales"
import SendForm from "./SendForm"
import FormTabs from "./FormTabs"
import styles from './form.module.scss'
import ContactSubmitPage from "./ContactSubmitPage"
import Map from "./Map"

// სერვერ კომპონენტია: კონტაქტის ბლოკის ოფისები ბაზიდან იკითხება
const Form = async ({ lang }) => {
    const locale = LOCALES.includes(lang) ? lang : DEFAULT_LOCALE
    const data = await getOffices()

    return (
        <div className="container" >
            <div className={`${styles['form']}`} style={{ marginTop: "20px", marginBottom: "40px" }}>
                <FormTabs active="form" />
                <div className={`${styles['form__body']}`}>
                    <SendForm />
                </div>
            </div>
            <div className="row" style={{ marginBottom: "40px" }}>
                <div className="col-lg-6">
                    <ContactSubmitPage offices={data?.offices} locale={locale} />
                </div>
                <div className="col-lg-6">
                    <Map />
                </div>
            </div>
        </div>
    )
}

export default Form

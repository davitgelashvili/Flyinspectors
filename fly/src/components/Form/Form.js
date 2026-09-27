import SendForm from "./SendForm"
import FormTabs from "./FormTabs"
import styles from './form.module.scss'
import ContactSubmitPage from "./ContactSubmitPage"
import Map from "./Map"

const Form = () => {
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
                    <ContactSubmitPage />
                </div>
                <div className="col-lg-6">
                    <Map />
                </div>
            </div>
        </div>
    )
}

export default Form

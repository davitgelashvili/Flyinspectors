import FormTabs from '@/components/Form/FormTabs'
import SearchForm from '@/components/Form/SearchForm'
import styles from '@/components/Form/form.module.scss'

const CheckStatus = () => {
    return (
        <main className="container">
            <div className={`${styles['form']}`} style={{ marginTop: '20px', marginBottom: '40px' }}>
                <FormTabs active="status" />
                <div className={`${styles['form__body']}`}>
                    <SearchForm />
                </div>
            </div>
        </main>
    )
}

export default CheckStatus

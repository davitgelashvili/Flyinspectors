import Loading from '../Loading/Loading'
import styles from './PopUp.module.scss'

const PopUp = ({setPopup, load, unicueID, setFormActive}) => {
    return (
        <div className={styles.popup}>
            <div className={styles.popup__bg}></div>
            {load ? (
                <Loading />
            ) : (
                <div className={styles.popup__content}>
                    <h1 className={styles.popup__title}>
                    Your application has been sent successfully
                    </h1>
                    <p className={styles.popup__text}>
                    Please check your email and save the application ID to check the status.
                    </p>
                    <p className={styles.popup__id}>
                    ID: <span>{unicueID}</span>
                    </p>
                    <button onClick={() => {
                        setPopup(false)
                        setFormActive(false)
                    }}>close</button>
                </div>
            )}
        </div>
    )
}

export default PopUp
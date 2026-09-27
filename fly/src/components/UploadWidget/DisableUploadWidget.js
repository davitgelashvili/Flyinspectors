import styles from './UploadWidget.module.scss'

const DisableUploadWidget = ({title, name}) => {
  
    return (
        <label className={`${styles.uploadwidget}`}>
            <p className={styles.uploadwidget__title}>{title}</p>
            <button className={`${styles.uploadwidget__btn} ${styles.disable}`} onClick={(e) => e.preventDefault()}>
                {name}
            </button>
        </label>
    )
}

export default DisableUploadWidget
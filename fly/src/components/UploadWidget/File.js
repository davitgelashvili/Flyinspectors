import styles from './UploadWidget.module.scss'

const File = ({title, name}) => {
  
    return (
        <label className={`${styles.uploadwidget}`}>
            <p className={styles.uploadwidget__title}>{title}</p>
            <button className={`${styles.uploadwidget__btn} ${styles.file}`} onClick={(e) => e.preventDefault()}>
                {name}
            </button>
        </label>
    )
}

export default File
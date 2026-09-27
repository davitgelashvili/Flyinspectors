import styles from './SectionTextAndCover.module.scss'

const SectionText = ({title, children}) => {
    return (
        <div className={styles.text}>
            <h1 className={styles.text__title}>
                {title}
            </h1>
            <div className={styles.text__body}>
                {children}
            </div>
        </div>
    )
}

export default SectionText
import styles from "./ServicesOptions.module.scss"

const Item = ({ title, desc, lang }) => {
    return (
        <div className={styles.item}>
            <h3 className={styles.item__title}>{title?.[lang]}</h3>
            <p className={styles.item__desc}>
                {desc?.[lang]}
            </p>
        </div>
    )
}

export default Item

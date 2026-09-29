import styles from "./OptionsSection.module.scss"

const Item = ({ title, desc }) => {
    return (
        <div className={styles.item}>
            <div className={styles.item__bar} />
            <h3 className={styles.item__title}>{title}</h3>
            {desc && <p className={styles.item__desc}>{desc}</p>}
        </div>
    )
}

export default Item

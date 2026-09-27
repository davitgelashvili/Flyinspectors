import styles from './WeGivesYou.module.scss'

const Item = ({item}) => {
    return (
        <div className={styles.item}>
            <div className={styles.item__cover}>
                <img src={item?.icon} className={styles.item__icon} alt="icon" />
            </div>
            <h1 className={styles.item__title}>{item?.title}</h1>
            <p className={styles.item__subtitle}>{item?.subtitle}</p>
            <ul className={styles.item__list}>
                {item?.list?.map((li)=>{
                    return (
                        <li key={li}>{li}</li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Item
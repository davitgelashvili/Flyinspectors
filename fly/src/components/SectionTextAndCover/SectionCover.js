import styles from './SectionTextAndCover.module.scss'

const SectionCover = ({image}) => {
    return (
        <div className={styles.cover}>
            <img src={image} alt="cover" className={styles.cover__img} />
        </div>
    )
}

export default SectionCover
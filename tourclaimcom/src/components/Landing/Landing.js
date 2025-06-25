import React from 'react'
import styles from './styles.module.scss'
import cover from './../../assetss/b3895926.jpeg'

export const Landing = () => {
    const windowUrl = window.location.hostname

    return (
        <div className={styles.landing}>
            <div className={styles.landing__text}>
                <h1>
                    <p>მიიღე</p>
                    <p>კომპენსაცია დაგვიანებული / გაუქმებული</p>
                    <p>ფრენის შემთხვევაში.</p>
                </h1>
                <p className={styles.landing__desc}>ბმულის მისაღებად დაუკავშირდით ტურისტულ კომპანიას.</p>
                <p className={styles.landing__btn}>250-დან 600 ევრომდე</p>
            </div>
            <figure className={styles.landing__cover}>
                <img src={cover} alt='cover' />
            </figure>
        </div>
    )
}

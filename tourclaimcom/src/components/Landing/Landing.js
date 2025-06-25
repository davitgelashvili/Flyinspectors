import React from 'react'
import styles from './styles.module.scss'
import footer from './../../assetss/footer.png'
import women from './../../assetss/women.png'

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
            <img className={styles.landing__footer} src={footer} alt='cover' />
            <img className={styles.landing__women} src={women} alt='cover' />
            {/* <figure className={styles.landing__cover}>
                <img src={cover} alt='cover' />
            </figure> */}
        </div>
    )
}

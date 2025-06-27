import React from 'react'
import styles from './styles.module.scss'
import women from './../../assetss/women.png'

export const Landing = () => {
    const windowUrl = window.location.hostname
    
    return (
        <div className={styles.landing}>
            {/* <div className={styles.landing__cover}></div> */}
            <div className={styles.landing__text}>
                <h1>
                    <p>მიიღე კომპენსაცია</p>
                    <p>დაგვიანებული / გაუქმებული</p>
                    <p>ფრენის შემთხვევაში.</p>
                </h1>
                <div className={styles.landing__desc}>ბმულის მისაღებად დაუკავშირდით 
                {windowUrl == 'tour.claims' && ' თქვენს წარმომადგენელს.'}
                {!windowUrl == 'tour.claims' && ' ტურისტულ კომპანიას.'}
                    {/* {windowUrl == 'tour.claims' ? (
                        ' თქვენს წარმომადგენელს.'
                    ) : (
                        ' ტურისტულ კომპანიას.'
                    )}   */}
                </div>
                <p className={styles.landing__btn}>250-დან 600 ევრომდე</p>
            </div>
            <div className={styles.landing__footerfly}></div>
            <div className={styles.landing__footerwindow}></div>
            <img className={styles.landing__women} src={women} alt='cover' />
            {/* <figure className={styles.landing__cover}>
                <img src={cover} alt='cover' />
            </figure> */}
        </div>
    )
}

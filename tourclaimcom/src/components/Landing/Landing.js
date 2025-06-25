import React from 'react'
import styles from './styles.module.scss'
import cover from './../../assetss/b3895926.jpeg'

export const Landing = () => {
    const windowUrl = window.location.hostname

    return (
        <div className={styles.landing}>
            <figure className={styles.landing__cover}>
                <img src={cover} alt='cover' />
            </figure>
        </div>
    )
}

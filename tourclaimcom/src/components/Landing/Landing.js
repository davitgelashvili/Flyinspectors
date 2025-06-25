import React from 'react'
import styles from './styles.module.scss'
import cover from './../../assetss/b3895926.avif'

export const Landing = () => {
    const windowUrl =  window.location.hostname
    
    return (
        <div className={styles.landing}>
            <div className='container'>
                <div className='row'>
                    <div className='col-12 col-md-6'>
                        <div className={styles.landing__text}>
                            <h1>
                                <p>Contact your</p>
                                <p>tourist office.</p>
                            </h1>
                            {/* <h2>
                                Earn up to 60% commission by promoting <strong>{windowUrl}</strong>
                            </h2> */}
                            {/* <Link to={'/'}>Sign up now</Link> */}
                        </div>
                    </div>
                    <div className='col-12 col-md-6'>
                        <figure className={styles.landing__cover}>
                            <img src={cover} alt='cover' />
                        </figure>
                    </div>
                </div>
            </div>
        </div>
    )
}

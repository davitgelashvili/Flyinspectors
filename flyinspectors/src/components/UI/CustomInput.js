'use client'

import styles from './CustomInput.module.scss'

export default function CustomInput({
    type = 'text',
    value,
    name,
    title,
    placeholder,
    onChange,
    error,
}) {
    return (
        <div className={`${styles['custominput']}`}>
            {title && <p className={`${styles['custominput__title']}`}>{title}</p>}
            <input
                className={`${styles['custominput__input']}`}
                type={type}
                value={value}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
            />
            {error && <p className={`${styles['custominput__error']}`}>{error}</p>}
        </div>
    )
}

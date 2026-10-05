import styles from "./ServicesOptions.module.scss"

// ნომერი მხოლოდ გაფორმებაა — თანმიმდევრობას <ol> გამოხატავს, ამიტომ ეკრანის
// წამკითხველისთვის ვმალავთ, რომ "1, 01, სათაური" არ წაიკითხოს.
const Item = ({ number, title, desc }) => {
    return (
        <li className={styles.step}>
            <span className={styles.step__number} aria-hidden="true">
                {String(number).padStart(2, "0")}
            </span>
            <h3 className={styles.step__title}>{title}</h3>
            {desc && <p className={styles.step__desc}>{desc}</p>}
        </li>
    )
}

export default Item

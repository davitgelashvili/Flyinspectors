import { Link } from "react-router-dom";
import logo from "./LogoPic/LogoFly.png";
import styles from './Logo.module.scss';

const Logo = () => {
    return (
        <h1 className={styles.logo}>
            <Link to="/">
                <img src={logo} alt="Logo" className={styles.logo__img} />
            </Link>
        </h1>
    );
}

export default Logo;
import Link from '@/components/UI/LocaleLink'
import logo from "./LogoPic/LogoFly.png";
import styles from './Logo.module.scss';

const Logo = () => {
    return (
        <h1 className={styles.logo}>
            <Link href="/">
                <img src={logo.src || logo} alt="Logo" className={styles.logo__img} />
            </Link>
        </h1>
    );
}

export default Logo;
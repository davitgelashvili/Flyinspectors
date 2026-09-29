import Link from '@/components/UI/LocaleLink'
import logo from "./LogoPic/logo-on-dark.png";
import styles from './Logo.module.scss';

const Logo = () => {
    return (
        <div className={styles.logo}>
            <Link href="/">
                <img src={logo.src || logo} alt="Logo" className={styles.logo__img} />
            </Link>
        </div>
    );
}

export default Logo;
import Link from "@/components/UI/LocaleLink";
import MainLogo from "../../Images/MainLogo.png";
import style from "./Footer.module.scss";

const Logo = () => {
  return (
    <Link href="/" className={style.footer__logo}>
      <img className={style['footer__logo--img']} src={MainLogo} alt="Main Logo"></img>
    </Link>
  );
};

export default Logo;

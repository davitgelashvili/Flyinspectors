import React from "react";
import MainLogo from "../../Images/MainLogo.png";
import style from "./Footer.module.scss";
const Logo = () => {
  return (
    <a
        href="/"
        className={style.footer__logo}
      >
        <img className={style['footer__logo--img']} src={MainLogo} alt="Main Logo"></img>
      </a>
  );
};

export default Logo;

import styles from "./Footer.module.scss";
import React from "react";
import translations from "./footer.module";
import Facebook from "../../Images/Facebook.png";
import Whatsapp from "../../Images/Whatsapp.png";
import Gmail from "../../Images/Gmail.png";
import Viber from "../../Images/Viber.png";

const SocialMedia = ({ locale }) => {
  return (
    <div className={styles.socmedia}>
      <div className={styles.socmedia__title}>{translations[locale].social}</div>
      <ul className={styles.socmedia__list}>
        <li>
          <a
            href="https://www.facebook.com/FlyinspectorsEng"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            <img src={Facebook} alt="Facebook" />
          </a>
        </li>
        <li>
          <a
            href="viber://chat?number=593000394"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            <img className={styles.viber} src={Viber} alt="Viber" />
          </a>
        </li>
        <li>
          <a
            href="https://Wa.me/+995593000394?text=I'm%20interested"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            <img src={Whatsapp} alt="WhatsApp" />
          </a>
        </li>
        <li>
          <a href="mailto:team@flyinspectors.com">
            <img src={Gmail} alt="Email" />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default SocialMedia;

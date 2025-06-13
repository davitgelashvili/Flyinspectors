import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./BurgerMenu.module.scss";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { siteTranslateAction } from "../../../../store/translate";
import icon from "../../../Images/arrowIcon.png";
import engFlag from "../../../../assetss/images/brtsh.jpg";
import geoFlag from "../../../../assetss/images/geo.jpg";

const BurgerMenu = ({IsOpen, setIsOpen}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { language } = useSelector((state) => state.translate);

  const toggleMenu = () => {
    setIsOpen(!IsOpen);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const data = [
    {
      link: "/",
      title: t("menu.home"),
    },
    {
      title: t("menu.yourrights"),
      dropdown: [
        { link: "/your-rights/flight-delay", title: t("menu.flightdelay") },
        { link: "/your-rights/flight-cancellation", title: t("menu.flightcancellation") },
        { link: "/your-rights/overbooked-flight", title: t("menu.overBookedflight") },
        { link: "/your-rights/missed-connection", title: t("menu.missedconnection") },
        { link: "/your-rights/lost-luggage", title: t("menu.lostluggage") },
      ],
    },
    {
      title: t("menu.aboutus"),
      dropdown: [
        { link: "/about-us", title: t("menu.aboutus") },
        { link: "/about-us/blog", title: t("menu.blog") },
        { link: "/about-us/faq", title: t("menu.faq") },
      ],
    },
    {
      link: "/contact-us",
      title: t("menu.contactus"),
    },
  ];

  return (
    <div className={styles.container}>
      <nav>
        

        

        {/* Menu */}
        <ul className={`${styles.nav} ${IsOpen ? styles.open : ""}`}>
          {data?.map((item) => {
            const isActive =
              item.link === location.pathname ||
              item.dropdown?.some(
                (subItem) => subItem.link === location.pathname
              );

            return (
              <li
                className={`${styles.nav_item} ${
                  isActive ? styles.active : ""
                }`}
                key={item.title}
                onMouseEnter={() => item.dropdown && setShowDropdown(true)}
                onMouseLeave={() => item.dropdown && setShowDropdown(false)}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className={styles.dropdownTrigger}>
                  <Link className={styles.pages} to={item.link}>
                    {item.title}
                  </Link>
                  {item.dropdown && (
                    <img
                      src={icon}
                      alt="Dropdown Arrow"
                      className={styles.arrow}
                    />
                  )}
                </div>
                {item.dropdown && showDropdown && (
                  <ul className={styles.dropdown}>
                    {item.dropdown.map((subItem) => (
                      <li
                        key={subItem.title}
                        className={`${
                          subItem.link === location.pathname
                            ? styles.activeDropdownItem
                            : ""
                        }`}
                      >
                        <Link
                          className={styles.dropdown_item}
                          to={subItem.link}
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
          
        </ul>
      </nav>
    </div>
  );
};

export default BurgerMenu;
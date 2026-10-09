import Link from "next/link";
import { getPages } from "@/api/serverApi";
import { footerMenuLinks } from "@/utils/pageMenu";
import translations from "./footer.module";
import styles from "./Footer.module.scss";

// მე-3 სვეტში ამდენი გვერდი ეტევა; დანარჩენი მე-4 სვეტში გადადის
const PAGES_PER_COLUMN = 4;

// სერვერ კომპონენტია: ყველა ბმული მზა HTML-შია (<a href>), ამიტომ Google-ი მათ JavaScript-ის
// გარეშე ხედავს და გვერდებს ერთმანეთთან აკავშირებს.
//
// სვეტები: 1) მთავარი, განაცხადი, სტატუსი, ხდკ — ფიქსირებულია, ადმინიდან არაფერი ემატება
//          2) ჩვენს შესახებ, ბლოგი, კონტაქტი + ამ სექციისთვის მონიშნული გვერდები
//          3) მესამე სექციისთვის მონიშნული გვერდები (პირველი 4)
//          4) დანარჩენი, თუ მესამეში 4-ზე მეტია
// თითოეული გვერდი თვითონ ირჩევს სექციას (ადმინი → გვერდის შექმნა → მენიუ).
const PageLinks = async ({ locale }) => {
  const t = translations[locale];
  const prefix = `/${locale}`;
  const pages = await getPages();

  const thirdSection = footerMenuLinks(pages, locale, "third", prefix);

  const columns = [
    [
      { href: prefix, label: t.main.home },
      { href: `${prefix}/submit-claim`, label: t.main.submitclaim },
      { href: `${prefix}/check-status`, label: t.main.checkstatus },
      { href: `${prefix}/faq`, label: t.main.faq },
    ],
    [
      { href: `${prefix}/about-us`, label: t.info.aboutus },
      { href: `${prefix}/blog`, label: t.info.blog },
      { href: `${prefix}/contact-us`, label: t.info.contactus },
      ...footerMenuLinks(pages, locale, "second", prefix),
    ],
    thirdSection.slice(0, PAGES_PER_COLUMN),
    thirdSection.slice(PAGES_PER_COLUMN),
  ];

  return (
    <nav aria-label={t.label} className={styles.links}>
      {/* ცარიელი სვეტი არ ჩანს */}
      {columns.filter((links) => links.length).map((links, index) => (
        <ul className={styles.links__column} key={index}>
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={styles.links__link}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </nav>
  );
};

export default PageLinks;

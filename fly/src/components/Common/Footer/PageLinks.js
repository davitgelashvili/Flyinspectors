import Link from "next/link";
import { getPages } from "@/api/serverApi";
import translations from "./footer.module";
import styles from "./Footer.module.scss";

// მე-3 სვეტში ამდენი დინამიური გვერდი ეტევა; დანარჩენი მე-4 სვეტში გადადის
const PAGES_PER_COLUMN = 4;

// სერვერ კომპონენტია: ყველა ბმული მზა HTML-შია (<a href>), ამიტომ Google-ი მათ JavaScript-ის
// გარეშე ხედავს და გვერდებს ერთმანეთთან აკავშირებს.
//
// სვეტები: 1) მთავარი, განაცხადი, სტატუსი, ხდკ   2) ჩვენს შესახებ, წესები, ბლოგი, კონტაქტი
//          3) ადმინიდან შექმნილი გვერდები (პირველი 4)   4) დანარჩენი გვერდები, თუ 4-ზე მეტია
const PageLinks = async ({ locale }) => {
  const t = translations[locale];
  const prefix = `/${locale}`;

  const columns = [
    [
      { href: prefix, label: t.main.home },
      { href: `${prefix}/submit-claim`, label: t.main.submitclaim },
      { href: `${prefix}/check-status`, label: t.main.checkstatus },
      { href: `${prefix}/about-us/faq`, label: t.main.faq },
    ],
    [
      { href: `${prefix}/about-us`, label: t.info.aboutus },
      { href: `${prefix}/terms-and-conditions`, label: t.info.termsandconditions },
      { href: `${prefix}/about-us/blog`, label: t.info.blog },
      { href: `${prefix}/contact-us`, label: t.info.contactus },
    ],
  ];

  // ბექი გამოქვეყნებულებს ახალი → ძველი რიგით აბრუნებს; ფუტერში შექმნის რიგი გვჭირდება,
  // რომ ახალი გვერდი არსებულებს სვეტებს არ გადაუწყობდეს. ამ ენაზე სათაურის გარეშე გვერდი არ ჩანს.
  const pages = (await getPages())
    .filter((page) => page.published !== false)
    .map((page) => ({
      href: `${prefix}/page/${page.slug}`,
      label: page.title?.[locale]?.trim(),
    }))
    .filter((page) => page.label)
    .reverse();

  // სვეტები მხოლოდ 4 გვაქვს: მე-3-ში პირველი 4 გვერდი, მე-4-ში ყველა დანარჩენი
  // (ცარიელი სვეტი არ ჩანს)
  columns.push(pages.slice(0, PAGES_PER_COLUMN), pages.slice(PAGES_PER_COLUMN));

  return (
    <nav aria-label={t.label} className={styles.links}>
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

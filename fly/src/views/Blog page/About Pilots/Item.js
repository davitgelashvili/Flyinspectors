import styles from "./AboutPilots.module.scss";
import Link from '@/components/UI/LocaleLink'
import image from "../../../assetss/Blog Page/4/1_5d4d9f08ca2a4.jpg";
const Item = () => {
  return (
    <div className={styles.mainDiv}>
      <div className="">
        <img
          className={styles.mainDiv__image}
          src={image}
          alt="Airplane image with logo"
        />
      </div>
      <div className={styles.mainDiv__textArea}>
        <h3 className={styles.services__header}>
          10 Interesting Facts About Pilots{" "}
        </h3>
        <p className={styles.mainDiv__text}>
          There are probably no people who would deny the importance of aviation
          in today’s fast moving world. The question is how much do we really
          know about aviation and pilots ? Undoubtedly, there are countless
          interesting and surprising facts about pilots which may surprise you.
          That is the reason why we have chosen to come up with the list of the
          most astonishing facts about pilots. Who knows, maybe after reading
          this article you will be able to add some new facts about aviation and
          pilot profession to your knowledge pool.
        </p>
        <button type="button" className={styles.button}>
          <Link href="/about-us/blog-page-more-pilots" className={styles.link}>
            Read More
          </Link>{" "}
        </button>
      </div>
    </div>
  );
};

export default Item;

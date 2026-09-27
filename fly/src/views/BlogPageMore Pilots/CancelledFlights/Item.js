import React from "react";
import styles from "./BlogPageMorePilots.module.scss";
import image from "../../../assetss/Blog Page/4/1_5d4d9f08ca2a4.jpg";

const PilotFacts = () => {
  const facts = [
    "Pilots often spend extended periods away from home. To stay connected to their loved ones, many keep photos of their family or spouse tucked inside the lining of their hat.",
    "To minimize the risk of food poisoning, pilots are prohibited from eating shellfish while on duty. Additionally, pilots are not allowed to share food and are required to order and consume different meals during flights for safety reasons.",
    "A captain has significant authority while in the air, including the ability to arrest individuals, issue fines, and even document the last will of a dying passenger if necessary.",
    "While music is generally encouraged during flights for passengers, pilots are an exception. They must maintain constant communication with ground controllers to ensure synchronized aircraft movements.",
    "When two planes meet in the sky, pilots may flash the landing lights or wing inspection lights to say hello.",
    "Everyone who will to be a pilot generally invest more than $70,000 in their education. To be hired by Air Canada, for example, the pilot must have minimum 4,000 hours of experience.",
    "Once their flight simulator training is complete, pilots move directly to piloting fully-loaded passenger airplanes. They are, however, accompagnied by line indoctrination pilots for their first few flights. After a second test by a supervisor pilot, they’re fully cleared to fly on their own.",
    "Pilots are sent back into the simulator at least every eight months to renew their license; every six months for those who command the Boeing 777.",
    "Pilots can fly only one type of aircraft at a time. Before acquiring a license to command a different model, they must go through 8 to 12 weeks of training. The process includes “ground school”, pre-simulator mockup flights and simulator training.",
    "Where are you off to?” is the question you’d hear all the time if you stopped at the flight planning center at any time of the day. As you’d expect, pilots ask each other where they are flying to!",
  ];

  return (
    <div className={styles.mainDiv}>
      <div className={styles.mainDiv__imageDiv}>
        <img
          className={styles.mainDiv__image}
          src={image}
          alt="Airplane with logo"
        />
        <p className={styles.mainDiv__text}>
          There are probably no people who would deny the importance of aviation
          in today’s fast-moving world. The question is how much do we really
          know about aviation and pilots? Undoubtedly, there are countless
          interesting and surprising facts about pilots that may surprise you.
          That is why we have chosen to create a list of the most astonishing
          facts about pilots. Who knows, maybe after reading this article you
          will be able to add some new facts about aviation and the pilot
          profession to your knowledge pool.
        </p>
        <ol className={styles.mainDiv__factsList}>
          {facts.map((fact, index) => (
            <li key={index} className={styles.factsItem}>
              {fact}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default PilotFacts;

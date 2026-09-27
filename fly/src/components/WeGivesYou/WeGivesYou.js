'use client'

import { useTranslation } from "react-i18next";
import Item from "./Item";

const WeGivesYou = () => {
  const {t} = useTranslation()

  const data = [
    {
      id: 2356,
      icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1732535835/Group_1_jcoppd.svg",
      title: t('WeGivesYou.first.title'),
      subtitle: t('WeGivesYou.first.subtitle'),
      list: [
        t('WeGivesYou.first.list.1'),
        t('WeGivesYou.first.list.2'),
        t('WeGivesYou.first.list.3'),
        t('WeGivesYou.first.list.4'),
        t('WeGivesYou.first.list.5'),
        t('WeGivesYou.first.list.6'),
        t('WeGivesYou.first.list.7'),
      ]
    },
    {
      id: 35252,
      icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1732535835/Logo_Fly-removebg-preview_1_kqkruo.png",
      subtitle: t('WeGivesYou.second.subtitle'),
      list: [
        t('WeGivesYou.second.list.1'),
        t('WeGivesYou.second.list.2'),
        t('WeGivesYou.second.list.3'),
        t('WeGivesYou.second.list.4'),
        t('WeGivesYou.second.list.5'),
      ]
    },
    {
      id: 46453,
      icon: "https://res.cloudinary.com/dluqxr8lw/image/upload/v1732535834/Group_2_cafvlv.svg",
      title: t('WeGivesYou.three.title'),
      subtitle: t('WeGivesYou.three.subtitle'),
      list: [
        t('WeGivesYou.three.list.1'),
        t('WeGivesYou.three.list.2'),
        t('WeGivesYou.three.list.3'),
        t('WeGivesYou.three.list.4'),
        t('WeGivesYou.three.list.5'),
      ]
    }
  ]
  return (
    <div className="WeGivesYou">
      <div className="container">
        <div className="row">
          {data?.map((item) => {
            return (
              <div className="col-lg-4" key={item.id}>
                <Item item={item} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default WeGivesYou;

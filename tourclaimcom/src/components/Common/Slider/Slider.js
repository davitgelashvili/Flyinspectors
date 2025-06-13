import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import styles from './Slider.module.scss';
import SubmitLink from '../../UI/SubmitLink';

function Slider() {
    const data = [
        {
            img: 'https://res.cloudinary.com/dluqxr8lw/image/upload/v1732546906/1456_bdfodt.png',
            title: 'Test 2',
        },
        {
            img: 'https://res.cloudinary.com/dluqxr8lw/image/upload/v1732546905/561_glg7fd.png',
            title: 'Test1',
        },
        {
            img: 'https://res.cloudinary.com/dluqxr8lw/image/upload/v1732546906/2149272103_hoips3.png',
            title: 'Test 3',
        },
    ];

    const swiperRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (swiperRef.current) {
                const swiper = swiperRef.current.swiper;
                swiper.slideNext(); // Move to the next slide
            }
        }, 4000); // 4 seconds delay between slides

        return () => clearInterval(interval); // Clean up interval on unmount
    }, []);

    return (
        <Swiper
            ref={swiperRef} // Attach ref to Swiper
            className={styles.slider}
            spaceBetween={50}
            slidesPerView={1}
            loop={true} // Enables infinite looping
            speed={2000} // 2-second transition duration
            onSlideChange={() => console.log('Slide changed')}
            onSwiper={(swiper) => console.log(swiper)}
        >
            {data.map((item) => (
                <SwiperSlide key={item.title}>
                    <div className={`${styles['slider__item']}`}>
                        <img
                            src={item.img}
                            alt={item.title}
                            className={`${styles['slider__item--cover']}`}
                        />
                        <div className="d-flex justify-content-center">
                            <SubmitLink className={styles.link} />
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default Slider;
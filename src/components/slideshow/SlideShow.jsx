import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../../css/welcome/Welcome.css';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

export default function SlideShow() {
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="slide-content">
            <img src="./images/swiper/angkor.jpg" alt="Angkor Wat" />
            <div className="overlay"></div>
            <div className="slide-title">Architecture</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src="./images/swiper/animal.webp" alt="Animal" />
            <div className="overlay"></div>
            <div className="slide-title">Wildlife </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src="./images/swiper/book.jpg" alt="Book" />
            <div className="overlay"></div>
            <div className="slide-title">Book Reading</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src="https://www.asiakingtravel.com/cuploads/files/Traditional-Cambodian-costumes-1%20.jpg" alt="Culture" />
            <div className="overlay"></div>
            <div className="slide-title">Cultural Heritage</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src="./images/swiper/food..webp" alt="Food" />
            <div className="overlay"></div>
            <div className="slide-title">Delicious Food</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src="./images/swiper/hacker.jpg" alt="Hacker" />
            <div className="overlay"></div>
            <div className="slide-title">Cybersecurity</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src="https://mediaim.expedia.com/destination/1/70981b9f24e4825958eff982f8e1d2f6.jpg" alt="Images" />
            <div className="overlay"></div>
            <div className="slide-title">Photography</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src="./images/swiper/musem.jpg" alt="Museum" />
            <div className="overlay"></div>
            <div className="slide-title">Museum Visit</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src="./images/swiper/sea.webp" alt="Sea" />
            <div className="overlay"></div>
            <div className="slide-title">Ocean View</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src="./images/swiper/skincare - Copy.jpg" alt="Skincare" />
            <div className="overlay"></div>
            <div className="slide-title">Skincare Routine</div>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}
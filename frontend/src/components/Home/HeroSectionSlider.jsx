import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HeroSlider = () => {
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      title: "Discover Nature",
      description: "Experience the beauty of untouched landscapes and fresh air.",
      buttonText: "Explore Now",
      buttonLink: "#nature"
    },
    {
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      title: "Ocean Vibes",
      description: "Relax and enjoy the sound of waves with the perfect sunset.",
      buttonText: "Book a Trip",
      buttonLink: "#ocean"
    },
    {
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      title: "City Lights",
      description: "Explore the vibrant nightlife and modern city culture.",
      buttonText: "Explore City",
      buttonLink: "#city"
    },
    {
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      title: "Mountain Escape",
      description: "Find peace in the silence of high mountains.",
      buttonText: "Start Hiking",
      buttonLink: "#mountain"
    },
    {
      image: "https://images.unsplash.com/photo-1503264116251-35a269479413",
      title: "Tech Future",
      description: "Step into the world of innovation and creativity.",
      buttonText: "Learn More",
      buttonLink: "#tech"
    }
  ];

  return (
    <section className="w-full h-[250px] md:h-[400px] lg:h-[550px]">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 3000 }}
        navigation
        pagination={{ clickable: true }}
        loop
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-xl md:text-4xl lg:text-6xl text-white font-bold drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="mt-3 text-sm md:text-lg lg:text-xl text-gray-200 max-w-2xl">
                  {slide.description}
                </p>
                <a
                  href={slide.buttonLink}
                  className="mt-5 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 shadow-lg"
                >
                  {slide.buttonText}
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSlider;

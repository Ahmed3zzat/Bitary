"use client";

import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Brands({ images }: { images: string[] }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="mx-auto w-full py-6 bg-white">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="ms-12">
            <Image
              src={image}
              alt="Brand"
              height={100}
              width={100}
              className="w-1/2 lg:h-16 "
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { Mousewheel } from 'swiper/modules';
import { StarIcon as SolidStarIcon } from "@heroicons/react/24/solid";
import { StarIcon as OutlineStarIcon } from "@heroicons/react/24/outline";

import "swiper/css";
import classNames from "../../services/classNames-service";

export default function Carousel({
  allImages,
  elements,
  className,
  onSelectedChange,
  disabled,
  onClick,
  initialSlide,
  onSwiper,
  hidePlaceholder
}) {
  const [title, setTitle] = useState(hidePlaceholder === true || elements.length !== 0 ? elements[0].name : "Keine Auswahl");
  const [updatedElements, setUpdatedElements] = useState(elements);

  const evaluateMaxNofChild = ( number ) => {
    const carouselChildren = elements.length + (hidePlaceholder === true ? 0 : 1);
  
    return ( number >= carouselChildren ? carouselChildren : number );
  };  

  useEffect(() => {
    const updateRatings = async () => {
      const newElements = await Promise.all(
        elements.map(async (element) => {
          const avgRating = element.avgRating;
          //console.log("avg rating2: " + avgRating);
          return { ...element, avgRating };
        })
      );
      setUpdatedElements(newElements);
    };
    updateRatings();
  }, [elements]);

  const handleActiveIndexChange = (swiper) => {
    // Index 0 => Placeholder

    if (elements.length !== 0) {
      setTitle(
        hidePlaceholder === true ||
        swiper.activeIndex !== 0
          ? elements[swiper.activeIndex - (hidePlaceholder === true ? 0 : 1)].name
          : "Keine Auswahl"
      );
      onSelectedChange(
        hidePlaceholder === true || swiper.activeIndex !== 0 ? elements[swiper.activeIndex - (hidePlaceholder === true ? 0 : 1)] : undefined
      );
    }
  };
  
  function resolveImage(key) {
    const entry = allImages.find((image) => key === image._id);
    return entry ? entry.image : '';
  }

  return (
    <div className={className}>

      <div className="flex justify-center place-items-center">
        <span
          className={
            disabled
              ? "text-red-600 decoration-red-700 line-through text-center"
              : "text-center"
          }>
          {" " + title + " "}
        </span>
      </div>

      <Swiper
        modules={[Mousewheel]}
        mousewheel={{thresholdTime: 200}}
        allowTouchMove={!(disabled || false)}
        onInit={handleActiveIndexChange}
        initialSlide={initialSlide}
        onActiveIndexChange={handleActiveIndexChange}
        onClick={(swiper, _event) => hidePlaceholder === true || swiper.activeIndex !== 0 ? onClick(elements[swiper.activeIndex - (hidePlaceholder === true ? 0 : 1)]) : ''}
        grabCursor={true}
        centeredSlides={elements.length > 0}
        centerInsufficientSlides={true}
        spaceBetween={3}
        watchOverflow={true}
        loop={false}
        onSwiper={onSwiper}
        slidesPerView={evaluateMaxNofChild(2)}
        className="w-full h-full"
        >

        {!hidePlaceholder && 
        <SwiperSlide>
          <div className="flex justify-center">
            <XCircleIcon className="w-96 h-36 text-red-500 bg-red-200 rounded-2xl opacity-100" />
          </div>
        </SwiperSlide>}

        {updatedElements.map((element, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-96 h-36 flex justify-center">
              <div className="absolute z-0">
                <img
                  className={classNames(index === (initialSlide - (hidePlaceholder === true ? 0 : 1)) ? "border-4 border-blue-500" : "", "block object-cover w-96 h-36 rounded-2xl border-2")}
                  src={resolveImage(element.image)}
                  alt={element.name}
                />
              </div>
              {/* rating with stars */}
              <div className="relative top-28 lg:left-36 py-2 px-2 bg-white rounded-tr-xl rounded-tl-xl inline-flex">
                {[1, 2, 3, 4, 5].map((star) => {
                  return star <= Math.round(element.avgRating) ? (
                    <SolidStarIcon className="h-5 w-5 text-yellow-500" key={star} />
                  ) : (
                    <OutlineStarIcon className="h-5 w-5 text-yellow-500" key={star} />
                  );
                })}
              </div>
            </div>
          </SwiperSlide>
        ))}



      </Swiper>
    </div>
  );
}

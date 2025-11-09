import { useState } from "react";
import Carousel from "./Carousel";
import DishDetails from "./DishDetails";

export default function DishCarousel({ allImages, dishes, onOrderChange, initialOrder, onSetSwipers, menuplan, hidePlaceholders }) {

  const [detailDish, setDetailDish] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClick = (dish) => {
    setDetailDish(dish);
    setOpen(true);
  };

  const getOrderDishByType = (type) => {
    return initialOrder.find((order) => order.dish.name !== 'Keine Auswahl' && order.dish.tags.includes(type))
  }

  const getIndexOfOrderInMenuplan = (orderedDish, type) => {
    if(!orderedDish) {
      return -1;
    }

    return menuplan[type].dishes.findIndex((dish) => dish.name === orderedDish.dish.name);
  }

  return (
    <>
      <DishDetails open={open} setOpen={setOpen} detailDish={detailDish} allImages={allImages} />
      <div className="pt-2">
        {Object.keys(menuplan).map((key) => (
          <div key={key}>
            <div className="flex justify-center place-items-center pb-1">
              <span className="text-center font-extrabold text-xl">
                <span
                  className={
                    menuplan[key]?.dishes.length === 0
                      ? "line-through text-red-600 decoration-red-700 decoration-2"
                      : ""
                  }>
                  {
                    " " +
                      menuplan[key]?.name +
                      " " /* Other (unicode) spaces, to make the line-through longer */
                  }
                </span>
              </span>
            </div>
            {initialOrder &&
            <Carousel
              allImages={allImages}
              elements={menuplan[key]?.dishes}
              onSelectedChange={(active) => onOrderChange(active, key)}
              className="pb-4"
              disabled={menuplan[key]?.dishes.length === 0}
              onClick={handleClick}
              initialSlide={getIndexOfOrderInMenuplan(getOrderDishByType(key), key) + 1}
              hidePlaceholder={hidePlaceholders}
              onSwiper={(swiper) => {
                if(!swiper.hasOwnProperty('destroyed')) { // Presence of 'destroyed' indicates that the swiper is not ready
                  onSetSwipers((swipers) => {return {...swipers, [key]: swiper}})}
                }
              }
            />}
          </div>
        ))}
      </div>
    </>
  );
}

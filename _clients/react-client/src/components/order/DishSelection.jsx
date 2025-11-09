import MenuToggle from "../menuPlanCreation/MenuToggle";
import DishCarousel from "./DishCarousel";
import { useState } from "react";
import classNames from "../../services/classNames-service";

const LABEL_STARTER = "Vorspeise";
const LABEL_MAIN = "Hauptspeise";
const LABEL_DESSERT = "Nachspeise";

export default function DishSelection({ dishes, actions, onOrderChange, allImages, initialOrder, date, hideMenus, hidePlaceholders }) {
  // const [user] = useState(JSON.parse(localStorage.getItem("user")) || {});

  const [order, setOrder] = useState({
  });
  const [swipers, setSwipers] = useState({});

  const isDisabled = new Date(date).getTime() + 86400*1000*0 <= Date.now() - 3600*8*1000;

  const menuplan = {
    [LABEL_STARTER]: {
      name: "Vorspeise",
      dishes: dishes?.filter((dish) =>
        dish?.tags.find((tag) => tag === LABEL_STARTER)
      ),
    },
    [LABEL_MAIN]: {
      name: "Hauptspeise",
      dishes: dishes?.filter((dish) =>
        dish?.tags.find((tag) => tag === LABEL_MAIN)
      ),
    },
    [LABEL_DESSERT]: {
      name: "Nachspeise",
      dishes: dishes?.filter((dish) =>
        dish?.tags.find((tag) => tag === LABEL_DESSERT)
      ),
    },
  };

  const handleOrderChange = (dish, key) => {
    let newOrder = order;

    if (dish !== undefined) {
      newOrder = { ...newOrder, [key]: dish };
    } else {
      delete newOrder[key];
      newOrder = { ...newOrder };
    }

    onOrderChange(newOrder);
    setOrder((order) => {
      return { ...order, ...newOrder };
    }); // Excluding 'order' causes sets (rather than updates)
  };

  const handleMenuChange = (name) => {
    const tag = "Menü " + name;

    Object.keys(swipers).forEach((key) => {
      const swiper = swipers[key];
      const index = menuplan[key].dishes.findIndex((dish) => dish.tags.includes(tag));

      swiper.slideTo(index + 1, 300);
    });
  }

  return (
    <div className="flex flex-col h-full justify-between">
      <div className={classNames('flex my-4 mx-auto', hideMenus === true ? 'hidden' : 'visible')}>
        <MenuToggle name="A" onChange={handleMenuChange} isChecked={true} />
        <MenuToggle name="B" onChange={handleMenuChange} isChecked={true} />
        <MenuToggle name="C" onChange={handleMenuChange} isChecked={true} />
      </div>

      <DishCarousel
        initialOrder={initialOrder}
        allImages={allImages}
        dishes={dishes}
        date={date}
        onOrderChange={handleOrderChange}
        onSetSwipers={setSwipers}
        menuplan={menuplan}
        hidePlaceholders={hidePlaceholders}
        />
      <div className={classNames(!isDisabled ? "justify-between" : "justify-center", "flex sticky z-10 inset-x-0 bottom-0 h-16 bg-white")}>
        {!isDisabled ? actions.map((action, index) => {
          const { disabled } = action;


          const buttonDisabled = disabled || isDisabled; // Either THIS button is disabled, or all buttons are disabled

          return (
            <button
              key={index}
              disabled={buttonDisabled}
              className={`inline-block h-full w-full ${action.color} hover:${
                action.hover
              } ${buttonDisabled ? "opacity-50" : "opacity-100"} text-white`}
              onClick={(_event) => action.handler(order)}>
              {action.name}
            </button>
          );
        }) : <span className="text-red-500 underline mt-4 sm:text-lg text-sm">Das Anmeldungszeitfenster ist bereits abgelaufen!</span>}
      </div>
    </div>
  );
}

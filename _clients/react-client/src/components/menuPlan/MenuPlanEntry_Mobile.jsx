import React from "react";
import { MENUS, MENU_COLORS } from "../../data/clientConfiguration";
import { TrashIcon } from "@heroicons/react/20/solid";
import classNames from "../../services/classNames-service";
import { LongPressEventType, useLongPress } from "use-long-press";


export default function MenuPlanEntry({
  day,
  dish,
  onDeleteClicked,
  image,
  selected,
  disabled,
  setDetailDish,
  setOpen,
  unselected
}) {


  const callback = React.useCallback(() => {
    // Long pressed
  }, []);
  const bind = useLongPress(callback, {
    onStart: (_event, _meta) => {
      // Press started
    },
    onFinish: (_event, _meta) => {
      // Long press released
      setDetailDish(dish);
      setOpen(true);
    },
    onCancel: (_event, _meta) => {
      // Cancelled
    },
    //onMove: () => console.log("Detected mouse or touch movement"),
    filterEvents: (_event) => true, // All events can potentially trigger long press
    threshold: 1000,
    captureEvent: true,
    cancelOnMovement: false,
    cancelOutsideElement: false,
    detect: LongPressEventType.Pointer
  });
  const dishDetailsHandlers = bind("dish details context" /* random string? */);

  return (
    <div className={classNames(
      ((disabled && !selected) || unselected) ? "opacity-60" : "",
      "text-xs"
    )}>
      <div
        {...dishDetailsHandlers}
        className={classNames(
          "rounded-md select-none border-2 my-1 h-full w-full text-ellipsis break-normal overflow-hidden",
          !disabled ? "cursor-pointer hover:scale-110" : "",
          selected ? "border-blue-500" : "border-transparent",
        )}
        // onContextMenu={(event)=>{event.preventDefault(); console.log(event); handleLongClick();}}
      >
        <span className="flex items-center text-ellipsis min-h-[64px] h-[64px] max-h-[64px]  w-full">
          <span className="my-auto">
          {dish.name}  
          </span>  
        </span> {/* h-xx should match (size of character) * 4/}
        {/* <img
          src={image?.image}
          alt="Kein Bild gefunden"
          className={`w-full h-16 mb-0.5 object-cover object-center ${
            !disabled ? "cursor-pointer hover:scale-110" : ""
          } rounded${selected ? " border-4 border-blue-500" : ""}`}
        /> */}

        <div className="h-full my-auto flex flex-row">
          {MENUS.map((menu, idx, valMenus) => (
            <div
              key={idx}
              className={`w-full h-1.5 p-0 ${
                dish.tags.includes(menu) ? MENU_COLORS[menu] : "bg-slate-300"
              } ${idx === valMenus.length - 1 ? "rounded-r-md  " : ""} ${
                idx === 0 ? "rounded-l-md" : ""
              }`}
            ></div>
          ))}
        </div>
      </div>

      {onDeleteClicked ? (
        <div className="flex-initial my-auto">
          <TrashIcon
            className="p-1 hover:bg-black hover:text-white rounded-2xl w-7 h-7"
            onClick={() => onDeleteClicked(day, dish)}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

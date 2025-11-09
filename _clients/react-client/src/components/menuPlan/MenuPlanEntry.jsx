import React from "react";
import { MENUS, MENU_COLORS } from "../../data/clientConfiguration";
import { TrashIcon } from "@heroicons/react/20/solid";
import classNames from "../../services/classNames-service";

export default function MenuPlanEntry({
  day,
  dish,
  onDishClicked,
  onDeleteClicked,
  selected,
  disabled,
  printMode,
  unselected
}) {
  return (
    <div
      className={classNames(
        !printMode && ((disabled && !selected) || unselected) ? "opacity-60" : "",
        "flex flex-row leading-5 select-none",
        !printMode ? "m-3" : "m-1"
      )}
    >
      {!printMode && <div className="mr-2 h-full my-auto">
        {MENUS.map((menu, idx, valMenus) => (
          <div
            key={idx}
            className={`w-2 h-4 p-0 ${
              dish.tags.includes(menu) ? MENU_COLORS[menu] : "bg-slate-300"
            } ${idx === valMenus.length - 1 ? "rounded-b-md  " : ""} ${
              idx === 0 ? "rounded-t-md" : ""
            }`}
          ></div>
        ))}
      </div>}

      <div
        className={classNames(
          classNames(
            !printMode && selected ? "border-blue-500 border-2" : "",
            onDishClicked ? "cursor-pointer" : "",
            "py-2 w-full mx-auto my-auto border rounded-md shadow-lg hover:bg-slate-200"
          )
        )}
        onClick={onDishClicked ? () => onDishClicked(day, dish) : () => {}}
      >
        <span>{dish.name}</span>
      </div>

      {onDeleteClicked && !printMode ? (
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

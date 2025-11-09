import React, { useState, useEffect, useContext } from "react";
import restClient from "../../services/rest-client-service";
import { UserContext } from "../..";
import MenuPlanEntry from "./MenuPlanEntry";
import { COURSES, SIGNUP_URL } from "../../data/clientConfiguration";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Tooltip } from 'flowbite-react';
import { XCircleIcon, CheckCircleIcon/*, PrinterIcon */} from "@heroicons/react/24/outline";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MenuPlanDay({
  day,
  date,
  dishes,
  onDayClicked,
  onDishClicked,
  onAddClicked,
  onDeleteClicked,
  onDisableDayClicked,
  disabled,
  menuFilter,
  handlePrintButton,
  printMode,
}) {
  const [signups, setSignups] = useState([]);  
  const [user] = useContext(UserContext);

  useEffect(() => {
    if(date) {
      restClient
      .get(SIGNUP_URL, {}, { _idUser: user?._id, day: date })
      .then((response) => response.data)
      .then((data) => setSignups(data))
      .catch((response) =>
        console.error(
          `Loading Signups
      failed.`,
          response
        )
      );
    }
  }, [setSignups, date, user]);
  return (
    <div
      className={classNames(
        disabled  || !onDayClicked ? "bg-opacity-60" : "cursor-pointer",
        day !== "Freitag" ? "border-r border-r-slate-400" : "",
        "flex-1"
      )}
    >
        <div className={`flex items-center justify-center flex-wrap border-b border-b-slate-400 cursor-default`}>
          <p
            className={classNames(
              "flex-shrink-0 text-red-800 text-xl",
              (disabled || new Date(date) < new Date().setHours(0,0,0,0)) && !printMode ? "text-opacity-60" : ""
            )}
          >
            {day}
          </p>
          {
            !disabled && onDisableDayClicked && !printMode ? 
            <Tooltip content={`${day} deaktivieren`} placement="bottom">
              <XCircleIcon className={`bg-white text-red-800 cursor-pointer w-7 mx-2`} onClick={() => onDisableDayClicked(day)}/>
            </Tooltip>
            : disabled && onDisableDayClicked && !printMode &&
            <Tooltip content={`${day} aktivieren`} placement="bottom">
              <CheckCircleIcon className={`bg-white text-green-800 cursor-pointer w-7 mx-2 text-opacity-100`} onClick={() => onDisableDayClicked(day, true)}/>
            </Tooltip>
          }

          {
            /*
            (user.roles.includes("chef") ||
            user.roles.includes("cook") ||
            user.roles.includes("admin")) && !disabled && !onDisableDayClicked && !printMode &&
            <Tooltip content={`${day} ausdrucken`} placement="bottom" className="cursor-pointer">
              <PrinterIcon className={`bg-white w-7 h-7 cursor-pointer mx-2 text-opacity-100`} onClick={() => handlePrintButton(day, date)}/>
            </Tooltip>
            */
          }
          
        </div>
      
      <div className="flex flex-wrap" onClick={onDayClicked ? () => onDayClicked(day) : () => {}}>
        <div className="flex-shrink-0 w-full max-w-full text-center">
          <div>
            {dishes
              ?.reduce(
                (last, current) => {
                  last[
                    COURSES.findIndex(course => current.tags.includes(course))
                  ].push(current);
                  return last;
                },
                [[], [], []]
              ) // Generate array => [[<Vorspeisen ...>], [<Hauptspeisen ...>], [...]]
              .map((course) => course.filter((dish) => (menuFilter.A && menuFilter.B && menuFilter.C) || (menuFilter.A && dish.tags.includes("Menü A")) || (menuFilter.B && dish.tags.includes("Menü B")) || (menuFilter.C && dish.tags.includes("Menü C")) || ((!menuFilter.A && !menuFilter.B && !menuFilter.C) && !dish.tags.includes("Menü A") && !dish.tags.includes("Menü B") && !dish.tags.includes("Menü C"))))
              .filter((course) => course.length)
              .map((course, idx) => (
                <div key={idx}>
                  {/* first course has no divider */}
                  {idx ? (
                    <div className=" border-b-2 border-b-red-700 mx-10"/>
                  ) : (
                    ""
                  )}
                  <ul className={!printMode ? 'list-none pl-4' : ''}>
                    {course.map((dish, idxDish) => {
                      let selected = signups.find((signup) => signup.dish.name === dish.name) !== undefined;
                      return (
                      <MenuPlanEntry
                        key={idxDish}
                        dish={dish}
                        onDishClicked={onDishClicked}
                        onDeleteClicked={onDeleteClicked}
                        day={day}
                        disabled={disabled}
                        selected={selected}
                        unselected={!selected && signups.length>0}
                        printMode={printMode}
                      />
                    )})}
                  </ul>
                </div>
              ))}
            <div className="inline-block">
              {onAddClicked && !printMode ? (
                <PlusIcon
                  className={`rounded-2xl text-black bg-white hover:text-white hover:bg-black w-8 h-8 mt-2 cursor-pointer`}
                  onClick={() => onAddClicked(day)}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

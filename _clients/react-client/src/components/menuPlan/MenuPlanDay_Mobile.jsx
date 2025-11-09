import React, { useState, useEffect, useContext } from "react";
import restClient from "../../services/rest-client-service";
import { UserContext } from "../..";
import MenuPlanEntry from "./MenuPlanEntry_Mobile";
import { SIGNUP_URL, MOBILE_DAYS } from "../../data/clientConfiguration";
import { PlusIcon } from "@heroicons/react/20/solid";

export default function MenuPlanDay({
  day,
  date,
  courses,
  maxNumberOfDishes,
  onDayClicked,
  onAddClicked,
  onDeleteClicked,
  disabled,
  images,
  setDetailDish,
  setOpen,
  menuFilter,
}) {
  const [signups, setSignups] = useState([]);
  const [user] = useContext(UserContext);
  const [dateObj, setDateObj] = useState(new Date("1900/01/01"));

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {
    if(date !=="") {
      if (dateObj.getFullYear() === 1900) {
        let newDateStr = date
          .split("-")
          .reduce(
            (prevDatePart, currDatePart) =>
              prevDatePart !== ""
                ? `${prevDatePart}/${currDatePart}`
                : `${prevDatePart}${currDatePart}`,
            ""
          );
        setDateObj(new Date(newDateStr));
      }
      restClient
      .get(SIGNUP_URL, {}, { _idUser: user._id, day: date })
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
  }, [setSignups, date, user, dateObj]);

  return (
    <div
      className={
        `${disabled ? "bg-opacity-60" : ""} ${day !== "Freitag" ? "border-r border-r-slate-400" : "mr-1"} bg-opacity-60  flex-1  w-1/5 min-w-[20%]`
      }
      onClick={onDayClicked ? () => {onDayClicked(day)} : () => {}}
    >
      <div className="flex flex-wrap border-b border-b-slate-400 text-center">
        <p
          className={classNames(
            "flex-shrink-0 w-full max-w-full text-red-800 select-none",
            disabled ? "text-opacity-60 " : ""
          )}
        >
          {MOBILE_DAYS[day]}
        </p>
      </div>

      <div>
        {courses?.map((course) => course.filter((dish) => (menuFilter.A && menuFilter.B && menuFilter.C) || (menuFilter.A && dish.tags.includes("Menü A")) || (menuFilter.B && dish.tags.includes("Menü B")) || (menuFilter.C && dish.tags.includes("Menü C")) || ((!menuFilter.A && !menuFilter.B && !menuFilter.C) && !dish.tags.includes("Menü A") && !dish.tags.includes("Menü B") && !dish.tags.includes("Menü C"))))
        .map((course, idx) => (
          <div key={idx}>
            {/* no divider before salats */}
            {idx ? (
              <div
                className="border-2 border-red-700 my-4 mx-2 rounded"
              />
            ) : (
              ""
            )}

            <ul>
              {course.map((dish, idxDish) => {
                
                const selected = signups.find(
                  (signup) => signup.dish.name === dish.name
                );

                return (
                  <MenuPlanEntry
                  key={idxDish}
                  dish={dish}
                  image={images?.find((image) => image?._id === dish?.image)}
                  onDeleteClicked={onDeleteClicked}
                  day={day}
                  disabled={disabled}
                  selected={selected}
                  setDetailDish={setDetailDish}
                  setOpen={setOpen}
                  unselected={!selected && signups.length>0}
                />);
              })}
            </ul>
          </div>
        ))}
        <div className="inline-block">
          {onAddClicked ? <PlusIcon onClick={() => onAddClicked(day)} /> : ""}
        </div>
      </div>
    </div>
  );
}

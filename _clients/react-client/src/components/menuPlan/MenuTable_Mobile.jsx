import React from "react";
import MenuPlanDay from "./MenuPlanDay_Mobile";
import { DAYS, COURSES } from "../../data/clientConfiguration";
import { dateToStandardString } from "../../services/date-service";

export default function MenuTable({
  menuPlan,
  onDayClicked,
  onDeleteClicked,
  onAddClicked,
  allImages,
  setDetailDish,
  setOpen,
  menuFilter
}) {
  function incDate(date, days) {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return dateToStandardString(newDate);
  }

  const dishes = DAYS.map((day) => menuPlan?.days?.[day]).reduce(
    (prevObj, dish, idx) => {
      prevObj[DAYS[idx]] = dish;
      return prevObj;
    },
    {}
  );

  const courses = DAYS.map((day) =>
    dishes[day]?.reduce(
      (last, current) => {
        last[
          COURSES.findIndex(course => current.tags.includes(course))
        ].push(current);
        return last;
      },
      [[], [], []]
    )
  ).reduce((prevObj, course, idx) => {
    prevObj[DAYS[idx]] = course;
    return prevObj;
  }, {});

  const maxNumberOfDishes = COURSES.map((_course, idx) =>
    Math.max.apply(
      Math,
      DAYS.map((day) => courses[day]?.map((course) => course.filter((dish) => (menuFilter.A && menuFilter.B && menuFilter.C) || (menuFilter.A && dish.tags.includes("Menü A")) || (menuFilter.B && dish.tags.includes("Menü B")) || (menuFilter.C && dish.tags.includes("Menü C")) || ((!menuFilter.A && !menuFilter.B && !menuFilter.C) && !dish.tags.includes("Menü A") && !dish.tags.includes("Menü B") && !dish.tags.includes("Menü C"))))
      .map((course) => course.length)).map(
        (courses) => courses?.[idx] || 0
      )
    )
  );

  return (
    <div className='min-h-screen h-fit'>
            <div className='flex min-h-screen h-fit'>
        {DAYS.map((day, idx) => {
          return (
            <MenuPlanDay
              key={day}
              setDetailDish={setDetailDish}
              setOpen={setOpen}
              day={day}
              date={menuPlan?.startDate ? incDate(menuPlan.startDate, idx) : ""}
              onDayClicked={onDayClicked}
              onDeleteClicked={onDeleteClicked}
              onAddClicked={onAddClicked}
              dishes={dishes[day]}
              courses={courses[day]}
              maxNumberOfDishes={maxNumberOfDishes}
              menuFilter={menuFilter}
              images={dishes[day]?.map((dish) =>
                allImages?.find((image) => image._id === dish.image)
              )}
              disabled={
                (onDayClicked &&
                  (!dishes[day] ||
                    new Date(menuPlan.startDate).getTime() +
                      86400 * 1000 * idx <=
                      Date.now() - 3600 * 8 * 1000)) ||
                !dishes[day]
              }
            />
          );
        })}
      </div>
    </div>
  );
}

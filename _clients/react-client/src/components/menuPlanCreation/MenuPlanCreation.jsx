import React, { useState, useEffect } from "react";
import DishCreation from "./DishCreation";
import MenuPlanCreationOverview from "./MenuPlanCreationOverview";
import { MENUPLAN_URL } from "../../data/clientConfiguration";
import restClient from "../../services/rest-client-service";
import { dateToStandardString } from "../../services/date-service";

export default function MenuPlanCreation({ text, menuPlan, setMenuPlan, startDate, initialMenuPlan, menuFilter, setMenuFilter, disabled, handleEditMode, editMode, handleBackClicked, handleForwardClicked, handleWeekClicked, printMode, componentRef, handlePrint}) {
  //const [menuPlan, setMenuPlan] = useState(sentMenuPlan);
  const [currPage, setCurrPage] = useState("overview"); //timeSpan,overview,dishCreation
  const [fetchMenuPlanUrl, setFetchMenuPlanUrl] = useState(`${MENUPLAN_URL}?startDate=${dateToStandardString(startDate)}`);

  function fetchMenuPlan() {
    let menuPlanToSet = (menuPlan && (Object.keys(menuPlan)?.length === 0 && menuPlan?.constructor === Object)) ? undefined : menuPlan;
    if (menuPlanToSet?.state === 'published') handleEditMode();
    if (!menuPlanToSet || menuPlanToSet?.state === "cancelled") {
      setMenuPlan({createdBy:""});
      restClient
        .get(fetchMenuPlanUrl)
        .then((response) => {
          let foundMenuplan = response.data.find(menuPlan => menuPlan?.state !== 'cancelled');
          if (!foundMenuplan) {
            setMenuPlan(initialMenuPlan);
            restClient
              .post(MENUPLAN_URL, initialMenuPlan)
              .then((response) => {
                setMenuPlan(response.data);
              })
              .catch((response) =>
                console.error(
                  `Saving to '${MENUPLAN_URL}'
          failed.`,
                  response
                )
              );
          } else {
            setMenuPlan(foundMenuplan);
          }
        })
        .catch((response) =>
          console.error(
            `In get with start date: Saving to '${MENUPLAN_URL}'
    failed.`,
            response
          )
        );
    }
  }

  useEffect(fetchMenuPlan, [menuPlan, fetchMenuPlanUrl, initialMenuPlan, handleEditMode, setMenuPlan]);
  useEffect(() => {
    let newFetchUrl = `${MENUPLAN_URL}?startDate=${dateToStandardString(startDate)}`;
    setFetchMenuPlanUrl(newFetchUrl);
  }, [startDate]);

  function toggleDayDisabled(day) {
    let newMenuplan = { ...menuPlan, days: { ...menuPlan?.days, [day]: menuPlan?.days?.[day]?undefined:[] } };
    setMenuPlan(newMenuplan);
  }

  //Current day and Meal
  //passed from MenuPlanCreationOverview to DishCreation
  //Meal will be an empty object, when a new meal is addeds
  const [currDay, setCurrDay] = useState("Montag");
  const [currMeal, setCurrMeal] = useState({});
  return (
    <div className="w-full">
      {currPage === "overview" ? (
        <MenuPlanCreationOverview
          text={text}
          startDate={startDate}
          menuPlan={menuPlan}
          setCurrPage={setCurrPage}
          setMenuPlan={setMenuPlan}
          currDay={currDay}
          setCurrDay={setCurrDay}
          setCurrMeal={setCurrMeal}
          disabled={disabled}
          toggleDayDisabled={toggleDayDisabled}
          editMode={editMode}
          menuFilter={menuFilter}
          setMenuFilter={setMenuFilter}
          handleEditMode={handleEditMode}
          handleBackClicked={handleBackClicked}
          handleForwardClicked={handleForwardClicked}
          handleWeekClicked={handleWeekClicked}
          printMode={printMode}
          componentRef={componentRef}
          handlePrint={handlePrint}
        />
      ) : currPage === "dishCreation" ? (
        <DishCreation
          menuPlan={menuPlan}
          setCurrPage={setCurrPage}
          setMenuPlan={setMenuPlan}
          currDay={currDay}
          currMeal={currMeal}
        />
      ) : (
        <div>404 - Page Not Found!</div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useContext } from "react";
import TopBar from "../menuPlan/MenuTopBar";
import restClient from "../../services/rest-client-service";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../..";
import { MENUPLAN_URL } from "../../data/clientConfiguration";
import Dropdown from "../misc/Dropdown";
import Button from "../misc/Button";
import {
  dateToStandardString,
  getCurrentStartDate,
} from "../../services/date-service";

export default function MenuPlanTimeSpan({
  editMode,
  menuPlan,
  setCurrPage,
  setEditMode,
  setMenuPlan,
}) {
  const navigate = useNavigate();
  const [user] = useContext(UserContext);
  const [selectedTimeSpan, setSelectedTimeSpan] = useState(
    dateToStandardString(getCurrentStartDate())
  );
  const [checkedDays, setCheckedDays] = useState({
    Montag: false,
    Dienstag: false,
    Mittwoch: false,
    Donnerstag: false,
    Freitag: false,
  });

  useEffect(() => {
    //restClient.get(MENUPLAN_URL,{},{startDate:selectedTimeSpan, createdBy: user._id})
    restClient
      .get(MENUPLAN_URL, {}, { startDate: selectedTimeSpan })
      .then((response) =>
        response.data.filter((mp) => mp.state !== "cancelled")
      )
      .then((data) => setMenuPlan(data[0]))
      .catch((response) =>
        console.error(`Loading from '${MENUPLAN_URL}' failed.`, response)
      );
  }, [selectedTimeSpan, setMenuPlan]);
  //},[selectedTimeSpan,setMenuPlan,user]);

  function handleBackClicked() {
    navigate("/menu-plan");
  }

  function handleTimeSpanChange(timeValue) {
    setSelectedTimeSpan(timeValue);
  }

  function handleCheckboxChange(e) {
    setCheckedDays({ ...checkedDays, [e.target.name]: e.target.checked });
  }

  function getDateString(startDate) {
    let endDate = new Date(startDate.getTime());
    endDate.setDate(endDate.getDate() + 4);
    return `${startDate.toLocaleDateString()}-${endDate.toLocaleDateString()}`;
  }

  function getEndDate(startDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(startDate.getTime());
    endDate.setDate(endDate.getDate() + 4);
    return dateToStandardString(endDate);
  }

  function getTimeSpans() {
    let timeSpans = [];
    let startDate = getCurrentStartDate();
    for (let i = 0; i <= 52; i++) {
      timeSpans.push({
        value: dateToStandardString(startDate),
        content: getDateString(startDate),
      });
      startDate.setDate(startDate.getDate() + 7);
    }
    return timeSpans;
  }

  async function handleCreateButton() {
    if (!menuPlan) {
      const newMenuPlan = {
        createdBy: user._id,
        days: Object.entries(checkedDays).reduce((acc, [day, checked]) => {
          if (checked) {
            acc[day] = [];
          }
          return acc;
        }, {}),
        startDate: selectedTimeSpan,
        endDate: getEndDate(selectedTimeSpan),
      };
      restClient
        .post(MENUPLAN_URL, newMenuPlan)
        .then((response) => {
          setMenuPlan(response.data);
          setEditMode("edit");
          setCurrPage("overview");
          navigate("/menu-plan-creation/" + response.data._id);
        })
        .catch((response) =>
          console.error(
            `Saving to '${MENUPLAN_URL}'
      failed.`,
            response
          )
        );
    } else {
      setEditMode("edit");
      setCurrPage("overview");
      navigate("/menu-plan-creation/" + menuPlan._id);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        handleBackClicked={handleBackClicked}
        text={"Menüplan erstellen"}
      ></TopBar>
      <div className="flex flex-col items-center justify-between grow pb-5">
        <div className="flex flex-col items-center grow">
          <div className="flex justify-center relative mb-24 mt-8">
            <Dropdown
              placeholder={"Zeitraum wählen ..."}
              options={getTimeSpans()}
              selectedOption={selectedTimeSpan}
              onChange={handleTimeSpanChange}
            />
            {/*<select id="time-span-select" value={selectedTimeSpan} onChange={handleTimeSpanChange}>
              {getTimeSpans().map(timeSpan =>
                <option key={timeSpan.value} value={timeSpan.value}>{timeSpan.content}</option>
              )}
              </select>*/}
          </div>
          <h2 className="text-center font-bold my-2 mx-0">Tage</h2>

          <div className="grid grid-cols-1 grid-rows-5">
            {["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"].map(
              (day, index) => (
                <div className="flex items-center" key={index}>
                  <input
                    id="checked-checkbox"
                    type="checkbox"
                    name={day}
                    className="w-8 h-6 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 my-1"
                    checked={
                      menuPlan?.days
                        ? menuPlan.days[day] !== undefined
                        : checkedDays[day]
                    }
                    onChange={handleCheckboxChange}
                    disabled={menuPlan !== undefined}
                  />
                  <label
                    htmlFor="checked-checkbox"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {day}
                  </label>
                </div>
              )
            )}
            {/*<div key={index} className="grid grid-cols-2 items-center gap-4 mb-2">
                  <label htmlFor={`checkbox-${day}`} className="text-left text-lg">{day}</label>
                  <input
                    className="w-8 h-6 cursor-pointer"
                    type="checkbox"
                    id={`checkbox-${day}`}
                    name={day}
                    checked={menuPlan?.days?menuPlan.days[day]!==undefined:checkedDays[day]}
                    onChange={handleCheckboxChange}
                    disabled={menuPlan!==undefined}
              />
              </div> */}
          </div>
        </div>
        <Button onClick={handleCreateButton}>
          {menuPlan ? "Ändern" : "Erstellen"}
        </Button>
      </div>
    </div>
  );
}

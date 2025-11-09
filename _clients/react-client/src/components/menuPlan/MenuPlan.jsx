import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import {MenuTable} from "./MenuTable";
import TopBar from "./MenuTopBar";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { UserContext } from "../..";
import { MENUPLAN_URL, MONTHS, DAYS } from "../../data/clientConfiguration";
import MenuPlanCreation from "../menuPlanCreation/MenuPlanCreation";
import { dateToStandardString } from "../../services/date-service";
import restClient from "../../services/rest-client-service";
import { useReactToPrint } from 'react-to-print';

export default function MenuPlan() {
  const navigate = useNavigate();
  const params = useParams();
  const [query] = useSearchParams();
  const [startDate, setStartDate] = useState(new Date(params.startDate));
  const [menuPlan, setMenuPlan] = useState({});
  const [user] = useContext(UserContext);
  const [menuFilter, setMenuFilter] = useState({A:true, B:true, C:true});
  const [initialMenuPlan, setInitialMenuPlan] = useState({});
  const [editMode, setEditMode] = useState(query?.get("editMode") || false);
  const disabled = useMemo(() => {
    let initialDisabled = {};
    DAYS.forEach(day => initialDisabled[day] = menuPlan?.days?.[day] === undefined);
    return initialDisabled;
  }, [menuPlan])
  const text = getDateString(startDate);
  const [printMode, setPrintMode] = useState(false);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: handleOnBeforeGetContent,
    onAfterPrint: handleOnAfterPrint,
  });

  useEffect(() => {
    let endDate = new Date(startDate.getTime());
    endDate.setDate(endDate.getDate() + 4);

    setInitialMenuPlan({
      createdBy: user._id,
      days: {},
      startDate: dateToStandardString(startDate),
      endDate: dateToStandardString(endDate),
      state: "draft"
    })
  }, [startDate, user._id]);
  useEffect(() => {
    if (user._id) {
      let isChef = user.roles.includes("chef");
      restClient.get(
        MENUPLAN_URL +
          "?startDate=" +
          dateToStandardString(startDate) +
          (isChef ? "" : "&state=published")
      )
        .then((response) => response.data)
        .then((data) => {
          setMenuPlan(data[0]);
  
          if(isChef && (data.length === 0 || data[0].state !== "published")) {
            setEditMode(true);
          }
          
        })
        .catch((response) =>
          console.error(
            `Loading items for '${MENUPLAN_URL}'
            failed.`,
            response
          )
        );
    }
  }, [startDate, user]);

  function getNSpaces(n) {
    let retStr = '';
    for (let idx = 0; idx < n; idx++) {
      retStr += ' ';
    }
    return retStr;
  }

  function getDateString(startDate) {
    let endDate = new Date(startDate.getTime());
    endDate.setDate(endDate.getDate() + 4);
    let startDay = startDate.getDate();
    let endDay = endDate.getDate();
    let startMonth = MONTHS[startDate.getMonth()];
    let endMonth = MONTHS[endDate.getMonth()];
    
    return `${getNSpaces(9 - startMonth.length)}${startDay}. ${startMonth} bis ${endDay}. ${endMonth}${getNSpaces(9 - endMonth.length)}`;
  }
  function handleBackClicked() {
    let newDate = new Date(startDate.getTime());
    newDate.setDate(newDate.getDate() - 7);
    navigate("/menu-plan/" + dateToStandardString(newDate));
    setStartDate(newDate);
  }

  function handleForwardClicked() {
    let newDate = new Date(startDate.getTime());
    newDate.setDate(newDate.getDate() + 7);
    navigate("/menu-plan/" + dateToStandardString(newDate));
    setStartDate(newDate);
  }
  function handleWeekClicked(newDate) {
    newDate.setHours(startDate.getHours());
    navigate("/menu-plan/" + dateToStandardString(newDate));
    setStartDate(newDate);
  }

  function handleDayClicked(day) {
    let dayNum = DAYS.indexOf(day);
    let date = new Date(startDate.getTime());
    date.setDate(date.getDate() + dayNum);
    navigate('/order/' + dateToStandardString(date));
  }

  function handleEditMode() {
    setEditMode(!editMode);
    setStartDate(new Date(startDate.getTime()));
  }

  function handleOnBeforeGetContent() {
    setPrintMode(true);
    return new Promise((resolve) => {
      resolve();
    });
  };

  function handleOnAfterPrint() {
    setPrintMode(false);
  };

  return !editMode ? (
    <div className="">
      <div className="h-[10vh] ">
        <TopBar
          handleBackClicked={handleBackClicked}
          handleForwardClicked={handleForwardClicked}
          handleWeekClicked={handleWeekClicked}
          editMode={editMode}
          startDate={startDate}
          text={text}
          menuFilter={menuFilter}
          setMenuFilter={setMenuFilter}
          menuPlan={menuPlan}
          disabled={disabled}
          handlePrint={handlePrint}
        />
      </div>
      <div className="h-[90vh]">
        <MenuTable
          menuPlan={menuPlan}
          disabled={disabled}
          onDayClicked={user.roles.includes("customer") && handleDayClicked}
          menuFilter={menuFilter}
          printMode={printMode}
          ref={componentRef} 
        />
      </div>
    </div>
  ) : (
    <MenuPlanCreation
      text={text}
      menuPlan={menuPlan}
      setMenuPlan={setMenuPlan}
      startDate={startDate}
      initialMenuPlan={initialMenuPlan}
      disabled={disabled}
      editMode={editMode}
      menuFilter={menuFilter}
      setMenuFilter={setMenuFilter}
      handleEditMode={handleEditMode}
      handleBackClicked={handleBackClicked}
      handleForwardClicked={handleForwardClicked}
      handleWeekClicked={handleWeekClicked}
      handlePrint={handlePrint}
      componentRef={componentRef} 
      printMode={printMode}
    />
    
  );
}

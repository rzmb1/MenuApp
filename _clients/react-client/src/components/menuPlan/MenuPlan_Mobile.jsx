import React, { useState, useEffect, useContext } from "react";
import restClient from "../../services/rest-client-service";
import MenuTable from "./MenuTable_Mobile";
import TopBar from "./MenuTopBar_Mobile";
import { useNavigate, useParams } from "react-router-dom";
import { MENUPLAN_URL, DAYS, SIGNUP_URL } from "../../data/clientConfiguration";
import { dateToStandardString } from "../../services/date-service";
import DishDetails from "../order/DishDetails";
import { UserContext } from "../..";

export default function MenuPlan() {
  const navigate = useNavigate();
  const params = useParams();
  const [startDate, setStartDate] = useState(new Date(params.startDate));
  const [endDate, setEndDate] = useState(new Date("1900/01/01"));
  const [menuPlan, setMenuPlan] = useState({});
  const [user] = useContext(UserContext);
  const [allImages, setAllImages] = useState();
  const [menuFilter, setMenuFilter] = useState({A:true, B:true, C:true});

  const [open, setOpen] = useState(false);
  const [detailDish, setDetailDish] = useState(null);

  const fetchAverageRating = async (dishName) => {
    try {
      const response = await restClient.get(`${SIGNUP_URL}/average-rating/${dishName}`);
      return response.data.averageRating;
    } catch (error) {
      console.error("Fehler beim Laden der durchschnittlichen Bewertung: ", error);
      return null;
    }
  };

  useEffect(() => {
    if (endDate.getFullYear() === 1900) {
      setNewEndDate(startDate);
    }

    restClient.get(MENUPLAN_URL + "?startDate=" + dateToStandardString(startDate) + "&state=published")
      .then((response) => response.data)
      .then((data) => {
        if (data[0]) {
          (async () => {
            try {
              const updatedMenuPlan = {};
              for (const dayKey in data[0].days) {
                const dayDishes = data[0].days[dayKey];
                const dishesWithRatings = await Promise.all(dayDishes.map(async (dish) => {
                  const avgRating = await fetchAverageRating(dish.name);
                  return { ...dish, avgRating };
                }));
                updatedMenuPlan[dayKey] = dishesWithRatings;
              }
          
              setMenuPlan({...data[0], days: updatedMenuPlan});
            } catch (error) {
              // Handle errors here
              console.error(error);
            }
          })();
        }
        else {
          setMenuPlan({});
        }
        
        return setMenuPlan(data[0]);
      })
      /*.catch((response) =>
>>>>>>> _clients/react-client/src/components/menuPlan/MenuPlan_Mobile.jsx
        console.error(
          `Loading items for '${MENUPLAN_URL}'
    failed.`,
          response
        )
      )*/;
    restClient
      .get("/api/images")
      .then((response) => {
        setAllImages(response.data);
      })
      .catch((response) => {
        console.error("Getting image failed.", response);
      });
  }, [startDate, endDate]);

  function getDateString(startDate) {
    return `${startDate.getDate()}.${
      startDate.getMonth() + 1
    } bis ${endDate.getDate()}.${endDate.getMonth() + 1}`;
  }
  function setNewEndDate(startDate) {
    let newEndDate = new Date(startDate.getTime());
    newEndDate.setDate(newEndDate.getDate() + 4);
    setEndDate(newEndDate);
  }
  function handleBackClicked() {
    let newDate = new Date(startDate.getTime());
    newDate.setDate(newDate.getDate() - 7);
    navigate("/menu-plan/" + dateToStandardString(newDate));
    setStartDate(newDate);
    setNewEndDate(newDate);
  }

  function handleForwardClicked() {
    let newDate = new Date(startDate.getTime());
    newDate.setDate(newDate.getDate() + 7);
    navigate("/menu-plan/" + dateToStandardString(newDate));
    setStartDate(newDate);
    setNewEndDate(newDate);
  }
  function handleDayClicked(day) {
    let dayNum = DAYS.indexOf(day);
    let date = new Date(startDate.getTime());
    date.setDate(date.getDate() + dayNum);
    navigate("/order/" + dateToStandardString(date));
  }
  return (
    <div className="h-full w-full">
      <DishDetails open={open} setOpen={setOpen} detailDish={detailDish} allImages={allImages} />
      <div className="h-[10vh]">
        <TopBar
          handleBackClicked={handleBackClicked}
          handleForwardClicked={handleForwardClicked}
          text={getDateString(startDate)}
          menuFilter={menuFilter}
          setMenuFilter={setMenuFilter}
        ></TopBar>
      </div>
      <div className="h-[90vh] w-full min-w-full">
        <MenuTable
          allImages={allImages}
          menuPlan={menuPlan}
          onDayClicked={user.roles.includes("customer") && handleDayClicked}
          setDetailDish={setDetailDish}
          setOpen={setOpen}
          menuFilter={menuFilter}
        ></MenuTable>
      </div>
    </div>
  );
}

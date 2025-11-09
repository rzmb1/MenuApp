import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../menuPlan/MenuTopBar";
import DishDetailView from "./DishDetailView";
import restClient from "../../services/rest-client-service";
import { UserContext } from "../..";
import NothingIcon from "./Nothing.png";
import UnknownIcon from "./Unknown.png";
import {
  MENUPLAN_URL,
  SIGNUP_URL,
  DAYS,
  MONTHS,
  MENUS,
  COURSES,
  NULLDISH,
  MENU_COLORS,
} from "../../data/clientConfiguration";
import { Disclosure } from "@headlessui/react";
import { dateToStandardString } from "../../services/date-service";

export default function MenuPlanSignup() {
  const { date } = useParams();
  const [dishes, setDishes] = useState([]);
  const [selection, setSelection] = useState({});
  const [user] = useContext(UserContext);
  const [selectedImages, setSelectedImages] = useState({});
  const navigate = useNavigate();
  //fetch dishes from menu plan
  useEffect(() => {
    let startDate = new Date(date);
    startDate.setDate(startDate.getDate() - (startDate.getDay() || 7) + 1);
    restClient.get(
      MENUPLAN_URL +
        "?startDate=" +
        dateToStandardString(startDate) +
        "&state=published"
    )
      .then((response) => response.data)
      .then((data) =>
        setDishes(data[0].days[DAYS[new Date(date).getDay() - 1]])
      )
      .catch((response) =>
        console.error(
          `Loading items for '${MENUPLAN_URL}'
    failed.`,
          response
        )
      );
  }, [date]);
  useEffect(() => {
    restClient
      .get(SIGNUP_URL, {}, { _idUser: user._id, day: date })
      .then((response) => response.data)
      .then((data) => {
        let newSelection = {};
        for (let course of COURSES) {
          newSelection[course] = data.find((signup) =>
            signup.dish.tags.includes(course)
          );
        }
        setSelection(newSelection);
      })
      .catch((response) =>
        console.error(
          `Loading Signups
          failed.`,
          response
        )
      );
  }, [setSelection, user, date]);
  useEffect(() => {
    for (let course of COURSES) {
      if (selection[course]?.dish.image) {
        restClient
          .get("/api/images/" + selection[course].dish.image)
          .then((response) => {
            setSelectedImages((selectedImages) => {
              return { ...selectedImages, [course]: response.data.image };
            });
          })
          .catch((response) =>
            console.error("Getting image failed.", response)
          );
      } else if (selection[course]) {
        setSelectedImages((selectedImages) => {
          return { ...selectedImages, [course]: NothingIcon };
        });
      } else {
        setSelectedImages((selectedImages) => {
          return { ...selectedImages, [course]: UnknownIcon };
        });
      }
    }
  }, [selection]);

  function setDish(course, dish) {
    if (selection[course]?._id) {
      restClient
        .patch(SIGNUP_URL + "/" + selection[course]._id, {
          dish: { ...dish, statistics: undefined },
        })
        .then((response) => response.data)
        .then((data) =>
          setSelection((selection) => {
            return { ...selection, [course]: data };
          })
        )
        .catch((response) =>
          console.error(
            `Posting Signup
          failed.`,
            response
          )
        );
    } else {
      restClient
        .post(SIGNUP_URL, {
          _idUser: user._id,
          day: date,
          dish: { ...dish, statistics: undefined },
        })
        .then((response) => response.data)
        .then((data) =>
          setSelection((selection) => {
            return { ...selection, [course]: data };
          })
        )
        .catch((response) =>
          console.error(
            `Posting Signup
          failed.`,
            response
          )
        );
    }
  }

  function handleBackClicked() {
    let startDate = new Date(date);
    startDate.setDate(startDate.getDate() - (startDate.getDay() || 7) + 1);
    navigate("/menu-plan/" + dateToStandardString(startDate));
  }
  function handleSignOutClicked() {
    for (let course of COURSES) {
      setDish(course, { ...NULLDISH, tags: [course] });
    }
  }
  function handleMenuClicked(menue) {
    let menueDishes = dishes.filter((dish) => dish.tags.includes(menue));
    for (let course of COURSES) {
      setDish(
        course,
        menueDishes.find((dish) => dish.tags.includes(course)) ?? {
          ...NULLDISH,
          tags: [course],
        }
      );
    }
  }
  return (
    <div className="h-full signup">
      <div className="h-[10%]">
        <TopBar
          handleBackClicked={handleBackClicked}
          text={`${DAYS[new Date(date).getDay() - 1]} ${new Date(
            date
          ).getDate()}. ${MONTHS[new Date(date).getMonth()]}`}
        ></TopBar>
      </div>
      <div className="h-[90%]">
        {MENUS.map((menue, idx) => (
          <button
            key={idx}
            className={`text-white font-bold py-2 px-4 rounded self-center m-3 ${MENU_COLORS[menue]}`}
            onClick={() => handleMenuClicked(menue)}
          >
            {menue}
          </button>
        ))}
        <div>
          {COURSES.map((course) => {
            let courseDishes = dishes.filter((dish) =>
              dish.tags.find((tag) => tag === course)
            );
            return (
              courseDishes.length !== 0 && (
                <Disclosure
                  as={"li"}
                  className="border grid list-none justify-items-center justify-center"
                >
                  <Disclosure.Button>
                    <div className="text-4xl">{course}</div>
                    <div className="">
                      <img
                        className="w-[2vw] h-[2vw] mr-2"
                        alt="food"
                        src={selectedImages[course]}
                      />
                      {selection[course]?.dish.name ?? "keine Auswahl"}
                    </div>
                  </Disclosure.Button>
                  <Disclosure.Panel>
                    <div className="flex flex-wrap">
                      {[...courseDishes, { ...NULLDISH, tags: [course] }].map(
                        (dish, idx) => (
                          <DishDetailView
                            key={idx}
                            dish={dish}
                            selected={
                              selection[course]?.dish.name === dish?.name
                            }
                            course={course}
                            onClick={() => setDish(course, dish)}
                          />
                        )
                      )}
                    </div>
                  </Disclosure.Panel>
                </Disclosure>
              )
            );
          })}
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-center m-3"
          onClick={handleBackClicked}
        >
          Bestätigen
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded self-center m-3"
          onClick={handleSignOutClicked}
        >
          Für diesen Tag Abmelden
        </button>
      </div>
    </div>
  );
}

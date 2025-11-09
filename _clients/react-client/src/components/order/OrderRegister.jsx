import restClient from "../../services/rest-client-service";
import DishSelection from "./DishSelection";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { COURSES, DAYS, MENUPLAN_URL, MONTHS, NULLDISH, SIGNUP_URL } from "../../data/clientConfiguration";
import notifyer from "../../services/notifyer-service";
import MenuTopBarMobile from "../menuPlan/MenuTopBar_Mobile";
import MenuTopBar from "../menuPlan/MenuTopBar";
import { dateToStandardString } from "../../services/date-service";
import { SCREEN_SIZE_CONDITIONER } from "../../data/clientConfiguration.js";

const dayMap = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

export default function OrderRegister() {
  let { date } = useParams();

  const [user] = useState(JSON.parse(localStorage.getItem("user")) || {});

  const [allImages, setAllImages] = useState([]);
  const [todaysDishes, setTodaysDishes] = useState([]);
  const [order, setOrder] = useState(null);
  const [isRegisterDisabled, setRegisterDisabled] = useState(false);

  const navigate = useNavigate();

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

    restClient.get(SIGNUP_URL, {}, { '_idUser': user._id, 'day': date })
      .then((response) => response.data)
      .then((data) => {
        setOrder(data)
      })
      .catch(response => console.error(`Loading Signups failed.`, response));

    const orderDate = new Date(date);
    orderDate.setDate(orderDate.getDate() - (orderDate.getDay() + 6) % 7);

    restClient.get(`${MENUPLAN_URL}?startDate=${dateToStandardString(orderDate)}&state=published`)
      .then((response) => {
        let dishes = response.data[0].days[dayMap[new Date(date).getDay()]];

        if(dishes === undefined || dishes.length === 0) {
          notifyer.error("Für diesen Tag sind keine Anmeldungen vorgesehen!");
          navigate(-1);
          return;
        }

        (async() => {
          dishes = await Promise.all(
            dishes = dishes.map(async (dish) => {
              return{
              ...dish, avgRating: await fetchAverageRating(dish.name)
            }})
          ).then((response) => {
            setTodaysDishes(response);
          });
        })();
        
      })
      .catch((reason) => console.error(reason));

    async function getAllImages() {
      restClient.get('/api/images').then(response => {
        const images = response.data;
        setAllImages(images);
      })
      .catch(response => {
        console.error('Getting image failed.', response);
      });
    }

    getAllImages();
  }, [setAllImages, date, user, navigate]);

  function updateOrder(state, dishes, successMessage) {

    restClient.get(SIGNUP_URL, {}, { '_idUser': user._id, 'day': date })
      .then((response) => {

        if(response.data.length !== 0) {
          // "Re-"subscribe or Unsubscribe
          Promise.all(COURSES.map((key) => {
            const dish = dishes[key] ?? {...NULLDISH, tags: [key]};
            const signupId = response.data.find((resp) => resp.dish.tags.includes(key));

            if(signupId !== undefined) {
              return restClient.patch(`${SIGNUP_URL}/${signupId._id}`, {
                'dish': {...dish, statistics: undefined, avgRating: undefined}
              });
            } else {
              return restClient.post(`${SIGNUP_URL}`, {
                '_idUser': user._id,
                'day': date,
                'dish': {...dish, statistics: undefined, avgRating: undefined}
              });
            }


          })).then((_response) => {
            notifyer.success(successMessage);
            navigate(-1);
          })
          .catch((response) => notifyer.error(response));
        } else {
          // Subscribe or Unsubscribe
          Promise.all(COURSES.map((key) => {

            const dish = dishes[key] ?? {...NULLDISH, tags: [key]};
  
            return restClient.post(`${SIGNUP_URL}`, {
                '_idUser': user._id,
                'day': date,
                'dish': {...dish, statistics: undefined, avgRating: undefined}
              });
              
            }))
            .then((_response) => {
              notifyer.success(successMessage);
              navigate(-1);
            })
            .catch((response) => notifyer.error(response));
        }

      });
  }

  function getOrderState() {
    if(order === null) {
      return "n/a";
    }

    const unsubscribedDishes = order?.filter(order => order.dish.name === "Abgemeldet");

    if(order.length === 0) {
      return "n/a";
    } else if(unsubscribedDishes.length === order.length) {
      return "unsubscribed";
    } else {
      return "subscribed";
    }
  }

  const handleRegister = (dishes) => {
    updateOrder("subscribed", dishes, "Angemeldet!");
  };

  const handleDeregister = (_dishes) => {
    updateOrder("unsubscribed", COURSES.map(course => { return {...NULLDISH, tags: [course]}}), "Abgemeldet");
  };

  const handleReregister = (dishes) => {
    updateOrder("subscribed", dishes, "Umgemeldet!");
  };

  const handleOrderChange = (dishes) => {
    setRegisterDisabled(Object.keys(dishes).length === 0);
  };

  const buttons = [
    {
      name: "Anmelden",
      color: "bg-emerald-500",
      hover: "bg-emerald-800",
      handler: handleRegister,
    },
    {
      name: "Abmelden",
      color: "bg-red-500",
      hover: "bg-red-800",
      handler: handleDeregister,
      disabled: getOrderState() === "unsubscribed",
    },
  ];

  // Replace with this button, if the user is already "subscribed"
  if (getOrderState() === "subscribed") {
    buttons[0] = {
      name: "Ummelden",
      color: "bg-indigo-500",
      hover: "bg-indigo-800",
      handler: handleReregister,
    };
  }

  // 'todaysDishes.length === 0' => in case if the date is invalid (no dishes)
  buttons[0].disabled = isRegisterDisabled || todaysDishes.length === 0;

  function handleBackClicked() {
    navigate(-1);
  }

  return (
    <>
      <div className="h-[10vh]">
        {SCREEN_SIZE_CONDITIONER?
        <MenuTopBar
          handleBackClicked={handleBackClicked}
          text={`${DAYS[new Date(date).getDay() - 1]} ${new Date(
            date
          ).getDate()}. ${MONTHS[new Date(date).getMonth()]}`}
        />
        :
        <MenuTopBarMobile
          handleBackClicked={handleBackClicked}
          text={`${DAYS[new Date(date).getDay() - 1]} ${new Date(
            date
          ).getDate()}. ${MONTHS[new Date(date).getMonth()]}`}
        />}
      </div>

      { todaysDishes.length !== 0 &&
      <DishSelection
        date={date}
        allImages={allImages}
        dishes={todaysDishes}
        actions={buttons}
        onOrderChange={handleOrderChange}
        initialOrder={order}
        hidePlaceholders={false}
      />}
    </>
  );
}

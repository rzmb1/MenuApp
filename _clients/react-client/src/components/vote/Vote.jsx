import { useContext, useEffect, useState } from "react";
import { UserContext } from "../..";
import restClient from "../../services/rest-client-service";
import DishSelection from "../order/DishSelection";
import notifyer from "../../services/notifyer-service";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { SCREEN_SIZE_CONDITIONER, SIGNUP_URL } from "../../data/clientConfiguration";
import MenuTopBarMobile from "../menuPlan/MenuTopBar_Mobile";
import { useNavigate } from "react-router-dom";
import MenuTopBar from "../menuPlan/MenuTopBar";


export default function Vote() {

    const [user] = useContext(UserContext);
    const [allImages, setAllImages] = useState([]);
    const [poll, setPoll] = useState(null);
    const [dishes, setDishes] = useState([]);
    const [fetchingPoll, setFetchingPoll] = useState(true);
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

    const handleVote = (dishes) => {
        restClient.post(`/api/votes`, {
          poll: poll.pollId,
          user: poll.userId,
          choices:  {
            vorspeise: dishes?.Vorspeise?.name,
            hauptspeise: dishes?.Hauptspeise?.name,
            nachspeise: dishes?.Nachspeise?.name
          }
        }).then((_response) => {
          notifyer.success("Du hast erfolgreich abgestimmt!");
          handleBackClicked();
        })
        .catch((response) => notifyer.error(response));
    };

    const buttons = [
        {
          name: "Abstimmen",
          color: "bg-emerald-500",
          hover: "bg-emerald-800",
          handler: handleVote,
        },
      ];


    useEffect(() => {
        if(user._id === undefined) {
            return;
        }

        restClient.get(`/api/polls/voteoptions/${user._id}`, {}, {})
      .then((response) => response.data)
      .then((data) => {
        let dishes = [...data.options?.['vorspeisen'], ...data.options?.['hauptspeisen'], ...data.options?.['nachspeisen']];
        console.log("Dishes", dishes);
        (async() => {
          await Promise.all(
            dishes = dishes.map(async (dish) => {
              return{
              ...dish, avgRating: await fetchAverageRating(dish.name)
            }})
          ).then((response) => {
            setDishes(response);
          });
        })();

        setPoll(data);
        setFetchingPoll(false);
      })
      .catch(response => {
        console.error(`Loading votings failed.`, response);
        setFetchingPoll(false);
      });

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
    }, [user._id]);

    const handleOrderChange = (_dishes) => {
        // setRegisterDisabled(Object.keys(dishes).length === 0);
      };

    function handleBackClicked() {
      navigate(-1);
    }

    function getNoPollPlaceholder() {
      if(!fetchingPoll) {
        return <div className="flex justify-center items-center flex-col w-full h-full">
                <XCircleIcon className="text-red-400 w-32 h-32" />
                <span className="text-lg">Momentan gibt es keine Abstimmung ...</span>
                <span className="text-lg">Schau doch später wieder vorbei!</span>
              </div>
      }

      return "";
        
    }

    return (
        <>

        <div className="h-[10vh]">
          {SCREEN_SIZE_CONDITIONER ?
          <MenuTopBar
            handleBackClicked={handleBackClicked}
            text={"Abstimmung"}
          />
          :
          <MenuTopBarMobile
            handleBackClicked={handleBackClicked}
            text={"Abstimmung"}
          />}
        </div>

            { poll !== null ?
                <DishSelection
                    date={new Date()}
                    allImages={allImages}
                    dishes={dishes}
                    actions={buttons}
                    onOrderChange={handleOrderChange}
                    initialOrder={[]}
                    hideMenus={true}
                    hidePlaceholders={false}
            />
              :
              getNoPollPlaceholder()
          
          }
        
        </>
    );
}
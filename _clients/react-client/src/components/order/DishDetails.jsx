import { Dialog, Transition } from "@headlessui/react";
import { useParams } from 'react-router-dom'
import { Fragment, useState, useEffect, useContext } from "react";
import { StarIcon as SolidStarIcon } from "@heroicons/react/24/solid";
import { StarIcon as OutlineStarIcon } from "@heroicons/react/24/outline";
import restClient from "../../services/rest-client-service";
import { SIGNUP_URL } from "../../data/clientConfiguration";
import { UserContext } from '../..';
import MenuToggle from "../menuPlanCreation/MenuToggle";
import notifyer from "../../services/notifyer-service";
import CommentsList from "../statistics/CommentsList";

export default function DishDetails({ detailDish, open, setOpen, allImages }) {

  function closeModal() {
    setOpen(false);
  }

  const [signup, setSignup] = useState({});
  const [user] = useContext(UserContext);
  const { date } = useParams();
  const [canRate, setCanRate] = useState(true);
  const [rating, setRating] = useState(0);
  const [ratingComment,setRatingComment]=useState("");
  const [numberOfRatings, setNumberOfRatings] = useState(0);
  const [previousComment, setPreviousComment] = useState(undefined);
  const [commentsListKey, setCommentsListKey] = useState(Date.now());

  const updateCommentsListKey = () => {
    setCommentsListKey(Date.now());
  };

  useEffect(() => {
    restClient
      .get(SIGNUP_URL, {}, { _idUser: user._id, day: date })
      .then((response) => response.data.find(signup => signup.dish.name === detailDish?.name))
      .then((data) => {
        if (data && new Date(data.day) < new Date()) {
          setSignup(data);
          setRating(data.rating);
          setRatingComment(data.comment??"");
          setCanRate(true); // dish matches with signup -> rating allowed
        } else {
          setRating(0);
          setRatingComment("");
          setCanRate(false); // dish does not match with signup -> rating not allowed
        }
      })
      .catch((response) =>
        console.error("Loading Signup failed.", response)
      );
  }, [user, date, detailDish]);

  useEffect(() => {
      if (detailDish) {
        restClient.get(`${SIGNUP_URL}/number-of-ratings/${detailDish.name}`)
          .then((response) => {
            setNumberOfRatings(response.data.totalRatings);
          })
          .catch((error) => {
            console.error("Fehler beim Laden der Anzahl der Bewertungen:", error);
          });
      }
  }, [detailDish]);
  

  const submitRating = async () => {
    try {
      if(!rating && ratingComment === "" && !signup.comment && !signup.rating) {
        notifyer.error("Felder sind nicht befüllt!");
        return;
      }
      const response = await restClient.patch(`${SIGNUP_URL}/${signup._id}`, {
        rating: rating??undefined,
        comment: ratingComment!==""?ratingComment:null
      });
      let messageParts=[];
      if(response.data.rating){
        messageParts.push(response.data.rating + ' Sterne');
      }
      if(response.data.comment) {
        messageParts.push(response.data.comment);
      }
      setSignup(response.data);
      setRating(response.data.rating??0);
      setRatingComment(response.data.comment??"");

      // Check if comment changed
      if (response.data.comment !== previousComment) {
        updateCommentsListKey(); // update refresh key
        setPreviousComment(response.data.comment); 
      }
  
      if(messageParts.length>0) {
        notifyer.info("Bewertung gesendet: " + messageParts.join(", "));
      } else {
        notifyer.info("Bewertung gelöscht");
      }
      
    } catch (error) {
      console.error("Fehler beim Senden der Bewertung: ", error); // Err
      notifyer.error("Das Gericht kann erst ab dem Tag der Ausgabe bewertet werden");
    }
  };  

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-40 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {detailDish?.name}
                </Dialog.Title>

                { /* Dish things */}
                <div className="mt-4 py-4 px-[4vw] bg-gray-50 rounded-lg shadow">
                  <div className="flex gap-3">
                    <div className="flex-1 rounded-lg border-b border-gray-200 bg-gray-100">
                      <div className="h-32 w-32 overflow-hidden rounded-md bg-gray-300 shadow-xl mx-auto">
                        <img
                          alt="Bild"
                          className="h-full w-full object-cover object-center"
                          src={
                            allImages?.find((img) => img?._id === detailDish?.image)
                              ?.image
                            }
                        />
                      </div>

                      <div className='my-4 flex w-fit mx-auto'>
                        <MenuToggle name="A" onChange={null} isChecked={detailDish?.tags.includes('Menü A')} />
                        <MenuToggle name="B" onChange={null} isChecked={detailDish?.tags.includes('Menü B')} />
                        <MenuToggle name="C" onChange={null} isChecked={detailDish?.tags.includes('Menü C')} />
                      </div>

                    </div>
                    
                    <div className="flex-1 rounded-lg border-b border-gray-200 bg-gray-100">
                      <div className="flex flex-wrap px-1.5 pt-1.5 h-fit">
                        {detailDish?.tags.map((tag, index) => (
                          <span
                            className="mr-1 my-0.5 rounded py-0.5 px-1 text-xs text-blue-700 bg-blue-100"
                            key={index}
                          >
                          {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    

                  </div>

                </div>

                {/* Rating things */}
                {<div className="mt-4 py-4 px-[4vw] bg-gray-50 rounded-lg shadow">
                  {/* Average Rating */}
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Durchschnittliche Bewertung
                  </p>
                  <div className="my-1 border-b border-gray-200"></div>
                  <div className="flex items-center mb-3">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <span key={index}>
                      {index <= Math.round(detailDish?.avgRating) ? (
                        <SolidStarIcon className="h-8 w-8 text-yellow-500" />
                      ) : (
                        <OutlineStarIcon className="h-8 w-8 text-gray-300" />
                      )}
                    </span>
                  ))}
                    
                    <div className="ml-3 flex items-center justify-center bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {numberOfRatings} Bewertungen
                    </div>
                  </div>
                  {/* Rating Input */}
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Ihre Bewertung
                  </p>
                  <div className="my-1 border-b border-gray-200"></div>
                  <div className="flex items-center mb-3">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <button
                        key={index}
                        className={`hover:text-yellow-500 ${!canRate ? "text-gray-300" : ""}`}
                        onClick={() => canRate && setRating(index)}
                        disabled={!canRate}
                      >
                        {
                          canRate 
                          ? (index <= (rating) ? (
                              <SolidStarIcon className="h-8 w-8 text-yellow-500" />
                            ) : (
                              <OutlineStarIcon className="h-8 w-8 text-yellow-500" />
                            ))
                          : <OutlineStarIcon className="h-8 w-8 text-gray-300" />
                        }
                      </button>
                    ))}
                  </div>
                  <textarea
                    className='block p-2 border w-full rounded-md border-gray-600 bg-transparent mb-1 placeholder:text-gray-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200'
                    rows={2}
                    disabled={!canRate}
                    value={ratingComment}
                    onChange={(event) => setRatingComment(event.target.value)}
                    placeholder={canRate?"Teilen sie ihre Meinung":"Bewertung nicht möglich"} />
                  <button
                    type="button"
                    className={`inline-flex justify-center px-4 py-2 text-sm ${canRate ? "text-blue-900 bg-blue-100 hover:bg-blue-200" : "text-gray-300 bg-gray-100"} border border-transparent rounded-md duration-300`}
                    onClick={canRate ? submitRating : null}
                    disabled={!canRate}
                  >
                    Bewertung senden
                  </button>
                </div>}

                <div className="mt-4 py-4 px-[4vw] bg-gray-50 rounded-lg shadow">
                  <CommentsList key={commentsListKey} commentsDishName={detailDish?.name} />
                </div>
                
                <div className="mt-4 w-full">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300"
                    onClick={closeModal}
                  >
                    Schließen
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

import React, { useEffect, useState } from 'react'
import MenuTopBar from '../menuPlan/MenuTopBar'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../misc/Button';
import restClient from '../../services/rest-client-service';
import { dateToStandardString, convertDateFormat } from '../../services/date-service';
import notifyer from "../../services/notifyer-service";
import Dialog from "@mui/material/Dialog";
import { DAYS, POLL_CATEGORIES, POLL_URL, VOTES_URL, MENUPLAN_URL, NOTIFICATIONS_URL, DEFAULT_USERS_URL } from '../../data/clientConfiguration';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DishList from './DishList';
import dayjs from 'dayjs';
import 'dayjs/locale/de-at';

function PollCreation() {
  const params = useParams();
  const navigate = useNavigate();
  const [poll, setPoll]  = useState({
    menuplan: params.menuplanId,
    dishes: [],
    open: false,
    endDate: dateToStandardString(new Date())
  });
  const [allDishes, setAllDishes] = useState([]);
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState({});
  const [generateMenuPlanDialogOpen, setGenerateMenuPlanDialogOpen] = useState(false);
  const [votingOpenOrCloseDialogOpen, setVotingOpenOrCloseDialogOpen] = useState(false);

  useEffect(() => {
    //check if poll already connected to db-object
    if(poll._id) {
      restClient
        .patch(POLL_URL + "/" + poll._id, {...poll,__v: undefined})
        .catch((response) => {
          console.error(`Saving to '${POLL_URL}' failed.`, response)
        });
    } else {
      //try getting poll from db
      restClient
        .get(`${POLL_URL}?menuplan=${poll.menuplan}`)
        .then(response => response.data)
        .then(data => {
          if(data[0]) {
            setPoll(data[0]);
          } else {
            //if no poll available then create poll
            restClient
              .post(POLL_URL, poll)
              .then(response => setPoll(response.data))
              .catch((response) => {
                console.error(`Saving to '${POLL_URL}' failed.`, response)
              });
          }
        })
        .catch((response) => {
          console.error(`Fetching from '${POLL_URL}' failed.`, response)
        });
    }
  }, [poll]);

  useEffect(() => {
    if(poll._id) {
      restClient
        .get(`${VOTES_URL}/${poll._id}`)
        .then(response => setResults(response.data))
        .catch((response) => {
          console.error(`Fetching from '${VOTES_URL}' failed.`, response)
        });

    }
  }, [poll._id])

  useEffect(() => {
    restClient
      .get(`${MENUPLAN_URL}/dishes`)
      .then((response) => {
        setAllDishes(response.data);
      })
      .catch((response) =>
        console.error("Getting all dishes failed.", response)
      );
  }, []);

  useEffect(() => {
    async function setUserData() {
      try {
        let users = (await restClient.get(DEFAULT_USERS_URL)).data;
        setUsers(users);
      } catch (err) {
        console.error("Getting all users failed.", err);
      }
    }
    setUserData();
  }, []);

  function handleVotingOpenOrCloseClicked() {
    setVotingOpenOrCloseDialogOpen(true);
  }

  function cancelVotingOpenOrClose() {
    setVotingOpenOrCloseDialogOpen(false);
  }

  function handleGenerateMenuPlanClicked() {
    setGenerateMenuPlanDialogOpen(true);
  }

  function cancelGenerateMenuPlan() {
    setGenerateMenuPlanDialogOpen(false);
  }

  function sortDescending (str1, str2) {
    if (str1 > str2) {
      return 1;
    }
    else if (str1 < str2) {
      return -1;
    }
    return 0;
  }

  function* shuffle(array) {
    let i = array.length;
    while (i--) {
      yield array.splice(Math.floor(Math.random() * (i+1)), 1)[0];
    }
  }

  async function generateMenuPlan() {
    if (poll.open) {
      notifyer.error('Die Wahl ist noch in vollem Gange!');
    }
    else if (!POLL_CATEGORIES.find(category => results[category].length > 0)) {
      notifyer.error('Die Ergebnisse der Wahl sind leer!');
    }
    else {
      try {
        let menuPlan = (await restClient.get(`${MENUPLAN_URL}/${poll.menuplan}`)).data;
  
        let daysToFill = DAYS.filter(day => menuPlan.days[day] && day);
        daysToFill.forEach(day => menuPlan.days[day] = []);
        POLL_CATEGORIES.forEach(course => {
          let maxDishesPerCoursePerDay = Math.ceil(results[course].length / 5);
          maxDishesPerCoursePerDay = maxDishesPerCoursePerDay > 3 ? 3 : maxDishesPerCoursePerDay;
          for (let i = 0; i < maxDishesPerCoursePerDay; i++) {
            let resultsToDistribute = results[course].slice(i * 5, (i+1) * 5);
            let dishesToDistribute = resultsToDistribute.map(result => poll.dishes.find(dish => dish.name === result.dish));
            let randomIdxs = shuffle(daysToFill.map((_day, idx) => idx));
            for (let idx = 0; idx < daysToFill.length && dishesToDistribute[idx]; idx++) {
              let randomIdx = randomIdxs.next().value;
              menuPlan.days[daysToFill[randomIdx]].push(dishesToDistribute[idx]);
            }
          }
        });
  
        await restClient.patch(`${MENUPLAN_URL}/${menuPlan._id}`, menuPlan);
        navigate(`/menu-plan/${menuPlan.startDate}`);
      } catch (err) {
        console.log('error occured in generateMenuPlan(): ', err);
      }
    }
  }

  function toggleVotingOpen() {
    if(!poll.open)sendVotingOpenNotifications(); 
    setPoll({...poll,open:!poll.open});
    cancelVotingOpenOrClose();
  }

  function onEndDateChanged(date) {
    setPoll({...poll,endDate:dateToStandardString(date)});
  }


  function sendVotingOpenNotifications() {
    let notification = {
      _idUser: null, 
      title: "Neue Abstimmung verfügbar",
      text: `Eine neue Abstimmung ist verfügbar. Die Abstimmung endet am ${convertDateFormat(new Date(poll.endDate))}. Durch Ihre Stimme sorgen Sie für besseres Essen und weniger Essensverschwendung!`,
      read: false,
      timeCreated: new Date(),
      priority: "HIGH",
      link: `/vote`,
    };

    users.forEach(user => {
      if(user != null && user.roles.includes("customer")) {
        notification._idUser = user._id; 
        try {
          restClient.post(NOTIFICATIONS_URL, notification);
        } catch (err) {
          console.error("Error sending voting start notification:", err);
        }
      }
    });
  }

  function handleAddDishClicked(dish) {
    setPoll({...poll,dishes: [dish,...poll.dishes]});
  }

  function handleRemoveDishClicked(dish) {
    setPoll({...poll,dishes: poll.dishes.filter((selectedDish) => selectedDish!==dish)});
  }

  //TODO: connect to poll backend

  return (
    <div>
      <Dialog open={votingOpenOrCloseDialogOpen} onClose={cancelVotingOpenOrClose}>
        <h3 className="text-center m-1.5">
          {`Bist du dir sicher, dass du die Wahl mit dem Enddatum "${convertDateFormat(new Date(poll.endDate))}" ${!poll.open ? 'starten' : 'stoppen'} möchtest?`}
        </h3>
        <h3 className="text-center m-1.5 text-red-700">
          {`(${!poll.open  
            ? 'Beim Starten der Wahl werden alle Schüler*innen über diese per Benachrichtigung informiert' 
            : 'Beim frühzeitigen Stoppen der Wahl ist es den Schüler*innen, welche noch nicht abgestimmt haben, nicht mehr möglich in dieser Wahl teilzunehmen'}!)`}
        </h3>
        <div className="flex flex-row items-center justify-center">
          <Button onClick={toggleVotingOpen}>Ja</Button>
          <Button onClick={cancelVotingOpenOrClose}>Nein</Button>
        </div>
      </Dialog>

      <Dialog open={generateMenuPlanDialogOpen} onClose={cancelGenerateMenuPlan}>
        <h3 className="text-center m-1.5">
          {`Bist du dir sicher, dass du mithilfe der Ergebnisse der Wahl vom ${convertDateFormat(new Date(poll.endDate))} den Menüplan befüllen möchtest?`}
        </h3>
        <h3 className="text-center m-1.5 text-red-700">
          (Falls der Menüplan bereits eingetrage Gerichte besitzt, werden diese Gerichte bei der Befüllung vollständig gelöscht!)
        </h3>
        <div className="flex flex-row items-center justify-center">
          <Button onClick={generateMenuPlan}>Ja</Button>
          <Button onClick={cancelGenerateMenuPlan}>Nein</Button>
        </div>
      </Dialog>

      <MenuTopBar
        text="Abstimmung bearbeiten"
        handleBackClicked={() => navigate('/menu-plan')}
      />
      <div className='relative flex flex-row w-full'>
        <div className='py-2 px-2 m-2.5'>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de-at">
            <DatePicker label="Enddatum" minDate={dayjs(new Date())} value={dayjs(poll.endDate)} onChange={(date) => onEndDateChanged(date.$d)}/>
          </LocalizationProvider>
        </div>
        <Button disabled={poll.endDate<dateToStandardString(new Date())} onClick={handleVotingOpenOrCloseClicked}>{poll.open&&poll.endDate>=dateToStandardString(new Date())?'Abstimmung stoppen':'Abstimmung starten'}</Button>
        <div className='absolute bottom-0 right-0'>
        <Button onClick={handleGenerateMenuPlanClicked}>Menüplan befüllen</Button>
        </div>
      </div>
      <div className='relative flex flex-row w-full'>
      <div className='p-[1vh] w-[30vw]'>
        <div className='text-center'>
          Auswählbare Gerichte
        </div>
        <DishList 
          dishes={poll.dishes.sort((d1, d2) => sortDescending(d1.name, d2.name))} 
          onDishClicked={handleRemoveDishClicked}
        />
      </div>
      <div className='p-[1vh] w-[30vw]'>
      <div className='text-center'>
          Nicht auswählbare Gerichte
        </div>
        <DishList
          dishes={allDishes.filter((dish) => !poll.dishes.find((selectedDish) => selectedDish.name===dish.name)).sort((d1, d2) => sortDescending(d1.name, d2.name))}
          onDishClicked={handleAddDishClicked}
        />
      </div>
      <div className='h-full p-[1vh] w-[30vw]'>
        {
          Object.keys(results).map(key => {
            return (
              <div key={key} className='mb-3'>
                <div className='border rounded-md'>
                  <div className='border-b rounded-md text-center p-1'>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </div>
                  <div className={`h-[${60/Object.keys(results).length}vh] overflow-y-scroll`}>
                    {
                      results[key].sort((a,b) => b.votes - a.votes).map((result, idx) => {
                        return (
                          <div key={idx} className='flex'>
                            <p className='m-1 w-1/12 text-center'>{idx+1}</p>
                            <p className='m-1 w-9/12'>{result.dish}</p>
                            <p className='m-1 w-2/12 text-center'>{result.votes}</p>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
      </div>
    </div>
  )
}

export default PollCreation

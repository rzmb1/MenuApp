import restClient from '../../services/rest-client-service';
import React, { useEffect, useState } from 'react'
import DishCard from './DishCard';
import { dateToStandardString,getCurrentStartDate } from '../../services/date-service';
import TabSwitcher from './TabSwitcher';
const MENUPLAN_URL = '/api/menuplans';
const startDate = getCurrentStartDate();

function getDayName(date) {
  let day;

  switch (new Date(date).getDay()) {
    case 1:
      day = "Montag";
      break;
    case 2:
      day = "Dienstag";
      break;
    case 3:
      day = "Mittwoch";
      break;
    case 4:
      day = "Donnerstag";
      break;
    case 5:
      day = "Freitag";
      break;
    default:
      day = "N/A";
  }

  return day;
}

export default function DataInputView() {
  const [dishes, setDishes] = useState([]);
  const [allImages, setAllImages] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    restClient.get(MENUPLAN_URL  + '?startDate='+dateToStandardString(startDate)+'&state=published')
    .then(response => {
      setDishes(response.data[0].days[getDayName(new Date())])
    }) 
    .catch(response => console.error(`Loading items for '${MENUPLAN_URL}' failed.`, response));

    restClient.get('/api/images').then(response=>{
      setAllImages(response.data);
    })
    .catch(response => {
      console.error('Getting image failed.', response);
    });
  }, [setDishes]);

  function getPositionFromDish(dish) {
    let position = 0;

    if(dish.tags.find(tag => tag === "Vorspeise")) {
      position = 1;
    } else if(dish.tags.find(tag => tag === "Hauptspeise")) {
      position = 2;
    } else if(dish.tags.find(tag => tag === "Nachspeise")) {
      position = 3;
    }

    return position;
  }

  const getBarColorClass = (index) => {
    console.log(activeTab);
    if (activeTab === 1) {
      const redShades = ["bg-red-400", "bg-red-500", "bg-red-600"];
      return redShades[index] || "bg-red-400";
    } else {
      const blueShades = ["bg-blue-400", "bg-blue-500", "bg-blue-600"];
      return blueShades[index] || "bg-blue-400";
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      <div className="grid grid-cols-3 items-stretch grid-flow-dense gap-[0.5vh] p-5 flex-grow">
        <div className={getBarColorClass(0) + " h-[2vh] rounded-lg"} />
        <div className={getBarColorClass(1) + " h-[2vh] rounded-lg"} />
        <div className={getBarColorClass(2) + " h-[2vh] rounded-lg"} />

        {dishes?.map((dish, idx) => (
          <DishCard 
            image={allImages?.find(image => image._id === dish.image)?.image} 
            position={getPositionFromDish(dish)} 
            dish={dish} 
            activeTab={activeTab} 
            key={idx} 
          />
        ))}
      </div>
      <div className="flex justify-center items-end">
        <TabSwitcher tabs={["Ausgeben", "Wegwerfen"]} activeTabIndex={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  )

}

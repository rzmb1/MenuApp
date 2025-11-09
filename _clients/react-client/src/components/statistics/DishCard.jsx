import React, { useEffect, useState } from 'react'
import { STATISTICS_URL } from '../../data/clientConfiguration';
import restClient from '../../services/rest-client-service';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { dateToStandardString } from '../../services/date-service';
const date = dateToStandardString(new Date());

export default function DishCard({ image, position, dish, activeTab }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let field = activeTab === 1 ? 'wasted' : 'served';
    let url = `${STATISTICS_URL}?from=${date}&to=${date}&name=${dish.name}&field=${field}`;
  
    restClient.get(url)
      .then(response => {
        setCount(response.data[0][field] ?? 0);
      })
      .catch(response => console.error(`Loading items for '${STATISTICS_URL}' failed.`, response));
  }, [activeTab, dish.name]);
  

  const increaseCount = () => {
    let updatedCount = count + 1;
    let patchData = { name: dish.name, date: date };

    if (activeTab === 1) { // wegwerfen
      patchData.wasted = updatedCount;
    } else {
      patchData.served = updatedCount;
    }

    restClient.patch(STATISTICS_URL, patchData)
      .catch(response => console.error(`Saving to '${STATISTICS_URL}' failed.`, response));
    
    setCount(updatedCount);
  };

  const decreaseCount = () => {
    if (count > 0) {
      let updatedCount = count - 1;
      let patchData = { name: dish.name, date: date };

      if (activeTab === 1) { // wegwerfen
        patchData.wasted = updatedCount;
      } else {
        patchData.served = updatedCount;
      }

      restClient.patch(STATISTICS_URL, patchData)
        .catch(response => console.error(`Saving to '${STATISTICS_URL}' failed.`, response));
      
      setCount(updatedCount);
    }
  };

  const cardStyle = {
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    color: '#fff',
    position: 'relative',
    gridColumn: position
  };

  return (
    <>
      <div className='h-full flex-col flex mt-[0.5vh]' style={{ gridColumn: position }}>
        <div className='flex flex-1 flex-col min-w-0 w-full rounded-lg overflow-hidden' style={cardStyle}>
          <div className='z-10 flex flex-col justify-between relative h-full'>
            <button className='group opacity-40 bg-slate-700 w-full rounded-md rounded-b-none cursor-pointer' onClick={increaseCount}>
              <ChevronUpIcon className='w-10 h-[5vh] mx-auto transform group-active:scale-75 transition-transform' />
            </button>
            <div className='h-full flex flex-col justify-between relative z-10 '>
              <h5 className='text-black text-[5vh] font-bold flex justify-center items-center'>
                <div className='shadow-2xl inset-0.5 rounded-lg bg-gradient-to-r from-transparent to-white opacity-80 blur text-white'>
                  <span>{count}</span>
                </div>
                <span className='absolute z-10'>{count}</span>
              </h5>
            </div>
            <button className='group opacity-40 bg-slate-700 w-full rounded-md rounded-t-none cursor-pointer' onClick={decreaseCount}>
              <ChevronDownIcon className='w-10 h-[5vh] mx-auto transform group-active:scale-75 transition-transform' />
            </button>
          </div>
        </div>
      </div>
      <div className='mb-3 text-center' style={{ gridColumn: position }}>
          <span className='text-sm font-medium text-gray-700'>
            {dish.name}
          </span>
        </div>
    </>
  )  
}

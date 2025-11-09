import React,{useState,useEffect} from 'react'
import NothingIcon from './Nothing.png'
import restClient from '../../services/rest-client-service';

export default function DishDetailView({ selected, dish, onClick }) {
  const [dishIcon, setDishIcon] = useState(NothingIcon);

  useEffect(() => {
    if(dish.image!==undefined)
      restClient.get('/api/images/'+dish.image).then(response=>{
        setDishIcon(response.data.image);
      })
      .catch(response => console.error('Getting image failed.', response));
  }, [dish]);

  return (
    <div className={`flex-1 m-1.5 p-1.5 rounded-md border-2 border-black ${selected ? 'shadow-lg shadow-blue-600' : ''}`}
      onClick={onClick}
      >
      <img className='h-[10vw] w-[10vw]' alt='food' src={dishIcon} />
      <p>{dish?.name}</p>
      <p>{dish?.tags.length?dish?.tags.reduce((a,b,idx)=>a+(idx?", ":"")+b,""):''}</p>
    </div>
  )
}

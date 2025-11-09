import React, { useEffect, useState } from 'react'
import Card from './Card'
import restClient from '../../services/rest-client-service';
import { useContext } from 'react';
import { NotificationsContext } from '../../App';
import { SCREEN_SIZE_CONDITIONER } from "../../data/clientConfiguration";
import { UserContext } from '../..';

export default function Notifications() {
  const [user] = useContext(UserContext);
  const [notifications, setNotifications] = useContext(NotificationsContext);
  const [unreadMode, setUnreadMode] = useState(true);
  useEffect(() => {
    restClient.get('/api/notifications?_idUser='+user._id).then(response=>{
      setNotifications(response.data.sort((a, b)=>{return new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime()}));
    }) 
    .catch(response => console.error('Getting Notifications failed.', response));
  }, [unreadMode, user._id,setNotifications]);

  function refreshNotifications() {
    restClient.get('/api/notifications?_idUser='+user._id).then(response=>{
      setNotifications(response.data.sort((a, b)=>{return new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime()}));
    })
    .catch(response => console.error('Getting Notifications failed.', response));
  }

  function markAsRead(notification, readAttribute) {
    restClient.patch('/api/notifications/' + notification._id, {...notification, read: readAttribute}).then(()=>refreshNotifications())
    .catch(response => console.error('Patching Notification with _id='+notification._id+' failed.', response));
  }

  function onReadNotificationsClicked(event) {
    setUnreadMode(false);
  }

  function onNewNotificationsClicked(event) {
    setUnreadMode(true);
  }

  return (
    <div className='flex flex-col h-full overflow-hidden'>
      <div className='flex text-slate-400 text-3xl'>
        <div className={`flex-grow text-center cursor-pointer ${unreadMode ? 'text-black border-b-[3px] border-b-blue-700' : 'border-b-[2px] border-b-gray-300'}`} onClick={onNewNotificationsClicked}>
          <p className='m-3'>{SCREEN_SIZE_CONDITIONER?"Neue Nachrichten":"Neu"}</p>
        </div>
        <div className={`flex-grow text-center cursor-pointer ${!unreadMode ? 'text-black border-b-[3px] border-b-blue-700' : 'border-b-[2px] border-b-gray-300'}`} onClick={onReadNotificationsClicked}>
          <p className='m-3'>{SCREEN_SIZE_CONDITIONER?"Gelesene Nachrichten":"Gelesen"}</p>
        </div>
      </div>
      <div className={`flex-grow pt-4 ${notifications.find(notification=>notification.read !== unreadMode)?'overflow-y-scroll':''}`}>
        {!notifications.find(notification=>notification.read !== unreadMode)?<p className='text-slate-500 text-3xl m-4 mt-0 text-center'>{unreadMode?"Keine neuen Benachrichtigungen":"Keine gelesenen Benachrichtigungen"}</p>:
          notifications.filter(notification=>notification.read !== unreadMode).map((notification, idx)=>{
          return <Card key={idx} notification={notification} markAsRead={markAsRead} />
        })}
      </div>
    </div>
  )
}

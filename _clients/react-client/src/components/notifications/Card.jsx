import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import { ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Card({notification, markAsRead}) {
    const navigate = useNavigate();

    let icon;
    let date;

    function initialization() {
        if(notification.priority==='LOW') {
            icon = <InformationCircleIcon className='w-8 h-8 text-blue-600 my-auto mx-0' />;
        } else if(notification.priority==='HIGH') {
            icon = <ExclamationCircleIcon className='w-8 h-8 my-auto mx-0 text-red-600' />;
        }

        date = new Date(notification.timeCreated);
    }

    initialization();

    function onDeleteAddClick(event) {
        markAsRead(notification, !notification.read);
    }

    function onNotificationClicked(event) {
        markAsRead(notification, true);
        if(notification.link) {
            navigate(notification.link);
        }
    }

    return (
        <div className='w-[95%] h-fit m-auto mb-8'>
            <div className='flex h-12' onClick={onNotificationClicked}>
                {icon}
                <div className='ml-4 font-sans'>
                    <p className='text-base font-medium'>{notification.title}</p>
                    <p className='text-left text-slate-500'>{date.getDate() + '. ' + date.toLocaleString('de-DE', { month: 'long' })}</p>
                </div>
            </div>
            <div className='flex bg-white rounded-md border shadow-xl py-2.5'>
                <div className='text-left p-3 flex-grow' onClick={onNotificationClicked}>
                    <p className='mx-0'>{notification.text}</p>
                </div>
                <div className='w-fit h-fit my-auto mr-2'>
                    <div>
                        {notification.read ? 
                            <PlusIcon className='p-1 text-green-700 hover:bg-green-700 hover:text-white rounded-2xl hover:scale-125 w-8 h-8 cursor-pointer' onClick={onDeleteAddClick}/>
                                :
                            <MinusIcon className='p-1 text-red-700 hover:bg-red-700 hover:text-white rounded-2xl hover:scale-125 w-8 h-8 cursor-pointer' onClick={onDeleteAddClick}/>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}


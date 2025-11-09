import React from 'react';
import { useContext } from 'react';
import { UserContext } from '../..';

export default function NavigationProfile() {
  const [user] = useContext(UserContext);
  return (
    <div className='w-full h-12 mb-4 ml-4'>

        <div className="flex items-center gap-x-6">
          <img className="h-16 w-16 rounded-full" src="https://loremflickr.com/1024/1024/cats" alt="" />
            <div>
              <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">{user.firstname} {user.lastname}</h3>
              <p className="text-sm font-semibold leading-6 text-indigo-600"></p>
            </div>
        </div>
    </div>
  )
}

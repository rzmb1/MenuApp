import React from 'react';
import { Link } from 'react-router-dom';
import { useMsal } from "@azure/msal-react";

export default function NavigationEntryMobile({imageElement, link, badge, textColor = 'text-gray-500', hoverTextColor = 'text-gray-800'}) {
  const { instance } = useMsal();

  let bar = '';

  if(window.location.pathname.match('^'+link+'(/.*)?$')) {
    bar = <div className='bg-blue-500 w-full h-[10%] rounded-tl-md rounded-tr-md'></div>
  }
  return (
    <div className='flex-grow'>
      {link?(
        <Link to={link}>
          <div className={`select-none flex flex-row h-[90%] ${textColor} hover:${hoverTextColor}`}>
          <div className='m-auto relative'>
            {imageElement}
            {badge > 0 && <span className={`text-md bg-blue-100 rounded-full text-blue-500 absolute -top-4 left-${badge>9?5:6} px-1`}>{badge}</span>}
          </div>
        </div>
        </Link>
      ):(
        <div onClick={()=>instance.logoutRedirect()}>
          <div className={`select-none flex flex-row h-[90%] ${textColor} hover:${hoverTextColor}`}>
          <div className='m-auto relative'>
            {imageElement}
            {badge > 0 && <span className={`text-md bg-blue-100 rounded-full text-blue-500 absolute -top-4 left-${badge>9?5:6} px-1`}>{badge}</span>}
          </div>
        </div>
        </div>
      )}
      {bar}
    </div>
  )
}

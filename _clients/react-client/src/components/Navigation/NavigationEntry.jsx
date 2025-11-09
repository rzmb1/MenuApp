import React from 'react';
import { Link } from 'react-router-dom';
import { useMsal } from "@azure/msal-react";

export default function NavigationEntry({imageElement, link, text, badge, textColor = 'text-gray-500', hoverTextColor = 'text-gray-800'}) {
  const { instance } = useMsal();

  let bar = '';

  if(window.location.pathname.match('^'+link+'(/.*)?$')) {
    bar = <div className='bg-blue-500 w-2 h-12 float-left rounded-tr-md rounded-br-md'></div>
  }

  return (

    <li>
      {bar}
      {link?(
        <Link to={link}>
          <div className={`select-none pl-4 flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${textColor} hover:${hoverTextColor}`}>
            <div className='mr-2'>{imageElement}</div>
            <span className="text-sm font-medium">{text}</span>
            {badge > 0 && <span className="ml-auto mr-6 text-sm bg-blue-100 rounded-full px-3 py-px text-blue-500">{badge}</span>}
          </div>
        </Link>
      ):(
        <div onClick={()=>instance.logoutRedirect()}>
          <div className={`select-none pl-4 flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${textColor} hover:${hoverTextColor}`}>
            <div className='mr-2'>{imageElement}</div>
            <span className="text-sm font-medium">{text}</span>
            {badge > 0 && <span className="ml-auto mr-6 text-sm bg-blue-100 rounded-full px-3 py-px text-blue-500">{badge}</span>}
          </div>
        </div>
      )}
      
    </li>
  )
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function ErrorPage({errorCode, message, description}) {
  return (
    <div className="">
        <p className="text-[10vw] text-center">Oh nein!</p>
            <p className="text-[2vw] text-center">{errorCode} - {message}</p>
            <p className="text-[1.5vw] text-center">{description}</p>
        <Link to="/">
            <div className="flex items-center justify-center">
                <span className="font-medium bg-blue-500 p-[0.5vw] text-[1.5vw] text-white rounded-[2vw] hover:bg-blue-600">Zur Hauptseite zurückkehren</span>
            </div>
        </Link>
        
    </div>
  )
}

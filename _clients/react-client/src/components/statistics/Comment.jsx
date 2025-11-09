import React from 'react';
import { StarIcon as SolidStarIcon } from "@heroicons/react/24/solid";
import { StarIcon as OutlineStarIcon } from "@heroicons/react/24/outline";
import { convertDateFormat } from "../../services/date-service";

function Comment({ user, rating, comment, updatedAt }) {
    return (
        <div className="card bg-white p-4 shadow rounded flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h5 className="text-lg font-bold">{user.firstname + " " + user.lastname}</h5>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                            star <= rating ? (
                                <SolidStarIcon className="h-5 w-5 text-yellow-500" key={star} />
                            ) : (
                                <OutlineStarIcon className="h-5 w-5 text-yellow-500" key={star} />
                            )
                        ))}
                    </div>
                </div>
                <p className="text-gray-600">{comment}</p>
            </div>
            <p className="text-gray-400 text-xs self-end">{convertDateFormat(new Date(updatedAt))}</p>
        </div>
    );
}

export default Comment;

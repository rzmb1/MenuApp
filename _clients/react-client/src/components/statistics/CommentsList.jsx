import React, { useEffect, useState } from 'react';
import restClient from '../../services/rest-client-service';
import Comment from './Comment';

export default function CommentsList({ commentsDishName }) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        restClient.get('/api/signups/comments/'+commentsDishName).then(response => {
            const sortedComments = response.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setComments(sortedComments);
        })
        .catch(response => {
            console.error('Getting Comments failed.', response);
        });
    }, [commentsDishName]);

    return (
        <div className="flex flex-col overflow-y-auto space-y-4 max-h-96 p-4">
            {comments.map(comment => (
                <Comment
                    key={comment._id}
                    user={comment.user}
                    rating={comment.rating}
                    comment={comment.comment}
                    updatedAt={comment.updatedAt}
                />
            ))}
        </div>
    );
}
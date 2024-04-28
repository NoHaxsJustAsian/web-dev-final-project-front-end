import React from 'react';

type ReviewCardProps = {
    timestamp: string;
    title: string;
    description: string;
    postid: number;
    userFirst: string;
    userLast: string;
};

const ReviewCard: React.FC<ReviewCardProps> = ({ timestamp, title, description, postid, userFirst, userLast}) => {
    const date = new Date(timestamp).toLocaleDateString();
    const postLink = `#/details/${postid}`; // Assuming you have a route like /details/:postId


    return (
        <a href={postLink} className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8 max-w-md mx-auto my-4">
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
            <div className="sm:flex sm:justify-between sm:gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 sm:text-xl">{title}</h3>
                    <p className="mt-1 text-xs font-medium text-gray-600">{userFirst} {userLast}</p>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-pretty text-sm text-gray-500">{description}</p>
            </div>
        </a>
    );
};


export default ReviewCard;
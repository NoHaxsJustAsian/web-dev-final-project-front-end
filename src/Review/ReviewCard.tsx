import React from 'react';

type ReviewCardProps = {
    timestamp: string;
    title: string;
    description: string;
    postid: number;
    userFirst: string;
    userLast: string;
    username:string;
};

const ReviewCard: React.FC<ReviewCardProps> = ({ timestamp, title, description, postid, userFirst, userLast, username}) => {
    const date = new Date(timestamp).toLocaleDateString();
    const postLink = `#/details/${postid}`; 
    const profileLink = `#/profile/${username}`; 

    return (
        <div className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8 max-w-md mx-auto my-4">
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
            <div className="sm:flex sm:justify-between sm:gap-4">
                <div>
                <a href={postLink}>
                    <h3 className="text-lg font-bold text-gray-900 sm:text-xl">{title}</h3>
                    </a>
                    <p className="mt-1 text-xs font-medium text-green-500">@{username}</p>
                    <p className="mt-1 text-xs font-medium text-gray-600">{userFirst} {userLast}</p>
                </div> 
            </div>
            <div className="flex justify-between items-center">
    <p className="text-pretty text-sm text-gray-500">{description}</p>  
    <a href={profileLink} className="no-underline rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
        Visit Profile
    </a>
</div>
        </div>
    );
};


export default ReviewCard;
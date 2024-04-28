import React from 'react';

type ReviewCardProps = {
    timestamp: string;
    title: string;
    description: string;
    postid: number;
};

const ReviewCard: React.FC<ReviewCardProps> = ({ timestamp, title, description, postid }) => {
    const date = new Date(timestamp).toLocaleDateString();
    const postLink = `#/details/${postid}`;
    return (
        <a href={postLink} className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="sm:flex sm:justify-between sm:gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 sm:text-xl">{title}</h3>
                    <p className="mt-1 text-xs font-medium text-gray-600">add user here</p>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-pretty text-sm text-gray-500">{description}</p>
            </div>
            <dl className="mt-6 flex gap-4 sm:gap-6">
                <div className="flex flex-col-reverse">
                    <dt className="text-sm font-medium text-gray-600">Published</dt>
                    <dd className="text-xs text-gray-500">{date}</dd>
                </div>
            </dl>
        </a>
    );
};

export default ReviewCard;
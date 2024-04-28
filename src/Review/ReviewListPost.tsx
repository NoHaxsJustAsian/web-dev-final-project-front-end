import React, { useState, useEffect } from 'react';
import ReviewCard from '../Review/ReviewCard';
import supabase from '../supabaseClient';

type Review = {
    timestamp: string;
    description: string;
    title: string;
    userid: string;
    postid: number;
    username: string;
};

type User = {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    role: string;
    reviews: string[];
    selling_posts: string[];
    profileURL: string;
};

type ReviewProps = {
    postid: number;
};

const ReviewList: React.FC<ReviewProps> = ({ postid }) => {
    const [reviewsData, setReviewsData] = useState<{ review: Review, user: User }[]>([]);
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data: reviews, error: reviewsError } = await supabase
                    .from('reviews')
                    .select('*');
        
                if (reviewsError) {
                    throw reviewsError;
                }
        
                const reviewsWithUserData = await Promise.all(reviews.map(async (review: Review) => {
                    const { data: user, error: userError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', review.userid)
                        .single();
        
                    if (userError) {
                        throw userError;
                    }
        
                    return { review, user };
                }));
        
                setReviewsData(reviewsWithUserData);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, [postid]);

    return (
        <div className="mb-8 mt-8 mx-auto sm:mx-4 max-w-2xl p-4 sm:p-6 bg-white rounded-lg shadow-sm transition hover:shadow-lg border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl mb-4">Reviews</h2>
            <div className="grid grid-cols-2 gap-4">
                {reviewsData.map(({ review, user }, index) => (
                    <div className="max-w-md" key={index}>
                        <ReviewCard
                            timestamp={review.timestamp}
                            title={review.title}
                            description={review.description}
                            postid={review.postid}
                            username={user.username}
                            userFirst={user.first_name}
                            userLast={user.last_name}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewList;
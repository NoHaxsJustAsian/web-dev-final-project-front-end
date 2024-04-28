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
    reviewIds: string[];
};

const ReviewList: React.FC<ReviewProps> = ({ reviewIds }) => {
    const [reviewsData, setReviewsData] = useState<Review[]>([]);
    const [user, setUser] = useState<User>();
    useEffect(() => {
        const fetchProfileAndReviews = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) {
                    throw error;
                }

                if (user) {
                    const { data, error } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', user.id)
                        .single();
    
                    if (error) {
                        throw error;
                    }
    
                    setUser(data);
                }

                if (user) {
                    const { data: reviews, error: reviewsError } = await supabase
                        .from('reviews')
                        .select('*')
                        .eq('userid', user.id);
    
                    if (reviewsError) {
                        throw reviewsError;
                    }
    
                    setReviewsData(reviews);
                }
            } catch (error) {
                console.error('Error fetching profile and reviews:', error);
            }
        };
    
        fetchProfileAndReviews();
    }, []);

    return (
        <div className="mb-8 mt-8 mx-auto sm:mx-4 max-w-2xl p-4 sm:p-6 bg-white rounded-lg shadow-sm transition hover:shadow-lg border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl mb-4">Reviews</h2>
            <div className="grid grid-cols-2 gap-4">
                {reviewsData.map((reviewData, index) => (
                    user && (
                        <div className="max-w-md">
                            <ReviewCard
                                key={index}
                                timestamp={reviewData.timestamp}
                                title={reviewData.title}
                                description={reviewData.description}
                                postid = {reviewData.postid}
                                userFirst= {user.first_name}
                                userLast= {user.last_name}
                                username= {user.username}
                            />
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default ReviewList;
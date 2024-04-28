import React, { useState, useEffect } from 'react';
import ReviewCard from '../Review/ReviewCard';
import supabase from '../supabaseClient';

type Review = {
    timestamp: string;
    description: string;
    title: string;
    userid: string;
    postid: number;
};

type ReviewProps = {
    reviewIds: string[];
};

const ReviewList: React.FC<ReviewProps> = ({ reviewIds }) => {
    const [reviewsData, setReviewsData] = useState<Review[]>([]);

    useEffect(() => {
        const fetchProfileAndReviews = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) {
                    throw error;
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
        <>
            {reviewsData.map((reviewData, index) => (
                console.log(reviewData),
                <ReviewCard
                    key={index}
                    timestamp={reviewData.timestamp}
                    title={reviewData.title}
                    description={reviewData.description}
                    postid = {reviewData.postid}
                />
            ))}
        </>
    );
};

export default ReviewList;
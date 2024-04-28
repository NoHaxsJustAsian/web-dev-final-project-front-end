import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';



type Profile = {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    role: string;
    reviews: string[];
    selling_posts: string[];
    profileURL: string;
};


type ReviewFormProps = {
    postid: number;
};

const ReviewForm: React.FC<ReviewFormProps> = ({postid}) => {
    const nav = useNavigate();
    const [title, setTitle] = useState('');
    const [profile, setProfile] = useState<Profile | null>(null);
    const [description, setDescription] = useState('');
    const [userId, setUserId] = useState('');
    useEffect(() => {
        const fetchProfile = async () => {
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
                    setUserId(user.id);
                    setProfile(data);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
    
        fetchProfile();
    }, []);

    if (!profile) {
        nav("#/login");
    }

    async function sendData(
        userId: string,
        title: string,
        description: string,
        postid: number,
      ) {
        const { data, error } = await supabase.from("reviews").insert([
          {
            userid: userId,
            title: title,
            description: description,
            postid: postid
          },
        ]);
    
        if (error) {
          console.error("Error creating review:", error);
        } else {
          console.log("Review created successfully:", data);
        }
      }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        sendData(userId, title, description, postid);
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6 max-w-md mx-auto sm:mx-4">
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" required />
            </div>
            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className=" text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" required />
            </div>
            <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Submit</button>
        </form>
    );
};

export default ReviewForm;

import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import { UserResponse } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import EditProfileForm from './EditProfileForm';
import ReviewList from '../Review/ReviewList';
import UserInfo from './Userinfo';

// Types
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

// ProfilePage Component
const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [editing, setEditing] = useState(false);
    const [user, setUser] = useState<UserResponse | null>(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                await supabase.auth.getUser()
                    .then(currentUser => {
                        setUser(currentUser);
    
                        if (!currentUser) {
                            navigate('/login');
                        }
                    });
            } catch (error) {
                console.error('Error fetching user:', error);
            }   
        };
        fetchUser();
    }, [navigate]);


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
    
                    setProfile(data);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
    
        fetchProfile();
    }, []);

    const handleSave = async (updatedProfile: Profile) => {
        try {
            const {
                data: { user },
              } = await supabase.auth.getUser();
              if (user) {
                const { data, error } = await supabase
                .from('users')
                .update(updatedProfile)
                .match({ id: user.id });
                setProfile(updatedProfile);
              } else {
                console.error("No user found");
              }      
        } catch (error) {
            console.error('Error updating profile:', error);
        }
        setEditing(false);
    };
    return (
        <div>
            {profile && (editing ? (
                <EditProfileForm profile={profile} onCancel={() => setEditing(false)} onSave={handleSave} />
            ) : (
                <div>
                    <UserInfo profile={profile} onEdit={() => setEditing(true)} />
                    <ReviewList reviewIds={profile.reviews} />
                </div>
            ))}
        </div>
    );
};

export default ProfilePage;
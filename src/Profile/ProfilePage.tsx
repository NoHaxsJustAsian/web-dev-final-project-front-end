import React, { useState, useEffect } from 'react';
import { useParams , Link} from 'react-router-dom';
import axios from 'axios';


type Profile = {
    name: string;
    bio: string;
    email: string;
};

type UserInfoProps = {
    profile: Profile | null;
    isOwnProfile: boolean;
};

const mockData = {
    profile: {
        name: 'John Doe',
        bio: 'Software Engineer at XYZ',
        email: 'johndoe@example.com'
    },
    isOwnProfile: true
};



const UserInfo: React.FC<UserInfoProps> = ({ profile, isOwnProfile }) => (
    <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm">
        <dl className="-my-3 divide-y divide-gray-100 text-sm">
            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Name</dt>
                <dd className="text-gray-700 sm:col-span-2">{profile?.name}</dd>
            </div>
            <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Bio</dt>
                <dd className="text-gray-700 sm:col-span-2">{profile?.bio}</dd>
            </div>
            {isOwnProfile && (
                <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-gray-900">Email</dt>
                    <dd className="text-gray-700 sm:col-span-2">{profile?.email}</dd>
                </div>
            )}
        </dl>
    </div>
);

const ProfilePage = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
    const { profileId } = useParams(); // Get profile ID from URL
    const [profile, setProfile] = useState(null);
    const isOwnProfile = !profileId; // Determine if viewing own profile

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`/api/profile/${profileId || 'me'}`);
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, [profileId]);

    return (
        <div>
            <UserInfo profile={profile} isOwnProfile={isOwnProfile} />
        </div>
    );
};

export default ProfilePage;

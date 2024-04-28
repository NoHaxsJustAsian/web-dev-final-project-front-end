import React from 'react';
import ProfileField from './ProfileField';

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

type UserInfoProps = {
    profile: Profile;
    onEdit: () => void;
};

const UserInfo: React.FC<UserInfoProps> = ({ profile, onEdit }) => (
    
    <article className="flow-root rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6 max-w-md mx-auto sm:mx-4">
    <h1 className="text-2xl font-bold">Profile</h1>
    <img src={profile.profileURL} className="h-40 w-40 rounded-full mx-auto" />
    <div className="mt-4 space-y-2">
        <h2 className="text-lg leading-6 font-medium text-gray-900">{`${profile.first_name} ${profile.last_name}`}</h2>
        <p className="text-sm font-medium text-green-500">@{profile.username}</p>
        <p className="text-sm text-pretty text-gray-500">{profile.email}</p> 
        <p className="text-sm text-pretty text-gray-500">{profile.role}</p>
    </div>
    <div className="flex justify-end p-3">
            <button onClick={onEdit} className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Edit
            </button>
        </div>
</article>
);

export default UserInfo;
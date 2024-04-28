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
    <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm">
        <img src={profile.profileURL} alt="Profile" />
        <ProfileField label="First Name" value={profile.first_name} editing={false} />
        <ProfileField label="Last Name" value={profile.last_name} editing={false} />
        <ProfileField label="Username" value={profile.username} editing={false} />
        <ProfileField label="Email" value={profile.email} editing={false} />
        <ProfileField label="Role" value={profile.role} editing={false} />
        <ProfileField label="Profile Picture" value={profile.profileURL} editing={false} />
        <div className="flex justify-end p-3">
            <button onClick={onEdit} className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Edit
            </button>
        </div>
    </div>
);

export default UserInfo;